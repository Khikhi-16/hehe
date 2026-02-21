import React, { useState } from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';

const avatars = [
  { id: 'Party Guest', emoji: '🥳', color: 'from-yellow-400 to-orange-500' },
  { id: 'Sweet Guest', emoji: '🥰', color: 'from-pink-400 to-rose-500' },
  { id: 'Cool Guest', emoji: '😎', color: 'from-blue-400 to-cyan-500' },
  { id: 'Drama Guest', emoji: '🎭', color: 'from-purple-400 to-indigo-500' },
];

const AvatarSelection = ({ guestData, onComplete }) => {
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = async (avatarId) => {
    setSelected(avatarId);
    setIsSubmitting(true);

    try {
      await pb.collection('guests').update(guestData.id, {
        avatar: avatarId
      }, { $autoCancel: false });
      
      setTimeout(() => {
        onComplete({ avatar: avatarId });
      }, 600); // Small delay for animation
    } catch (err) {
      console.error("Error updating avatar:", err);
      setIsSubmitting(false);
      setSelected(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4"
    >
      <div className="max-w-2xl w-full text-center">
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
        >
          Hi, {guestData.name}! 👋
        </motion.h2>
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-300 mb-12 text-lg"
        >
          Choose your party vibe
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {avatars.map((avatar, index) => (
            <motion.button
              key={avatar.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(avatar.id)}
              disabled={isSubmitting}
              className={`relative aspect-square rounded-3xl flex flex-col items-center justify-center p-4 transition-all ${
                selected === avatar.id 
                  ? 'ring-4 ring-white scale-105 bg-gradient-to-br ' + avatar.color
                  : 'bg-white/10 hover:bg-white/20 border border-white/10'
              }`}
            >
              <span className="text-6xl mb-4 block">{avatar.emoji}</span>
              <span className="text-white font-medium text-sm">{avatar.id}</span>
              
              {selected === avatar.id && (
                <motion.div 
                  layoutId="outline"
                  className="absolute inset-0 rounded-3xl border-2 border-white"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AvatarSelection;
