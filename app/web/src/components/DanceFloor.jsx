import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Music } from 'lucide-react';

const DANCERS = ['💃', '🕺', '👯‍♀️', '👯‍♂️', '🤖', '👽', '🦄', '🦖'];
const COLORS = ['#FF00FF', '#00FFFF', '#FFFF00', '#00FF00', '#FF0000'];

const DanceFloor = ({ onBack }) => {
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [dancers, setDancers] = useState([]);

  useEffect(() => {
    // Initialize random dancers
    const initialDancers = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      emoji: DANCERS[Math.floor(Math.random() * DANCERS.length)],
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 60 + 20, // 20% to 80%
      delay: Math.random() * 2
    }));
    setDancers(initialDancers);

    // Disco light interval
    const interval = setInterval(() => {
      setActiveColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleFloorClick = (e) => {
    // Add a temporary burst effect at click location
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newDancer = {
      id: Date.now(),
      emoji: '✨',
      x,
      y,
      delay: 0,
      isBurst: true
    };
    
    setDancers(prev => [...prev, newDancer]);
    
    // Remove burst after 1s
    setTimeout(() => {
      setDancers(prev => prev.filter(d => d.id !== newDancer.id));
    }, 1000);
  };

  const handleDancerClick = (e, id) => {
    e.stopPropagation();
    setDancers(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, emoji: '🔥', scale: 1.5 };
      }
      return d;
    }));
    
    setTimeout(() => {
      setDancers(prev => prev.map(d => {
        if (d.id === id) {
          return { ...d, emoji: DANCERS[Math.floor(Math.random() * DANCERS.length)], scale: 1 };
        }
        return d;
      }));
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden bg-black select-none"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578838405026-47b55b5699a5)' }}
      />

      {/* Dynamic Disco Overlay */}
      <motion.div 
        className="absolute inset-0 mix-blend-overlay opacity-50"
        animate={{ backgroundColor: activeColor }}
        transition={{ duration: 0.5 }}
      />

      {/* Grid Floor */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(transparent 95%, rgba(255,255,255,0.5) 100%), linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.5) 100%)',
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)',
          transformOrigin: 'bottom'
        }}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-white/20"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 flex items-center gap-3">
          <Music className="text-pink-500 animate-bounce" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            Let's Dance! 🎵
          </h1>
        </div>
      </div>

      {/* Interactive Dance Area */}
      <div 
        className="absolute inset-0 z-10 cursor-crosshair"
        onClick={handleFloorClick}
      >
        {dancers.map(dancer => (
          <motion.div
            key={dancer.id}
            className="absolute text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] cursor-pointer"
            style={{ left: `${dancer.x}%`, top: `${dancer.y}%`, transform: 'translate(-50%, -50%)' }}
            animate={dancer.isBurst ? {
              scale: [0, 2, 0],
              opacity: [1, 0],
              rotate: [0, 180]
            } : {
              y: [0, -30, 0],
              rotate: [-10, 10, -10],
              scale: dancer.scale || 1
            }}
            transition={dancer.isBurst ? {
              duration: 1
            } : {
              duration: 1,
              repeat: Infinity,
              delay: dancer.delay,
              ease: "easeInOut"
            }}
            onClick={(e) => !dancer.isBurst && handleDancerClick(e, dancer.id)}
          >
            {dancer.emoji}
          </motion.div>
        ))}
      </div>

      {/* Disco Ball */}
      <motion.div 
        className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl md:text-8xl z-20 drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        🪩
      </motion.div>
    </motion.div>
  );
};

export default DanceFloor;
