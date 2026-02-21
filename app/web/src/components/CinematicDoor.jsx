import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const CinematicDoor = ({ guestData, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Auto open door after a short delay
    const timer = setTimeout(() => {
      setIsOpen(true);
      
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Transition to next phase after animation
      setTimeout(() => {
        onComplete();
      }, 4000);

    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative perspective-1000">
      
      {/* Background glow when open */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-pink-900/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 text-center mb-32">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
        >
          Welcome to my birthday party,
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 drop-shadow-xl"
        >
          {guestData.name}!
        </motion.h2>
      </div>

      {/* The Doors */}
      <div className="absolute inset-0 flex pointer-events-none">
        {/* Left Door */}
        <motion.div 
          className="w-1/2 h-full bg-gradient-to-r from-gray-900 to-gray-800 border-r-4 border-yellow-600/50 shadow-2xl origin-left"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isOpen ? -100 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div className="absolute right-8 top-1/2 w-4 h-16 bg-yellow-600/80 rounded-full transform -translate-y-1/2 shadow-lg" />
        </motion.div>
        
        {/* Right Door */}
        <motion.div 
          className="w-1/2 h-full bg-gradient-to-l from-gray-900 to-gray-800 border-l-4 border-yellow-600/50 shadow-2xl origin-right"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isOpen ? 100 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div className="absolute left-8 top-1/2 w-4 h-16 bg-yellow-600/80 rounded-full transform -translate-y-1/2 shadow-lg" />
        </motion.div>
      </div>

    </div>
  );
};

export default CinematicDoor;
