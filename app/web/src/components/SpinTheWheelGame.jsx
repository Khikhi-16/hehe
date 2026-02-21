import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const REWARDS = [
  "Extra 10 Chocolates! 🍫",
  "You're the Party Star! ⭐",
  "Bonus Dance Moves! 💃",
  "Mystery Prize! 🎁",
  "Confetti Explosion! 🎊",
  "Lucky Guest! 🍀",
  "Party Champion! 🏆",
  "Surprise Reward! 🎉"
];

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#FF9F43'
];

const SpinTheWheelGame = ({ guestId, guestName, onBack }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const spinWheel = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setReward(null);

    // Calculate random rotation
    const spins = 5; // Minimum 5 full spins
    const randomSegment = Math.floor(Math.random() * REWARDS.length);
    const segmentAngle = 360 / REWARDS.length;
    
    // Target angle points to the top (270 degrees in standard circle, but let's align to 0)
    // We want the selected segment to land at the top (0 degrees relative to the pointer)
    const targetRotation = rotation + (360 * spins) + (360 - (randomSegment * segmentAngle));

    setRotation(targetRotation);

    // Wait for animation to finish (5 seconds)
    setTimeout(async () => {
      setIsSpinning(false);
      setReward(REWARDS[randomSegment]);
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6']
      });

      // Save score
      setIsSaving(true);
      try {
        await pb.collection('gameScores').create({
          guestId,
          guestName,
          gameType: 'wheel',
          score: randomSegment + 1, // Using index + 1 as score since schema requires a number
          createdAt: new Date().toISOString()
        }, { $autoCancel: false });
      } catch (error) {
        console.error('Failed to save spin result:', error);
      } finally {
        setIsSaving(false);
      }
    }, 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1671084905373-8b5a2720067b)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)' }} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 mb-8 text-center drop-shadow-lg">
          Spin to Win! 🎡
        </h1>

        {/* Wheel Container */}
        <div className="relative w-80 h-80 md:w-96 md:h-96 mb-12">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-400 drop-shadow-xl" />
          
          {/* The Wheel */}
          <motion.div 
            className="w-full h-full rounded-full border-8 border-white/20 shadow-2xl relative overflow-hidden"
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {REWARDS.map((_, index) => {
              const angle = (360 / REWARDS.length) * index;
              return (
                <div 
                  key={index}
                  className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                  style={{
                    transform: `rotate(${angle}deg) skewY(${90 - (360 / REWARDS.length)}deg)`,
                    backgroundColor: COLORS[index],
                    borderRight: '2px solid rgba(255,255,255,0.3)'
                  }}
                />
              );
            })}
            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-inner border-4 border-gray-200 z-10 flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-400 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Controls & Results */}
        <div className="w-full flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {reward ? (
              <motion.div 
                key="result"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white/10 backdrop-blur-md border border-white/30 p-6 rounded-2xl text-center w-full shadow-xl"
              >
                <p className="text-pink-200 text-sm font-medium mb-2">You won:</p>
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">{reward}</p>
                {isSaving && <p className="text-xs text-gray-300 animate-pulse">Saving result...</p>}
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={spinWheel}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw size={18} /> Spin Again
                  </button>
                  <button 
                    onClick={onBack}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="spin-btn" className="w-full flex flex-col gap-4">
                <button 
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 py-4 rounded-2xl font-extrabold text-2xl shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
                </button>
                <button 
                  onClick={onBack}
                  disabled={isSpinning}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <ArrowLeft size={18} /> Back to Party Hall
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SpinTheWheelGame;
