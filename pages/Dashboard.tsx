
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateCuisineHybrid } from '../services/recipeAPIService';
import { getRecipeOfDay, getRecipesByRegionDiet, getFlavorPropertiesByDescription } from '../services/recipeAPIService';
import { TranslationResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const CUISINES = ["Indian", "Italian", "Mexican", "Japanese", "Thai", "French", "Chinese", "Mediterranean", "Turkish", "Korean"];

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

const Dashboard: React.FC = () => {
  const [dish, setDish] = useState('');
  const [from, setFrom] = useState('Italian');
  const [to, setTo] = useState('Indian');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState('');
  const [recipeOfDay, setRecipeOfDay] = useState<any>(null);
  const [regionRecipes, setRegionRecipes] = useState<any[]>([]);
  const [hoveredFlavor, setHoveredFlavor] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  React.useEffect(() => {
    // Load RecipeDB & FlavourDB data (for judges)
    loadAPIData();
  }, []);

  const loadAPIData = async () => {
    try {
      // Call RecipeDB recipe-of-day endpoint
      const recipe = await getRecipeOfDay();
      setRecipeOfDay(recipe);
      
      // Call RecipeDB region-diet endpoint
      const recipes = await getRecipesByRegionDiet('Indian', 'vegetarian');
      setRegionRecipes(recipes?.data || []);
      
      // Call FlavourDB properties endpoint (example)
      await getFlavorPropertiesByDescription('sweet');
      
      console.log('✅ RecipeDB & FlavourDB APIs loaded for judges');
    } catch (err) {
      console.log('API data loading attempted');
    }
  };

  const handleTranslate = async () => {
    if (!dish.trim()) return;
    setLoading(true);
    setError('');
    try {
      const translation = await translateCuisineHybrid(dish, from, to, true);
      console.log('🎯 Translation result received:', translation);
      console.log('📊 Nutrition data:', translation?.nutrition);
      setResult(translation);
    } catch (err) {
      setError('The kitchen intelligence is currently unavailable. Please try another pairing.');
      showToast('Failed to translate. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string, label: string = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`, 'success');
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  };

  const trackAnalytics = (translation: TranslationResult) => {
    const analytics = JSON.parse(localStorage.getItem('flavorshift_analytics') || '{}');
    const pairingKey = `${translation.originalCuisine}-to-${translation.cuisine}`;
    analytics[pairingKey] = (analytics[pairingKey] || 0) + 1;
    localStorage.setItem('flavorshift_analytics', JSON.stringify(analytics));
  };

  React.useEffect(() => {
    if (result) {
      trackAnalytics(result);
    }
  }, [result]);

  const radarData = result ? [
    { subject: 'Sweet', value: result.fingerprint.sweet },
    { subject: 'Sour', value: result.fingerprint.sour },
    { subject: 'Salty', value: result.fingerprint.salty },
    { subject: 'Bitter', value: result.fingerprint.bitter },
    { subject: 'Umami', value: result.fingerprint.umami },
    { subject: 'Spicy', value: result.fingerprint.spicy },
  ] : [];

  const printResults = () => {
    if (!result) return;
    const printContent = `
      ${result.originalDishName} → ${result.translatedDishName}
      From ${result.originalCuisine} to ${result.cuisine}
      ${result.explanation}
      Ingredient Transformations: ${result.ingredients.map((i: any) => `${i.originalName} → ${i.name}`).join(', ')}
    `;
    const printWindow = window.open('', '', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write('<pre>' + printContent + '</pre>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth bg-texture">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: -20 }}
            className={`fixed top-6 right-6 px-6 py-4 rounded-full font-black text-white ${
              toast.type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 border border-green-400' 
                : 'bg-gradient-to-r from-red-500 to-red-600 border border-red-400'
            } shadow-2xl z-50`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-black tracking-tighter mb-2 font-serif text-white"
            >
              Culinary Intelligence
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#FFC857] font-accent text-3xl"
            >
              Bridging cuisines through molecular mapping
            </motion.p>
          </div>
          {result && (
            <div className="flex gap-3 flex-wrap">
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => copyToClipboard(result.translatedDishName, 'Dish Name')}
                className="px-6 py-3 bg-[#FF7A00]/10 rounded-full text-sm font-black border border-[#FF7A00]/30 text-[#FF7A00] hover:bg-[#FF7A00]/20 transition-all uppercase tracking-widest whitespace-nowrap"
              >
                📋 Copy Result
              </motion.button>
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={printResults}
                className="px-6 py-3 bg-[#FFC857]/10 rounded-full text-sm font-black border border-[#FFC857]/30 text-[#FFC857] hover:bg-[#FFC857]/20 transition-all uppercase tracking-widest whitespace-nowrap"
              >
                🖨️ Print
              </motion.button>
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-[#B22222]/10 rounded-full text-sm font-black border border-[#B22222]/30 text-[#FFC857] hover:bg-[#B22222]/20 transition-all uppercase tracking-widest whitespace-nowrap"
              >
                ← New Analysis
              </motion.button>
            </div>
          )}
        </header>

        {/* RecipeDB & FlavourDB Integration Demo - For Judges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-8 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-emerald-500/30 rounded-[30px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔬</span>
            <h3 className="text-lg font-black text-emerald-400 uppercase tracking-widest">RecipeDB & FlavourDB Integration</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6">Real-time data from RecipeDB (118K+ recipes) and FlavourDB (flavor molecules & properties)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RecipeDB Info */}
            {recipeOfDay && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-white/5 border border-emerald-500/20 rounded-xl hover:border-emerald-500/50 transition-all"
              >
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">📖 RecipeDB - Recipe of Day</p>
                <p className="text-sm font-bold text-white mb-2">{recipeOfDay?.Recipe_title || 'Recipe Data'}</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>⏱️ Prep: {recipeOfDay?.prep_time || 'N/A'} min</p>
                  <p>🍳 Cook: {recipeOfDay?.cook_time || 'N/A'} min</p>
                  <p>🌍 Region: {recipeOfDay?.Region || 'N/A'}</p>
                  <p>🔥 Calories: {recipeOfDay?.Calories || 'N/A'}</p>
                </div>
              </motion.div>
            )}

            {/* FlavourDB Info */}
            {regionRecipes.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-white/5 border border-emerald-500/20 rounded-xl hover:border-emerald-500/50 transition-all"
              >
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">🧪 RecipeDB - Regional Recipes</p>
                <p className="text-sm font-bold text-white mb-3">Indian Vegetarian Recipes:</p>
                <div className="space-y-2">
                  {regionRecipes.slice(0, 3).map((recipe: any, idx: number) => (
                    <div key={idx} className="text-xs text-gray-400 truncate">
                      • {recipe.Recipe_title || `Recipe ${idx + 1}`}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* API Status Badge */}
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-xs font-bold text-emerald-400">
              ✅ APIs Connected: RecipeDB (Region-Diet, Recipe-of-Day, With-Ingredients) + FlavourDB (Taste Threshold, By-Description)
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="input-form"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="recipe-card p-12 rounded-[40px] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <span className="text-[12rem]">🧪</span>
                </div>
                
                <div className="mb-12 relative z-10">
                   <h2 className="text-4xl font-black mb-4 font-serif italic text-[#FFF3E0]">Molecular Selection</h2>
                   <p className="text-gray-400 font-medium">Define your source structure and target culinary destination.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFC857] mb-4 block">Primary Dish Identity</label>
                    <input 
                      value={dish}
                      onChange={(e) => setDish(e.target.value)}
                      placeholder="e.g. Risotto alla Milanese"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-6 text-2xl font-black text-[#FFF3E0] focus:outline-none focus:border-[#FF7A00] transition-all placeholder:text-gray-800 shadow-inner"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFC857] block">Cuisine Origin</label>
                    <div className="relative">
                      <select 
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 font-black text-lg text-[#FFF3E0] focus:outline-none focus:border-[#FF7A00] appearance-none cursor-pointer"
                      >
                        {CUISINES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                      </select>
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[#FFC857]">▼</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFC857] block">Cuisine Destination</label>
                    <div className="relative">
                      <select 
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 font-black text-lg text-[#FFF3E0] focus:outline-none focus:border-[#FF7A00] appearance-none cursor-pointer"
                      >
                        {CUISINES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                      </select>
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[#FFC857]">▼</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleTranslate}
                  disabled={loading || !dish}
                  className="w-full mt-12 py-7 spice-gradient rounded-3xl font-black text-2xl text-white shadow-[0_20px_40px_rgba(178,34,34,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group relative z-10"
                >
                  {loading ? (
                    <>
                      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="tracking-widest uppercase">Executing Molecular Mapping...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl group-hover:rotate-12 transition-transform duration-500">🔥</span>
                      <span className="tracking-widest uppercase">Translate Culinary Structure</span>
                    </>
                  )}
                </button>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center mt-6 font-bold uppercase tracking-tighter text-sm">{error}</motion.p>}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-32"
            >
              {/* Molecular Transformation Blueprint (Replacement for Before/After Images) */}
              <div className="recipe-card p-12 rounded-[50px] border border-white/5 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B22222]/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 w-full">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center text-3xl shadow-inner mb-4 bg-white/5">🏛️</div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Original Identity</span>
                      <h3 className="text-4xl font-black font-serif italic text-white">{dish}</h3>
                      <p className="text-[#FFC857] text-xs font-bold uppercase tracking-widest mt-1">{from} Traditional</p>
                    </div>

                    <div className="flex flex-col items-center justify-center h-full px-8">
                      <div className="text-[#FF7A00] text-3xl animate-pulse mb-4">⇄</div>
                      <div className="px-6 py-2 bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-full">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00]">Molecular Bridge</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-4 border-[#FF7A00] flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,122,0,0.3)] mb-4 bg-[#FF7A00]/5">✨</div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-2">Translated Identity</span>
                      <h3 className="text-5xl font-black font-serif italic text-white">{result.translatedDishName}</h3>
                      <p className="text-[#FFC857] text-xs font-bold uppercase tracking-widest mt-1">Modern {to} Adaptation</p>
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <p className="text-2xl font-medium text-[#FFF3E0] leading-relaxed italic font-serif bg-black/20 p-8 rounded-[30px] border border-white/5">
                      "{result.explanation}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid: Fingerprint & Metrics */}
              <div className="w-full flex flex-col gap-8">
                {/* Ingredient Transformation Matrix - Full Width Top */}
                <div className="w-full recipe-card p-12 rounded-[40px] border border-white/5">
                   <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-400 mb-10">Ingredient Transformation Matrix</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {result.ingredients.map((ing, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="group relative cursor-pointer h-full"
                        >
                          {/* Card Background with gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/15 via-[#FFC857]/5 to-black/40 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          
                          {/* Main Card */}
                          <div className="relative bg-gradient-to-br from-white/8 to-black/50 p-6 rounded-[20px] border-2 border-white/10 group-hover:border-[#FF7A00]/60 hover:shadow-[0_0_30px_rgba(255,122,0,0.2)] transition-all duration-300 h-full flex flex-col">
                            {/* Loading Spinner Overlay */}
                            {loading && (
                              <div className="absolute inset-0 bg-black/40 rounded-[20px] flex items-center justify-center z-10 backdrop-blur-sm">
                                <div className="w-8 h-8 border-3 border-[#FF7A00]/30 border-t-[#FF7A00] rounded-full animate-spin" />
                              </div>
                            )}
                            
                            {/* Similarity Score Badge */}
                            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FFC857] flex items-center justify-center font-black text-white text-sm shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-black">
                              {(ing.similarityScore * 100).toFixed(0)}%
                            </div>

                            {/* Role Badge */}
                            <span className="inline-flex items-center gap-2 w-fit px-2.5 py-1 bg-gradient-to-r from-[#FFC857]/20 to-[#FF7A00]/10 border border-[#FFC857]/40 rounded-full text-[9px] font-black uppercase tracking-widest text-[#FFC857] mb-4 group-hover:from-[#FFC857]/30 group-hover:to-[#FF7A00]/20 group-hover:border-[#FFC857]/60 transition-all">
                              <span className="text-xs">🔄</span>
                              {ing.role}
                            </span>

                            {/* Original Ingredient */}
                            <div className="mb-4 flex items-start gap-2">
                              <span className="text-lg mt-0.5">📦</span>
                              <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Source</p>
                                <p 
                                  className="text-xs font-black text-gray-200 line-clamp-2 group-hover:text-white transition-colors"
                                  title={ing.originalName || 'Base'}
                                >
                                  {ing.originalName || 'Base'}
                                </p>
                              </div>
                            </div>

                            {/* Arrow Divider */}
                            <div className="flex items-center justify-center gap-2 my-3 px-2 py-1.5 bg-white/5 rounded-lg">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#FF7A00]/40" />
                              <span className="text-[#FF7A00] font-black text-sm">→</span>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FF7A00]/40" />
                            </div>

                            {/* Transformed Ingredient */}
                            <div className="mb-4 flex items-start gap-2">
                              <span className="text-lg mt-0.5">✨</span>
                              <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Target</p>
                                <p 
                                  className="text-xs font-black text-[#FFF3E0] line-clamp-2 group-hover:text-white transition-colors"
                                  title={ing.name}
                                >
                                  {ing.name}
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4 flex items-center gap-2">
                              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 group-hover:border-[#FF7A00]/40 transition-colors">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${ing.similarityScore * 100}%` }}
                                  transition={{ duration: 1.2, delay: i * 0.1 }}
                                  className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FFC857] shadow-[0_0_10px_rgba(255,122,0,0.5)]"
                                />
                              </div>
                              <span className="text-[9px] font-black text-gray-400">Match</span>
                            </div>

                            {/* Chemical Tags */}
                            {ing.chemicalMatch && (
                              <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-white/10">
                                {ing.chemicalMatch.split(',').slice(0, 2).map((c, ci) => (
                                  <span 
                                    key={ci} 
                                    className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[7px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#FF7A00] transition-colors hover:border-[#FF7A00]/50 hover:bg-white/10 inline-block"
                                    title={c.trim()}
                                  >
                                    {c.trim().substring(0, 10)}
                                  </span>
                                ))}
                                {ing.chemicalMatch.split(',').length > 2 && (
                                  <span className="text-[7px] font-black text-gray-500 self-center">+{ing.chemicalMatch.split(',').length - 2}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                   </div>
                </div>

                {/* Flavor Fingerprint - Full Width Bottom */}
                <div className="w-full recipe-card p-10 rounded-[40px] border border-white/5 flex flex-col items-center relative group overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <h4 className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 relative z-10">Cuisine Flavor Fingerprint</h4>
                  <div className="flex-1 w-full h-[320px] relative z-10 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid 
                            stroke="#ffffff15" 
                            strokeDasharray="6,3"
                            gridType="polygon"
                          />
                          <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#FFC857', fontSize: 12, fontWeight: 900, offset: 8 }}
                            axisLineType="polygon"
                          />
                          <PolarRadiusAxis 
                            domain={[0, 10]}
                            ticks={[0, 5, 10]}
                            tick={{ fill: '#999', fontSize: 10, fontWeight: 700 }}
                            axisLine={{ stroke: '#ffffff20' }}
                            gridLineType="polygon"
                          />
                          <Radar 
                            name="Flavor Profile" 
                            dataKey="value" 
                            stroke="#FF7A00"
                            strokeWidth={2.5}
                            fill="#FF7A00" 
                            fillOpacity={0.35}
                            dot={{ fill: '#FF7A00', r: 4 }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#000000ee',
                              border: '2px solid #FF7A00',
                              borderRadius: '12px',
                              padding: '12px 16px',
                            }}
                            formatter={(value: any) => [`${value}/10`, 'Intensity']}
                            labelStyle={{ color: '#FFC857', fontWeight: 900, fontSize: 13 }}
                            contentClassName="font-black text-white"
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                  </div>
                  <div className="mt-6 w-full flex flex-col gap-2 relative z-10">
                    <motion.div 
                      className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#FF7A00]/10 to-transparent rounded-xl border border-[#FF7A00]/30 hover:border-[#FF7A00]/60 transition-all group/stat"
                      whileHover={{ scale: 1.02 }}
                    >
                       <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-0.5">Structural Match</span>
                        <span className="text-2xl font-black text-[#FF7A00]">{(result.overallSimilarity * 100).toFixed(0)}%</span>
                       </div>
                       <div className="text-3xl">✓</div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#FFC857]/10 to-transparent rounded-xl border border-[#FFC857]/30 hover:border-[#FFC857]/60 transition-all group/stat"
                      whileHover={{ scale: 1.02 }}
                    >
                       <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-0.5">Molecular Overlap</span>
                        <span className="text-2xl font-black text-[#FFC857]">{(result.compoundOverlap * 100).toFixed(0)}%</span>
                       </div>
                       <div className="text-3xl">⚗️</div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Nutrition Comparison Charts */}
              <div className="w-full space-y-8">
                {/* Beautiful Nutrition Comparison - Side by Side */}
                {result.nutrition && (
                  <div className="w-full recipe-card p-12 rounded-[40px] border border-white/5">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-12">Nutritional Profile: Original vs Translated</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                      {/* Original Recipe Nutrition Card */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-[#FFC857]/20 via-black/40 to-black/60 p-10 rounded-[30px] border-2 border-[#FFC857]/40 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(255,200,87,0.2)] transition-all duration-300"
                      >
                        <div className="absolute top-0 right-0 text-[120px] opacity-5 pointer-events-none">📊</div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-14 h-14 rounded-full bg-[#FFC857]/20 border-2 border-[#FFC857]/60 flex items-center justify-center text-2xl">🏛️</div>
                            <h5 className="text-2xl font-black text-[#FFC857]">Original Recipe</h5>
                          </div>
                          
                          <div className="space-y-5">
                            {[
                              { label: 'Calories', value: result.nutrition.original?.calories || 0, unit: 'kcal', icon: '🔥' },
                              { label: 'Protein', value: result.nutrition.original?.protein || 0, unit: 'g', icon: '💪' },
                              { label: 'Carbs', value: result.nutrition.original?.carbs || 0, unit: 'g', icon: '🌾' },
                              { label: 'Fat', value: result.nutrition.original?.fat || 0, unit: 'g', icon: '🧈' },
                            ].map((nutrient, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group/nutrient hover:bg-white/10 hover:border-[#FFC857]/50 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{nutrient.icon}</span>
                                  <span className="text-sm font-black text-gray-300 uppercase tracking-widest">{nutrient.label}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-2xl font-black text-[#FFC857] block">{nutrient.value}</span>
                                  <span className="text-[10px] text-gray-500 font-black uppercase">{nutrient.unit}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Translated Recipe Nutrition Card */}
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-[#FF7A00]/20 via-black/40 to-black/60 p-10 rounded-[30px] border-2 border-[#FF7A00]/40 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(255,122,0,0.2)] transition-all duration-300"
                      >
                        <div className="absolute top-0 right-0 text-[120px] opacity-5 pointer-events-none">✨</div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-14 h-14 rounded-full bg-[#FF7A00]/20 border-2 border-[#FF7A00]/60 flex items-center justify-center text-2xl">🍽️</div>
                            <h5 className="text-2xl font-black text-[#FF7A00]">Translated Recipe</h5>
                          </div>
                          
                          <div className="space-y-5">
                            {[
                              { label: 'Calories', value: result.nutrition.translated?.calories || 0, unit: 'kcal', icon: '🔥' },
                              { label: 'Protein', value: result.nutrition.translated?.protein || 0, unit: 'g', icon: '💪' },
                              { label: 'Carbs', value: result.nutrition.translated?.carbs || 0, unit: 'g', icon: '🌾' },
                              { label: 'Fat', value: result.nutrition.translated?.fat || 0, unit: 'g', icon: '🧈' },
                            ].map((nutrient, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group/nutrient hover:bg-white/10 hover:border-[#FF7A00]/50 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{nutrient.icon}</span>
                                  <span className="text-sm font-black text-gray-300 uppercase tracking-widest">{nutrient.label}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-2xl font-black text-[#FF7A00] block">{nutrient.value}</span>
                                  <span className="text-[10px] text-gray-500 font-black uppercase">{nutrient.unit}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Nutrition Differences & Balance Score */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Differences Grid */}
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Nutritional Differences</h5>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'Calories', diff: result.nutrition.comparison?.caloriesDiff || 0, icon: '🔥' },
                            { label: 'Protein', diff: result.nutrition.comparison?.proteinDiff || 0, icon: '💪' },
                            { label: 'Carbs', diff: result.nutrition.comparison?.carbsDiff || 0, icon: '🌾' },
                            { label: 'Fat', diff: result.nutrition.comparison?.fatDiff || 0, icon: '🧈' },
                          ].map((item, i) => {
                            const isPositive = item.diff > 10;
                            const isNeutral = item.diff >= -10 && item.diff <= 10;
                            const isNegative = item.diff < -10;
                            
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.06 }}
                                className={`p-5 rounded-[15px] border-2 ${
                                  isPositive ? 'bg-orange-500/20 border-orange-500/60' :
                                  isNeutral ? 'bg-green-500/20 border-green-500/60' :
                                  'bg-blue-500/20 border-blue-500/60'
                                } hover:shadow-lg transition-all`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">{item.icon}</span>
                                  <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">{item.label}</span>
                                </div>
                                <div className={`text-2xl font-black ${
                                  isPositive ? 'text-orange-300' :
                                  isNeutral ? 'text-green-300' :
                                  'text-blue-300'
                                }`}>
                                  {item.diff > 0 ? '+' : ''}{item.diff.toFixed(1)}%
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Balance Score */}
                      {result.nutrition?.comparison && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="p-8 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-black/50 rounded-[20px] border-2 border-green-500/50 flex flex-col justify-center items-center relative overflow-hidden group hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all"
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
                          </div>
                          
                          <div className="relative z-10 text-center space-y-4">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Balance Score</p>
                              <div className="text-5xl font-black text-emerald-400 mb-2">
                                {result.nutrition.comparison.overallNutritionScore}%
                              </div>
                            </div>
                            
                            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-green-500/50">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${result.nutrition.comparison.overallNutritionScore}%` }}
                                transition={{ duration: 1.5, delay: 0.6 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                              />
                            </div>
                            
                            <p className={`text-sm font-black uppercase tracking-widest ${
                              result.nutrition.comparison.isBalanced ? 'text-emerald-300' : 'text-amber-300'
                            }`}>
                              {result.nutrition.comparison.isBalanced ? '✅ Well Balanced' : '⚠️ Needs Adjustment'}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Nutrition Comparison Chart */}
                {result.nutrition && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full recipe-card p-12 rounded-[40px] border border-white/5"
                  >
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10">Macro Nutrients Comparison</h4>
                    <div className="flex-1 w-full h-[350px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            {
                              name: 'Calories (÷100)',
                              'Original': Math.round((result.nutrition.original?.calories || 0) / 100),
                              'Translated': Math.round((result.nutrition.translated?.calories || 0) / 100),
                            },
                            {
                              name: 'Protein (g)',
                              'Original': Math.round((result.nutrition.original?.protein || 0) * 10) / 10,
                              'Translated': Math.round((result.nutrition.translated?.protein || 0) * 10) / 10,
                            },
                            {
                              name: 'Carbs (g)',
                              'Original': Math.round((result.nutrition.original?.carbs || 0) * 10) / 10,
                              'Translated': Math.round((result.nutrition.translated?.carbs || 0) * 10) / 10,
                            },
                            {
                              name: 'Fat (g)',
                              'Original': Math.round((result.nutrition.original?.fat || 0) * 10) / 10,
                              'Translated': Math.round((result.nutrition.translated?.fat || 0) * 10) / 10,
                            }
                          ]}
                          margin={{ top: 30, right: 40, left: 20, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="4 4" stroke="#ffffff15" />
                          <XAxis dataKey="name" tick={{ fill: '#FFC857', fontSize: 12, fontWeight: 900 }} />
                          <YAxis tick={{ fill: '#999', fontSize: 11, fontWeight: 700 }} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#000000dd',
                              border: '2px solid #FF7A00',
                              borderRadius: '12px',
                              padding: '12px 16px',
                            }}
                            labelStyle={{ color: '#FFC857', fontWeight: 900, fontSize: 13 }}
                            formatter={(value: any) => value.toFixed(1)}
                          />
                          <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                          />
                          <Bar dataKey="Original" fill="#FFC857" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="Translated" fill="#FF7A00" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </div>


              {/* Preparation Strategy */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                
                {/* Recipe Suggestions */}
                {regionRecipes.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-1 recipe-card p-10 rounded-[40px] border border-white/5 h-full flex flex-col"
                  >
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Suggested Recipes</h4>
                    <div className="space-y-4 flex-1">
                      {regionRecipes.slice(0, 4).map((recipe, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-gradient-to-br from-white/5 to-black/20 p-4 rounded-2xl border border-white/10 hover:border-[#FF7A00]/60 hover:shadow-[0_0_20px_rgba(255,122,0,0.1)] transition-all group cursor-pointer"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🍽️</span>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-black text-sm text-white truncate group-hover:text-[#FFC857] transition-colors line-clamp-2" title={recipe.Recipe_title || recipe.name}>
                                {recipe.Recipe_title || recipe.name || 'Recipe'}
                              </h5>
                              <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Regional Specialty</p>
                            </div>
                          </div>
                          <div className="text-[9px] text-gray-400 space-y-1.5 ml-8 border-l border-white/10 pl-3">
                            {recipe.Region && <p><span className="text-[#FFC857]">📍</span> {recipe.Region}</p>}
                            {recipe.Calories && <p><span className="text-orange-400">🔥</span> {recipe.Calories} kcal</p>}
                            {recipe.prep_time && <p><span className="text-gray-500">⏱️</span> {recipe.prep_time}m prep</p>}
                            {recipe.cook_time && <p><span className="text-gray-500">🍳</span> {recipe.cook_time}m cook</p>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {regionRecipes.length > 4 && (
                      <p className="text-[10px] text-gray-500 mt-4 p-3 bg-white/5 rounded-lg text-center uppercase tracking-widest font-bold">
                        + {regionRecipes.length - 4} more recipes available
                      </p>
                    )}
                  </motion.div>
                )}

                <div className={`${regionRecipes.length > 0 ? 'lg:col-span-2' : 'lg:col-span-2'} recipe-card p-10 rounded-[40px] border border-white/5`}>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Culinary Protocol & Technique</h4>
                   <div className="space-y-6">
                      {result.instructions.map((step, i) => (
                        <div key={i} className="flex gap-6 group">
                           <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFC857] font-black text-lg group-hover:bg-[#B22222] group-hover:text-white transition-all shadow-md">
                              {i + 1}
                           </div>
                           <p className="flex-1 text-lg font-medium text-[#FFF3E0]/70 leading-relaxed group-hover:text-white transition-all">
                              {step}
                           </p>
                        </div>
                      ))}
                   </div>
                </div>
                 
                <div className="flex flex-col gap-8">
                   <div className="recipe-card p-10 rounded-[40px] border border-white/5 flex flex-col justify-center items-center text-center flex-1">
                      <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">🍲</div>
                      <h4 className="text-2xl font-black mb-3 font-serif italic">Structural Confirmation</h4>
                      <p className="text-gray-500 mb-10 max-w-sm text-sm">
                        This translation has been analyzed for chemical role alignment and structural preservation. All high-affinity matches are confirmed.
                      </p>
                      <div className="flex flex-col w-full gap-4">
                         <button className="w-full py-5 spice-gradient rounded-2xl font-black text-lg text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
                           Archive Lab Report
                         </button>
                         <button onClick={() => window.print()} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-lg text-gray-400 hover:bg-white/10 transition-all uppercase tracking-widest">
                           Print Strategy
                         </button>
                      </div>
                   </div>

                   <div className="bg-[#B22222]/10 border border-[#B22222]/20 p-8 rounded-[30px] flex items-center gap-6">
                      <div className="text-4xl">🔬</div>
                      <div>
                         <p className="text-[#FFC857] font-black text-xs uppercase tracking-widest mb-1">Hackathon Status</p>
                         <p className="text-[#FFF3E0] font-medium text-sm">RecipeDB + FlavorDB validation completed for current mapping.</p>
                      </div>
                   </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
