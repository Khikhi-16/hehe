import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const CakeCuttingExperience = ({ onComplete }) => {
  const [isCut, setIsCut] = useState(false);

  const handleCut = () => {
    if (isCut) return;
    setIsCut(true);
    
    // Trigger celebration effects
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffb6c1', '#ff69b4', '#ff1493', '#db7093', '#c71585']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffb6c1', '#ff69b4', '#ff1493', '#db7093', '#c71585']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Auto return after 5 seconds
    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-pink-200 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Flashing lights effect when cut */}
      <AnimatePresence>
        {isCut && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-8 drop-shadow-sm"
        >
          {isCut ? 'Making a wish... 🎂✨' : 'Time to cut the cake!'}
        </motion.h2>

        {!isCut && (
          <motion.p 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-pink-600 font-medium mb-8 text-lg"
          >
            Tap the cake to cut it!
          </motion.p>
        )}

        <div 
          className="relative cursor-pointer group"
          onClick={handleCut}
        >
          {/* Left Half of Cake */}
          <motion.div
            animate={isCut ? { x: -30, rotate: -5, opacity: 0.9 } : { x: 0, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="absolute top-0 left-0 w-1/2 h-full overflow-hidden z-20"
          >
            <img 
              src="https://images.unsplash.com/photo-1620513846464-f26068cbf76e" 
              alt="Birthday Cake Left" 
              className="w-[300px] max-w-none h-[300px] object-cover rounded-l-3xl shadow-2xl"
            />
          </motion.div>

          {/* Right Half of Cake */}
          <motion.div
            animate={isCut ? { x: 30, rotate: 5, opacity: 0.9 } : { x: 0, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="absolute top-0 right-0 w-1/2 h-full overflow-hidden z-20 flex justify-end"
          >
            <img 
              src="https://images.unsplash.com/photo-1620513846464-f26068cbf76e" 
              alt="Birthday Cake Right" 
              className="w-[300px] max-w-none h-[300px] object-cover rounded-r-3xl shadow-2xl object-right"
            />
          </motion.div>

          {/* Base invisible container to maintain size */}
          <div className="w-[300px] h-[300px] opacity-0"></div>

          {/* Glow effect behind cake */}
          <div className="absolute inset-0 bg-pink-400/30 blur-3xl rounded-full -z-10 transform scale-110"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default CakeCuttingExperience;
