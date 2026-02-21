import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const EMOJIS = ['🎁', '🎀', '💝', '🎊', '🌟', '🎈', '🎉', '💐'];

const GiftSubmission = ({ guestId, guestName, onBack }) => {
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎁');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await pb.collection('gifts').create({
        guestId,
        guestName,
        giftMessage: message.trim(),
        emoji: selectedEmoji,
        createdAt: new Date().toISOString()
      }, { $autoCancel: false });

      setIsSuccess(true);
      setMessage('');
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#FFB6C1', '#FF1493', '#DB7093']
      });

      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Error submitting gift:', err);
      setError('Failed to send gift. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1697717852279-cc39a8eb481a)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="bg-white/80 hover:bg-white shadow-md text-pink-800 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-pink-200"
        >
          <ArrowLeft size={18} /> Back to Party Hall
        </button>
      </div>

      <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg border-4 border-white">
            {selectedEmoji}
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
            Send a Virtual Gift
          </h1>
          <p className="text-pink-800/70 mt-2">Wrap your wishes in a beautiful package!</p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center py-8"
            >
              <div className="text-6xl mb-4 animate-bounce">🎁</div>
              <h2 className="text-2xl font-bold text-pink-600 mb-2">Your gift has been delivered!</h2>
              <p className="text-pink-800/70">Thank you for making the party special.</p>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-pink-800 mb-3">Choose a Gift Tag</label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-3xl p-3 rounded-2xl transition-all ${selectedEmoji === emoji ? 'bg-pink-100 scale-110 shadow-inner border-2 border-pink-300' : 'bg-gray-50 hover:bg-pink-50 border border-gray-100 hover:scale-105'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-pink-800 mb-2">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a gift message for the birthday person..."
                  className="w-full px-4 py-3 rounded-xl bg-white border-2 border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all resize-none h-32 text-gray-800 placeholder-gray-400"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                {isSubmitting ? 'Wrapping Gift...' : <><Gift size={20} /> Submit Gift</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GiftSubmission;
