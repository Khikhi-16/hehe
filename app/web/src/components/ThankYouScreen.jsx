import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Share2, Home, Gift, Trophy, Target, Gamepad2 } from 'lucide-react';
import { getGuestStats } from '@/lib/getGuestStats.js';

const ThankYouScreen = ({ guestId, guestName, guestAvatar, onLeave }) => {
  const [stats, setStats] = useState({ chocolatesCollected: 0, wheelSpins: 0, gamesPlayed: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [giftOpened, setGiftOpened] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (guestId) {
        const data = await getGuestStats(guestId);
        setStats(data);
      }
      setLoadingStats(false);
    };
    fetchStats();
  }, [guestId]);

  const handleOpenGift = () => {
    if (giftOpened) return;
    setGiftOpened(true);
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347']
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setToastMsg('Party link copied to clipboard! 📋');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      setToastMsg('Failed to copy link.');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const getAvatarEmoji = (avatarName) => {
    switch(avatarName) {
      case 'Party Guest': return '🥳';
      case 'Sweet Guest': return '🥰';
      case 'Cool Guest': return '😎';
      case 'Drama Guest': return '🎭';
      default: return '👤';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1589838248191-a6e9a9dfe130)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="relative z-10 w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8 md:p-12 text-center">
        
        {/* Header & Avatar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-xl border-4 border-white">
            {getAvatarEmoji(guestAvatar)}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4 font-serif">
            Thank you, {guestName}!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium max-w-xl mx-auto">
            Your presence made this day unforgettable. Thank you for celebrating with me! 🎂💕
          </p>
        </motion.div>

        {/* Virtual Return Gift */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100 shadow-inner relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605748345655-75e2c52b30c3)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          
          <AnimatePresence mode="wait">
            {!giftOpened ? (
              <motion.div 
                key="closed"
                exit={{ scale: 0, opacity: 0 }}
                className="relative z-10 cursor-pointer group"
                onClick={handleOpenGift}
              >
                <div className="text-7xl mb-4 group-hover:scale-110 transition-transform animate-bounce">🎁</div>
                <p className="text-pink-600 font-bold text-lg">Tap to open your return gift!</p>
              </motion.div>
            ) : (
              <motion.div 
                key="opened"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(250,204,21,0.6)] border-4 border-white mb-4">
                  🌟
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Here's a little something for you! ✨</h3>
                <p className="text-purple-600 font-medium">Official Party VIP Badge</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Trophy className="text-yellow-500" /> Your Party Stats
          </h3>
          
          {loadingStats ? (
            <div className="text-gray-500 animate-pulse">Calculating your fun...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                <div className="bg-pink-100 p-3 rounded-full text-pink-600 mb-2"><Gift size={24} /></div>
                <p className="text-2xl font-bold text-gray-800">{stats.chocolatesCollected}</p>
                <p className="text-sm text-gray-500 font-medium">Chocolates</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600 mb-2"><Target size={24} /></div>
                <p className="text-2xl font-bold text-gray-800">{stats.wheelSpins}</p>
                <p className="text-sm text-gray-500 font-medium">Wheel Spins</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 mb-2"><Gamepad2 size={24} /></div>
                <p className="text-2xl font-bold text-gray-800">{stats.gamesPlayed}</p>
                <p className="text-sm text-gray-500 font-medium">Games Played</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button 
            onClick={handleShare}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-1"
          >
            <Share2 size={20} /> Share Party Link
          </button>
          <button 
            onClick={onLeave}
            className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md border border-gray-200 transition-all transform hover:-translate-y-1"
          >
            <Home size={20} /> Leave Party
          </button>
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-medium z-50"
            >
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default ThankYouScreen;
