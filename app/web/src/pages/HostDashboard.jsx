import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHostAuth } from '@/contexts/HostAuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Helmet } from 'react-helmet';
import { Users, Gift, MessageSquare, Clock, Trophy, LogOut } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center space-x-4">
    <div className={`p-4 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

const HostDashboard = () => {
  const { logout, hostUser } = useHostAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    guests: 0,
    wishes: 0,
    gifts: 0,
    timeCapsule: 0,
    scores: 0
  });
  const [recentGuests, setRecentGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [guestsRes, wishesRes, giftsRes, timeCapsuleRes, scoresRes] = await Promise.all([
          pb.collection('guests').getList(1, 10, { sort: '-created', $autoCancel: false }),
          pb.collection('wishes').getList(1, 1, { $autoCancel: false }),
          pb.collection('gifts').getList(1, 1, { $autoCancel: false }),
          pb.collection('timeCapsule').getList(1, 1, { $autoCancel: false }),
          pb.collection('gameScores').getList(1, 1, { $autoCancel: false })
        ]);

        setStats({
          guests: guestsRes.totalItems,
          wishes: wishesRes.totalItems,
          gifts: giftsRes.totalItems,
          timeCapsule: timeCapsuleRes.totalItems,
          scores: scoresRes.totalItems
        });
        
        setRecentGuests(guestsRes.items);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/host-login');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Helmet>
        <title>Host Dashboard</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-purple-400">Party Control Panel</h1>
            <p className="text-gray-400 mt-1">Welcome back, {hostUser?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-700"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard title="Total Guests" value={stats.guests} icon={Users} color="bg-blue-500" />
          <StatCard title="Wishes Received" value={stats.wishes} icon={MessageSquare} color="bg-pink-500" />
          <StatCard title="Virtual Gifts" value={stats.gifts} icon={Gift} color="bg-purple-500" />
          <StatCard title="Time Capsules" value={stats.timeCapsule} icon={Clock} color="bg-indigo-500" />
          <StatCard title="Game Plays" value={stats.scores} icon={Trophy} color="bg-yellow-500" />
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Users className="mr-2 text-blue-400" /> Recent Arrivals
          </h2>
          
          {recentGuests.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No guests have arrived yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Avatar</th>
                    <th className="pb-3 font-medium">Arrival Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGuests.map((guest) => (
                    <tr key={guest.id} className="border-b border-gray-700/50 last:border-0">
                      <td className="py-4 font-medium">{guest.name}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                          {guest.avatar || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">
                        {new Date(guest.created).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
