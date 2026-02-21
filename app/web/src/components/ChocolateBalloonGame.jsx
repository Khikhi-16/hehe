import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft } from 'lucide-react';

const ChocolateBalloonGame = ({ guestId, guestName, onBack }) => {
  const [gameState, setGameState] = useState('start'); // start, playing, ended
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [chocolates, setChocolates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Timer logic
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Spawner logic
  useEffect(() => {
    let spawner;
    if (gameState === 'playing') {
      spawner = setInterval(() => {
        setChocolates((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            left: Math.random() * 80 + 10, // 10% to 90%
            duration: Math.random() * 2 + 2, // 2s to 4s
          },
        ]);
      }, 400); // Spawn a chocolate every 400ms
    }
    return () => clearInterval(spawner);
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setChocolates([]);
    
    // Initial burst of chocolates
    const initialChocolates = Array.from({ length: 10 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      left: Math.random() * 80 + 10,
      duration: Math.random() * 2 + 2,
    }));
    setChocolates(initialChocolates);
  };

  const endGame = async () => {
    setGameState('ended');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4A2511', '#8B4513', '#D2691E']
    });

    setIsSaving(true);
    try {
      await pb.collection('gameScores').create({
        guestId,
        guestName,
        gameType: 'chocolate',
        score,
        createdAt: new Date().toISOString()
      }, { $autoCancel: false });
    } catch (error) {
      console.error('Failed to save score:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChocolateClick = (id) => {
    if (gameState !== 'playing') return;
    setScore((prev) => prev + 1);
    setChocolates((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-pink-200 via-purple-200 to-yellow-100 select-none"
    >
      {/* Header / HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/50">
          <p className="text-xl font-bold text-purple-800">Score: <span className="text-3xl text-pink-600">{score}</span></p>
        </div>
        <div className={`bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/50 transition-colors ${timeLeft <= 10 ? 'bg-red-100/90 border-red-300' : ''}`}>
          <p className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-purple-800'}`}>
            Time: <span className="text-3xl">{timeLeft}s</span>
          </p>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <AnimatePresence>
          {gameState === 'start' && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={startGame}
            >
              <div className="relative w-48 h-64 bg-gradient-to-br from-pink-400 to-red-500 rounded-[50%] shadow-2xl flex items-center justify-center border-4 border-pink-300 animate-bounce">
                <span className="text-6xl">🍫</span>
                <div className="absolute -bottom-8 w-1 h-16 bg-gray-300"></div>
              </div>
              <div className="mt-12 bg-white/90 px-8 py-4 rounded-full shadow-xl text-center">
                <h2 className="text-2xl font-bold text-purple-800 mb-2">Pop the Balloon!</h2>
                <p className="text-gray-600">Click to start. Catch as many chocolates as you can in 30s!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === 'playing' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {chocolates.map((choc) => (
              <motion.div
                key={choc.id}
                initial={{ y: -100, x: `${choc.left}vw`, rotate: 0 }}
                animate={{ y: '120vh', rotate: 360 }}
                transition={{ duration: choc.duration, ease: 'linear' }}
                onAnimationComplete={() => {
                  setChocolates((prev) => prev.filter((c) => c.id !== choc.id));
                }}
                className="absolute text-4xl md:text-5xl cursor-pointer pointer-events-auto hover:scale-110 active:scale-90 transition-transform"
                onMouseDown={() => handleChocolateClick(choc.id)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleChocolateClick(choc.id);
                }}
              >
                🍫
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {gameState === 'ended' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4 border-2 border-pink-200"
            >
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                Time's Up! 🎈
              </h2>
              <p className="text-2xl text-gray-700 mb-6">
                You collected <span className="font-bold text-pink-600 text-4xl block my-2">{score}</span> chocolates! 🍫🎉
              </p>
              
              {isSaving ? (
                <p className="text-gray-500 mb-6 animate-pulse">Saving your score...</p>
              ) : (
                <p className="text-green-500 font-medium mb-6">Score saved successfully! ✨</p>
              )}

              <button
                onClick={onBack}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} /> Back to Party Hall
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChocolateBalloonGame;
