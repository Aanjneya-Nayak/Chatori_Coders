
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('user');
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')!) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Culinary Hub', icon: '🍲', path: '/dashboard' },
    { id: 'saved', label: 'My Pantry', icon: '🍶', path: '/pantry' },
    { id: 'discover', label: 'Taste Map', icon: '🌍', path: '/taste-map' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A1A1A]">
      {/* Sidebar - Warm textured panel */}
      {isLoggedIn && location.pathname !== '/' && (
        <aside className="w-full md:w-72 bg-[#141414] border-r border-white/5 md:h-screen sticky top-0 flex flex-col p-8 z-50">
          <div 
            className="flex items-center gap-4 mb-16 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 spice-gradient rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(178,34,34,0.4)] group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-2xl">F</span>
            </div>
            <div>
               <span className="text-2xl font-black tracking-tighter block leading-none">Flavor<span className="text-[#FF7A00]">Shift</span></span>
               <span className="text-[10px] font-accent text-[#FFC857] tracking-widest uppercase font-bold">A Global Journey</span>
            </div>
          </div>

          <nav className="flex-1 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.path !== '#' && navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                  location.pathname === item.path 
                    ? 'bg-[#B22222]/10 text-[#FFC857] border border-[#B22222]/30 shadow-[inset_0_0_10px_rgba(178,34,34,0.1)]' 
                    : 'text-gray-500 hover:text-[#FFF3E0] hover:bg-white/5'
                }`}
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
            >
              <span className="text-2xl opacity-70">🚪</span>
              <span className="font-bold text-sm tracking-wide">Leave Kitchen</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        <header className={`h-24 flex items-center justify-between px-10 z-40 ${location.pathname === '/' ? 'fixed top-0 left-0 right-0' : 'sticky top-0 glass border-b border-white/5'}`}>
          {location.pathname === '/' ? (
             <div 
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 spice-gradient rounded-xl flex items-center justify-center shadow-lg shadow-[#B22222]/20">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <span className="text-2xl font-black tracking-tighter">Flavor<span className="text-[#FF7A00]">Shift</span></span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-accent text-[#FFC857] text-2xl">Serving</span>
              <span className="text-gray-100 text-sm font-black uppercase tracking-[0.2em]">
                {location.pathname.replace('/', '') || 'Inspiration'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-8">
            {isLoggedIn ? (
              <div className="flex items-center gap-5">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-[#FFF3E0] leading-none mb-1">{user?.name}</p>
                  <p className="text-[10px] font-bold text-[#FFC857] uppercase tracking-widest">Master Chef</p>
                </div>
                <div className="w-12 h-12 rounded-2xl border-2 border-[#B22222]/30 p-1 overflow-hidden shadow-lg shadow-black">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Chef" className="w-full h-full bg-[#B22222]/20 rounded-xl object-cover" />
                </div>
              </div>
            ) : (
              location.pathname === '/' && (
                <div className="flex items-center gap-8">
                  <button onClick={() => navigate('/login')} className="text-sm font-black text-gray-400 hover:text-[#FFF3E0] transition-colors tracking-widest uppercase">Login</button>
                  <button onClick={() => navigate('/signup')} className="px-8 py-3 saffron-gradient rounded-full font-black text-sm text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] uppercase tracking-widest">Join Us</button>
                </div>
              )
            )}
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
