import React, { useState } from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { Gift, Music, Cake, Target, Utensils, Clock, LayoutDashboard, LogOut, Send } from 'lucide-react';

const MainPartyHall = ({ guestId, guestName, guestAvatar, onNavigate }) => {
  const [wish, setWish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleWishSubmit = async (e) => {
    e.preventDefault();
    if (!wish.trim()) return;
    
    setIsSubmitting(true);
    try {
      await pb.collection('wishes').create({
        guestId,
        guestName,
        message: wish.trim(),
        createdAt: new Date().toISOString()
      }, { $autoCancel: false });
      
      setWish('');
      setToastMsg('Wish sent successfully! ✨');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (error) {
      console.error('Error submitting wish:', error);
      setToastMsg('Failed to send wish. Try again!');
      setTimeout(() => setToastMsg(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave the party?')) {
      onNavigate(13); // Navigate to Thank You Screen
    }
  };

  const activities = [
    { id: 5, name: 'Chocolate Balloon Game', icon: <Target size={24} />, color: 'from-pink-400 to-red-400' },
    { id: 6, name: 'Cake Cutting', icon: <Cake size={24} />, color: 'from-yellow-400 to-orange-400' },
    { id: 7, name: 'Spin The Wheel', icon: <Target size={24} />, color: 'from-purple-400 to-indigo-400' },
    { id: 8, name: 'Dance Floor', icon: <Music size={24} />, color: 'from-blue-400 to-cyan-400' },
    { id: 9, name: 'Nostalgia Food Plate', icon: <Utensils size={24} />, color: 'from-green-400 to-emerald-400' },
    { id: 10, name: 'Gift Submission', icon: <Gift size={24} />, color: 'from-rose-400 to-pink-500' },
    { id: 11, name: 'Time Capsule', icon: <Clock size={24} />, color: 'from-amber-400 to-yellow-500' },
    { id: 12, name: 'Public Dashboard', icon: <LayoutDashboard size={24} />, color: 'from-teal-400 to-emerald-500' },
  ];

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
      className="min-h-screen relative bg-gray-900 text-white"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1698833280997-1869bfa2adb0)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-900/80 via-pink-900/60 to-gray-900/90" />

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
        
        {/* Header Section */}
        <div className="w-full flex justify-between items-start mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 flex items-center gap-3 shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-3xl shadow-inner border-2 border-white/50">
              {getAvatarEmoji(guestAvatar)}
            </div>
            <div>
              <p className="text-sm text-pink-200 font-medium">Playing as</p>
              <p className="font-bold text-xl">{guestName}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLeave}
            className="bg-red-500/80 hover:bg-red-600 backdrop-blur-md text-white px-4 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg border border-red-400/50"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline font-medium">Leave Party</span>
          </button>
        </div>

        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4 drop-shadow-lg">
            Welcome to my birthday party, {guestName}! 🎉
          </h1>
          <p className="text-xl text-pink-100 drop-shadow-md">
            Have fun, explore the rooms, and celebrate!
          </p>
        </div>

        {/* Wish Box */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4 text-yellow-200 flex items-center gap-2">
            <Gift className="text-pink-400" /> Leave a Birthday Wish
          </h2>
          <form onSubmit={handleWishSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Leave a wish for the birthday person..."
              className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !wish.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Wish</>}
            </button>
          </form>
          {toastMsg && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="text-green-300 mt-3 font-medium text-center bg-green-900/30 py-2 rounded-lg border border-green-500/30"
            >
              {toastMsg}
            </motion.p>
          )}
        </div>

        {/* Navigation Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-12">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => onNavigate(activity.id)}
              className={`bg-gradient-to-br ${activity.color} p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 group border border-white/20`}
            >
              <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                {activity.icon}
              </div>
              <span className="font-bold text-lg text-center drop-shadow-md">{activity.name}</span>
            </button>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default MainPartyHall;
