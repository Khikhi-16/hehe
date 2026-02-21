import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft, Users, Gift, Clock, Target, Trophy, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`bg-gradient-to-br ${color} p-6 rounded-3xl shadow-xl border border-white/20 flex items-center gap-4 text-white`}
  >
    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
      <Icon size={32} />
    </div>
    <div>
      <p className="text-white/80 font-medium text-sm uppercase tracking-wider">{title}</p>
      <h3 className="text-4xl font-extrabold drop-shadow-md">{value}</h3>
    </div>
  </motion.div>
);

const PublicDashboard = ({ onBack }) => {
  const [stats, setStats] = useState({
    guests: 0,
    chocolates: 0,
    spins: 0,
    gifts: 0,
    timeCapsules: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStats = async () => {
    try {
      // Fetch counts that are definitely public
      const [guestsRes, giftsRes, timeCapsuleRes] = await Promise.allSettled([
        pb.collection('guests').getList(1, 1, { $autoCancel: false }),
        pb.collection('gifts').getList(1, 1, { $autoCancel: false }),
        pb.collection('timeCapsule').getList(1, 1, { $autoCancel: false })
      ]);

      let chocolatesTotal = 0;
      let spinsTotal = 0;
      let topPlayers = [];

      // Attempt to fetch gameScores (might fail if listRule is not updated yet)
      try {
        const scoresRes = await pb.collection('gameScores').getFullList({ $autoCancel: false });
        
        const chocolateScores = scoresRes.filter(s => s.gameType === 'chocolate');
        chocolatesTotal = chocolateScores.reduce((sum, s) => sum + (s.score || 0), 0);
        spinsTotal = scoresRes.filter(s => s.gameType === 'wheel').length;

        // Calculate leaderboard
        const playerScores = {};
        chocolateScores.forEach(s => {
          if (!playerScores[s.guestName]) playerScores[s.guestName] = 0;
          playerScores[s.guestName] += (s.score || 0);
        });

        topPlayers = Object.entries(playerScores)
          .map(([name, score]) => ({ name, score }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
          
        setErrorMsg(''); // Clear error if successful
      } catch (scoreErr) {
        console.warn("Could not fetch gameScores (likely due to listRule restrictions):", scoreErr);
        setErrorMsg("Game scores are currently hidden by the host.");
      }

      setStats({
        guests: guestsRes.status === 'fulfilled' ? guestsRes.value.totalItems : 0,
        gifts: giftsRes.status === 'fulfilled' ? giftsRes.value.totalItems : 0,
        timeCapsules: timeCapsuleRes.status === 'fulfilled' ? timeCapsuleRes.value.totalItems : 0,
        chocolates: chocolatesTotal,
        spins: spinsTotal
      });
      
      setLeaderboard(topPlayers);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative bg-slate-900 p-4 md:p-8 overflow-x-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1699730185428-d11054059c7f)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-slate-900/90 to-slate-900 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-white/20"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 drop-shadow-lg">
            Party Stats 🎉
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {errorMsg && (
          <div className="mb-8 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <AlertCircle size={20} />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Guests" value={stats.guests} icon={Users} color="from-blue-500 to-cyan-600" delay={0.1} />
          <StatCard title="Chocolates Collected" value={stats.chocolates} icon={Target} color="from-pink-500 to-rose-600" delay={0.2} />
          <StatCard title="Wheel Spins" value={stats.spins} icon={Target} color="from-purple-500 to-indigo-600" delay={0.3} />
          <StatCard title="Gifts Submitted" value={stats.gifts} icon={Gift} color="from-emerald-400 to-teal-600" delay={0.4} />
          <StatCard title="Time Capsules" value={stats.timeCapsules} icon={Clock} color="from-amber-400 to-orange-500" delay={0.5} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="text-yellow-400" size={32} />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Chocolate Champions</h2>
          </div>

          {loading && leaderboard.length === 0 ? (
            <div className="text-center py-8 text-white/50 animate-pulse">Loading leaderboard...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-white/50">No scores recorded yet. Be the first!</div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((player, index) => (
                <motion.div 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                  className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 flex items-center justify-between border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]' :
                      index === 1 ? 'bg-gray-300 text-gray-800' :
                      index === 2 ? 'bg-amber-600 text-amber-100' :
                      'bg-white/20 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    <span className="text-xl font-medium text-white">{player.name || 'Anonymous Guest'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-pink-400">{player.score}</span>
                    <span className="text-xl">🍫</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PublicDashboard;
