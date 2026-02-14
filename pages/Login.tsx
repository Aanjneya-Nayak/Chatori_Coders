
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0].toUpperCase() }));
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20 relative overflow-hidden bg-texture">
      {/* Blurred background dish */}
      <div className="absolute inset-0 z-0 opacity-20 scale-110 pointer-events-none">
         <img src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover blur-3xl" alt="bg" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="recipe-card p-12 rounded-[50px] border border-[#B22222]/20 shadow-2xl">
          <div className="text-center mb-12">
            <div className="w-24 h-24 spice-gradient rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#B22222]/30 transform -rotate-12">
              <span className="text-5xl font-black text-white">F</span>
            </div>
            <h2 className="text-4xl font-black mb-3 font-serif">Welcome Back</h2>
            <p className="text-[#FFC857] font-accent text-3xl">Ready for a new discovery?</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 ml-4">Chef Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#B22222] transition-all font-bold text-lg"
                placeholder="chef@flavorshift.ai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 ml-4">Kitchen Key</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#B22222] transition-all font-bold text-lg"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-6 spice-gradient rounded-3xl font-black text-xl text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              Enter Kitchen
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-gray-500 font-bold">
              New to the pantry? {' '}
              <button onClick={() => navigate('/signup')} className="text-[#FF7A00] hover:underline">Apply for Entry</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
