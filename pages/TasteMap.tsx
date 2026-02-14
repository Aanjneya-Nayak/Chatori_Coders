import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlobeTComponent from 'react-globe.gl';
import * as THREE from 'three';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CuisineData {
  name: string;
  region: string;
  lat: number;
  lon: number;
  flavorProfile: {
    sweet: number;
    spicy: number;
    salty: number;
    umami: number;
    sour: number;
    bitter: number;
  };
  description: string;
  signature_dishes: string[];
  color: string;
}

const cuisines: CuisineData[] = [
  {
    name: 'Indian Cuisine',
    region: 'India',
    lat: 20.5937,
    lon: 78.9629,
    flavorProfile: { sweet: 6, spicy: 9, salty: 7, umami: 8, sour: 6, bitter: 4 },
    description: 'Bold, aromatic spices with layered flavors. Emphasis on curries, tamarind, and turmeric.',
    signature_dishes: ['Butter Chicken', 'Biryani', 'Dal Makhani', 'Masala Dosa', 'Paneer Tikka'],
    color: '#FF7A00'
  },
  {
    name: 'Italian Cuisine',
    region: 'Italy',
    lat: 41.8719,
    lon: 12.5674,
    flavorProfile: { sweet: 4, spicy: 2, salty: 7, umami: 9, sour: 7, bitter: 3 },
    description: 'Fresh ingredients, olive oil, herbs. Emphasizes pasta, tomato, and cheese.',
    signature_dishes: ['Pasta Carbonara', 'Risotto', 'Pesto', 'Osso Buco', 'Tiramisu'],
    color: '#2ECC71'
  },
  {
    name: 'Chinese Cuisine',
    region: 'China',
    lat: 35.8617,
    lon: 104.1954,
    flavorProfile: { sweet: 6, spicy: 7, salty: 8, umami: 8, sour: 7, bitter: 3 },
    description: 'Balance of sweet, sour, salty, bitter. Emphasis on wok cooking and soy sauce.',
    signature_dishes: ['Kung Pao Chicken', 'Mapo Tofu', 'Peking Duck', 'Fried Rice', 'Hot Pot'],
    color: '#E74C3C'
  },
  {
    name: 'Mexican Cuisine',
    region: 'Mexico',
    lat: 23.6345,
    lon: -102.5528,
    flavorProfile: { sweet: 4, spicy: 8, salty: 7, umami: 6, sour: 8, bitter: 3 },
    description: 'Fresh chilies, lime, cilantro, corn. Roasting and charring techniques.',
    signature_dishes: ['Tacos al Pastor', 'Mole', 'Ceviche', 'Enchiladas', 'Quesadillas'],
    color: '#F39C12'
  },
  {
    name: 'Thai Cuisine',
    region: 'Thailand',
    lat: 15.8700,
    lon: 100.9925,
    flavorProfile: { sweet: 7, spicy: 9, salty: 8, umami: 7, sour: 8, bitter: 4 },
    description: 'Balance of sweet, sour, salty, spicy. Coconut milk, fish sauce, lime juice.',
    signature_dishes: ['Pad Thai', 'Green Curry', 'Tom Yum', 'Som Tam', 'Satay'],
    color: '#9B59B6'
  },
  {
    name: 'French Cuisine',
    region: 'France',
    lat: 46.2276,
    lon: 2.2137,
    flavorProfile: { sweet: 3, spicy: 1, salty: 6, umami: 8, sour: 5, bitter: 4 },
    description: 'Refined technique, subtle flavors. Emphasis on sauces, wine, and butter.',
    signature_dishes: ['Coq au Vin', 'Ratatouille', 'Beef Bourguignon', 'Crème Brûlée', 'Escargot'],
    color: '#3498DB'
  },
  {
    name: 'Japanese Cuisine',
    region: 'Japan',
    lat: 36.2048,
    lon: 138.2529,
    flavorProfile: { sweet: 5, spicy: 3, salty: 7, umami: 9, sour: 6, bitter: 2 },
    description: 'Simplicity, seasonality, umami. Emphasis on fresh fish, rice, and dashi.',
    signature_dishes: ['Sushi', 'Ramen', 'Tempura', 'Miso Soup', 'Tonkatsu'],
    color: '#1ABC9C'
  },
  {
    name: 'Lebanese Cuisine',
    region: 'Lebanon',
    lat: 33.8547,
    lon: 35.8623,
    flavorProfile: { sweet: 5, spicy: 6, salty: 7, umami: 6, sour: 7, bitter: 3 },
    description: 'Fresh herbs, olive oil, grains. Mediterranean influences with bold spices.',
    signature_dishes: ['Hummus', 'Fattoush', 'Shawarma', 'Tabbouleh', 'Kibbeh'],
    color: '#E67E22'
  }
];

export default function TasteMap() {
  const navigate = useNavigate();
  const globeEl = useRef<any>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineData | null>(null);
  const [hoveredCuisine, setHoveredCuisine] = useState<string | null>(null);
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate the globe
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1;
      
      // Enable mouse controls
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().enablePan = true;
    }

    // Handle window resize
    const handleResize = () => {
      setGlobeSize({
        width: window.innerWidth < 1024 ? window.innerWidth - 80 : 800,
        height: 600
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update globe points when selection changes
  useEffect(() => {
    if (globeEl.current && selectedCuisine) {
      // Animate to cuisine location
      globeEl.current.pointOfView(
        {
          lat: selectedCuisine.lat,
          lon: selectedCuisine.lon,
          altitude: 2.2
        },
        1200
      );
    }
  }, [selectedCuisine]);

  const points = cuisines.map(cuisine => ({
    lat: cuisine.lat,
    lon: cuisine.lon,
    size: selectedCuisine?.name === cuisine.name ? 25 : 18,
    color: selectedCuisine?.name === cuisine.name ? '#FFFFFF' : cuisine.color,
    name: cuisine.name
  }));

  const radarChartData = selectedCuisine 
    ? Object.entries(selectedCuisine.flavorProfile).map(([key, value]) => ({
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        value: value
      }))
    : [];

  const handlePointClick = (point: any) => {
    const cuisine = cuisines.find(c => c.name === point.name);
    if (cuisine) {
      setSelectedCuisine(cuisine);
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: cuisine.lat, lon: cuisine.lon, altitude: 2.5 }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-3 text-white"
          >
            🌍 Global Taste Map
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400"
          >
            Rotate the globe and click on a region to explore its unique flavor profile
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Globe */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="recipe-card p-0 rounded-[40px] border-2 border-white/10 overflow-hidden h-[500px] flex items-center justify-center relative group"
            >
              {/* Globe glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 via-transparent to-[#FFC857]/5 pointer-events-none" />
              <GlobeTComponent
                ref={globeEl}
                globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg"
                bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
                pointsData={points}
                pointColor={(d: any) => d.color}
                pointSize={(d: any) => d.size}
                pointLabel={(d: any) => d.name}
                onPointClick={handlePointClick}
                pointAltitude={0.1}
                pointsMerge={true}
                hexBinPointWeight="val"
                atmosphereColor="#FF7A00"
                atmosphereAltitude={0.35}
                width={400}
                height={500}
                backgroundColor="#0a0a0a"
                onGlobeReady={(globe: any) => {
                  globe.controls().autoRotate = true;
                  globe.controls().autoRotateSpeed = 1;
                }}
              />
            </motion.div>
          </div>

          {/* Cuisine Details Panel */}
          <AnimatePresence mode="wait">
            {selectedCuisine ? (
              <motion.div
                key={selectedCuisine.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="recipe-card p-10 rounded-[40px] border-2 border-white/10 h-[500px] overflow-y-auto flex flex-col"
              >
                <h2 className="text-3xl font-black text-[#FFC857] mb-1 font-serif">{selectedCuisine.region}</h2>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Flavor Profile</p>
                
                {/* Radar Chart */}
                <div className="flex-1 flex items-center justify-center mb-6">
                  <div style={{ width: '100%', height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarChartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                        <PolarGrid stroke="#ffffff15" strokeDasharray="4,4" gridType="polygon" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#FFC857', fontSize: 10, fontWeight: 800 }}
                        />
                        <PolarRadiusAxis 
                          domain={[0, 10]} 
                          tick={{ fill: '#666', fontSize: 9 }}
                          axisLine={false}
                        />
                        <Radar 
                          name="Flavor" 
                          dataKey="value" 
                          stroke="#FF7A00"
                          strokeWidth={2}
                          fill="#FF7A00" 
                          fillOpacity={0.35}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Signature Dishes */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                    Signature Dishes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCuisine.signature_dishes.map((dish, i) => (
                      <motion.span
                        key={dish}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-full text-xs font-black text-white hover:border-[#FF7A00]/50 hover:from-white/15 hover:to-white/10 transition-all"
                      >
                        {dish}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCuisine(null)}
                  className="mt-6 pt-4 border-t border-white/10 text-gray-400 hover:text-white transition-colors font-black uppercase text-xs tracking-widest w-full text-left"
                >
                  ← Back
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="recipe-card p-10 rounded-[40px] border-2 border-white/10 h-[500px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-white/5 to-black/30"
              >
                <div className="text-6xl mb-6">🌏</div>
                <h3 className="text-2xl font-black text-white mb-3">Explore Global Cuisines</h3>
                <p className="text-gray-400 max-w-xs mb-8">
                  Click on any marked region on the globe to discover its unique flavor profile and signature dishes.
                </p>
                <div className="space-y-2 w-full">
                  {cuisines.slice(0, 4).map(cuisine => (
                    <button
                      key={cuisine.name}
                      onClick={() => setSelectedCuisine(cuisine)}
                      className="block w-full px-4 py-2 text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#FF7A00]/50 rounded-lg transition-all text-left"
                    >
                      {cuisine.name}
                    </button>
                  ))}
                  <p className="text-[10px] text-gray-500 pt-2">+ {cuisines.length - 4} more...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cuisine Grid as Fallback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">
            Quick Cuisine Selection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine.name}
                onClick={() => setSelectedCuisine(cuisine)}
                onMouseEnter={() => setHoveredCuisine(cuisine.name)}
                onMouseLeave={() => setHoveredCuisine(null)}
                className="p-5 rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/5 to-black/40 hover:border-[#FF7A00]/60 hover:from-white/10 hover:to-black/30 hover:shadow-[0_0_20px_rgba(255,122,0,0.15)] transition-all group text-left"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">🍲</div>
                <h4 className="font-black text-base text-white mb-2 group-hover:text-[#FF7A00] transition-colors line-clamp-2">
                  {cuisine.name}
                </h4>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">{cuisine.region}</p>
                <div className="mt-2 flex gap-1">
                  {cuisines.find(c => c.name === hoveredCuisine) === cuisine && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-[#FF7A00] font-bold"
                    >
                      ← Click
                    </motion.div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
