import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const FOOD_ITEMS = [
  { id: 'cake', emoji: '🍰', name: 'Birthday Cake', message: 'Remember eating this at every birthday? 🎂', color: 'bg-pink-100', position: 'top-4 left-1/2 -translate-x-1/2' },
  { id: 'samosa', emoji: '🥟', name: 'Crispy Samosa', message: 'Childhood favorite! 🥘', color: 'bg-orange-100', position: 'top-1/2 right-4 -translate-y-1/2' },
  { id: 'chocolate', emoji: '🍬', name: 'Shiny Chocolate', message: 'The best part of the party! 🍫', color: 'bg-purple-100', position: 'bottom-4 left-1/2 -translate-x-1/2' },
  { id: 'namkeen', emoji: '🥨', name: 'Snack Mix', message: 'Sweet memories! 🍬', color: 'bg-yellow-100', position: 'top-1/2 left-4 -translate-y-1/2' }
];

const NostalgiaFoodPlate = ({ onBack }) => {
  const [activeMessage, setActiveMessage] = useState(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center relative p-4 overflow-hidden"
    >
      {/* Soft background texture */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1666973523950-3ca3149d348c)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px)' }}
      />

      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="bg-white/80 hover:bg-white shadow-md text-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-gray-200"
        >
          <ArrowLeft size={18} /> Back to Party Hall
        </button>
      </div>

      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-3 font-serif">
          Childhood Birthday Memories 🎈
        </h1>
        <p className="text-amber-600/80 text-lg">Click the treats to reveal memories</p>
      </div>

      {/* The Plate */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_0_40px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center z-10">
        {/* Inner plate ring */}
        <div className="absolute inset-4 rounded-full border border-gray-100 shadow-inner" />
        
        {FOOD_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            className={`absolute w-24 h-24 md:w-28 md:h-28 rounded-full ${item.color} shadow-lg flex items-center justify-center text-5xl md:text-6xl hover:z-20 transition-colors border-2 border-white ${item.position}`}
            whileHover={{ scale: 1.1, rotate: Math.random() * 20 - 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveMessage(item.message)}
          >
            {item.emoji}
          </motion.button>
        ))}

        {/* Center decorative element */}
        <div className="w-16 h-16 rounded-full bg-amber-50/50 border border-amber-100 flex items-center justify-center text-2xl opacity-50">
          ✨
        </div>
      </div>

      {/* Message Display */}
      <div className="h-24 mt-12 flex items-center justify-center z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {activeMessage ? (
            <motion.div
              key={activeMessage}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-white px-8 py-4 rounded-2xl shadow-xl border border-amber-100 text-center w-full"
            >
              <p className="text-xl font-medium text-amber-900">{activeMessage}</p>
            </motion.div>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 italic"
            >
              Select a treat...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NostalgiaFoodPlate;
