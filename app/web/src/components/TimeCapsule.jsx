import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft, Lock } from 'lucide-react';

const MAX_CHARS = 500;

const TimeCapsule = ({ guestId, guestName, onBack }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.length > MAX_CHARS) return;

    setIsSubmitting(true);
    setError('');

    try {
      await pb.collection('timeCapsule').create({
        guestId,
        guestName,
        message: message.trim(),
        createdAt: new Date().toISOString()
      }, { $autoCancel: false });

      setIsSuccess(true);
      setMessage('');
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error sealing time capsule:', err);
      setError('Failed to seal message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none mix-blend-luminosity"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1535740470346-fc64832a9219)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-indigo-100 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-indigo-500/30"
        >
          <ArrowLeft size={18} /> Back to Party Hall
        </button>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-500/30 p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.5)] border-2 border-indigo-300/50">
            ⏳
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
            The Time Capsule
          </h1>
          <p className="text-indigo-200/70 mt-3 font-serif italic text-lg">
            Leave a memory for the future...
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <motion.div 
                animate={{ rotateY: 360 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="text-6xl mb-6"
              >
                🔒
              </motion.div>
              <h2 className="text-2xl font-bold text-indigo-200 mb-3 font-serif">
                Your message has been sealed in the time capsule! ⏰✨
              </h2>
              <p className="text-indigo-300/60 italic">It will be cherished for years to come.</p>
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
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a special message for the birthday person... 💌"
                  className="w-full px-6 py-5 rounded-2xl bg-slate-800/50 border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition-all resize-none h-48 text-indigo-100 placeholder-indigo-300/40 font-serif text-lg leading-relaxed"
                  required
                  maxLength={MAX_CHARS}
                  disabled={isSubmitting}
                />
                <div className={`absolute bottom-4 right-4 text-sm font-medium ${message.length >= MAX_CHARS ? 'text-red-400' : 'text-indigo-300/50'}`}>
                  {message.length} / {MAX_CHARS}
                </div>
              </div>

              {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting || !message.trim() || message.length > MAX_CHARS}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-indigo-50 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-serif text-lg tracking-wide"
              >
                {isSubmitting ? 'Sealing...' : <><Lock size={20} /> Seal Message in Time Capsule</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TimeCapsule;
