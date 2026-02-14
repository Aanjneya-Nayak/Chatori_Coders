
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email, name }));
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20 relative overflow-hidden bg-texture">
       {/* Background accent */}
       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#B22222]/5 blur-[200px] rounded-full -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="recipe-card p-12 rounded-[50px] border border-[#B22222]/20 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-24 h-24 spice-gradient rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#B22222]/30 transform rotate-12">
              <span className="text-5xl font-black text-white">F</span>
            </div>
            <h2 className="text-4xl font-black mb-3 font-serif">Join the Journey</h2>
            <p className="text-[#FFC857] font-accent text-3xl">Become a Flavor Architect</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 ml-4">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#B22222] transition-all font-bold text-lg"
                placeholder="Chef Gordon"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 ml-4">Email</label>
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
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 ml-4">Secret Passcode</label>
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
              className="w-full py-6 spice-gradient rounded-3xl font-black text-xl text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest mt-4"
            >
              Begin Journey
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 font-bold">
              Already a member? {' '}
              <button onClick={() => navigate('/login')} className="text-[#FF7A00] hover:underline">Log in</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
