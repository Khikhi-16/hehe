import React, { useState } from 'react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';

const NameEntryScreen = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const record = await pb.collection('guests').create({
        name: name.trim()
      }, { $autoCancel: false });
      
      onComplete({ id: record.id, name: record.name });
    } catch (err) {
      console.error("Error creating guest:", err);
      setError("Oops! Couldn't save your name. Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4"
    >
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6">
          You're Invited!
        </h1>
        <p className="text-gray-300 mb-8">Please enter your name to join the party.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xl text-center focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500 transition-all"
              required
              maxLength={50}
              disabled={isSubmitting}
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg hover:from-pink-400 hover:to-purple-500 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-purple-500/30"
          >
            {isSubmitting ? 'Entering...' : 'Enter Party'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default NameEntryScreen;
