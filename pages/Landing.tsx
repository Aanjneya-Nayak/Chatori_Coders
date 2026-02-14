
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Steam = () => (
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 overflow-hidden pointer-events-none opacity-40">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="steam-particle"
        style={{
          left: `${10 + i * 20}%`,
          animationDelay: `${i * 0.8}s`,
          backgroundColor: '#FFF'
        }}
      />
    ))}
  </div>
);

const SpiceParticle = ({ i }: { i: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.4, 0], 
      scale: [0.5, 1, 0.5],
      x: [0, Math.random() * 200 - 100],
      y: [0, Math.random() * -300],
      rotate: [0, 360]
    }}
    transition={{ 
      duration: 5 + Math.random() * 5, 
      repeat: Infinity,
      delay: i * 0.1 
    }}
    className="absolute w-1 h-1 rounded-full"
    style={{
      backgroundColor: i % 2 === 0 ? '#B22222' : '#FFC857',
      left: `${Math.random() * 100}%`,
      bottom: '0%'
    }}
  />
);

const Landing = () => {
  const navigate = useNavigate();

  const cuisines = [
    { name: 'Italian', img: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&q=80&w=400', color: 'bg-green-600' },
    { name: 'Indian', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=400', color: 'bg-orange-600' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400', color: 'bg-red-700' },
    { name: 'French', img: 'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?auto=format&fit=crop&q=80&w=400', color: 'bg-blue-600' },
    { name: 'Japanese', img: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&q=80&w=400', color: 'bg-red-500' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-96px)] flex flex-col items-center">
      {/* Hero Section with Zooming Food Image */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Food" 
            className="w-full h-full object-cover opacity-40 grayscale-[0.2] sepia-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#1A1A1A]/50"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <Steam />
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.8] font-serif">
            Where Cultures <br />
            <span className="text-transparent bg-clip-text spice-gradient italic">Meet on a Plate</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#FFF3E0]/80 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            FlavorShift re-imagines culinary architecture. 
            Translate any dish across borders using 
            <span className="text-[#FFC857] font-bold"> molecular intelligence</span>.
          </p>

          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative px-14 py-6 spice-gradient rounded-3xl font-black text-2xl text-white shadow-[0_0_40px_rgba(178,34,34,0.4)] hover:scale-105 transition-all overflow-hidden"
          >
            <span className="relative z-10 uppercase tracking-widest">Start Your Journey</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            {[...Array(15)].map((_, i) => <SpiceParticle key={i} i={i} />)}
          </button>
        </motion.div>
      </section>

      {/* Cuisine Cards Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-32">
        <h2 className="text-center font-accent text-[#FFC857] text-4xl mb-4">Choose Your Destination</h2>
        <h3 className="text-center text-4xl font-black text-[#FFF3E0] mb-20 tracking-tighter">Explore the Taste Map</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {cuisines.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="relative aspect-[3/4] group cursor-pointer rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src={c.img} 
                alt={c.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-75 group-hover:brightness-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="w-full">
                   <div className={`w-8 h-1 ${c.color} mb-3 transition-all group-hover:w-full`}></div>
                   <p className="text-2xl font-black text-white italic font-serif">{c.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Powered by Section */}
      <section className="w-full bg-[#141414] py-24 flex flex-col items-center border-y border-white/5">
         <p className="font-accent text-[#FFC857] text-3xl mb-8">Powered by Culinary Science</p>
         <div className="flex gap-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
            <span className="text-2xl font-black tracking-widest">FOODOSCOPE RECIPEDB</span>
            <span className="text-2xl font-black tracking-widest">FLAVORDB INTELLIGENCE</span>
         </div>
      </section>
    </div>
  );
};

export default Landing;
