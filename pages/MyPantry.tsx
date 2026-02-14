import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MyPantry: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<string[]>(
    JSON.parse(localStorage.getItem('pantryItems') || '[]')
  );
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      const items = [...pantryItems, newItem];
      setPantryItems(items);
      localStorage.setItem('pantryItems', JSON.stringify(items));
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    const items = pantryItems.filter((_, i) => i !== index);
    setPantryItems(items);
    localStorage.setItem('pantryItems', JSON.stringify(items));
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth bg-texture">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black tracking-tighter mb-2 font-serif text-white">🍶 My Pantry</h1>
          <p className="text-[#FFC857] font-accent text-2xl mb-12">Manage your culinary ingredients</p>

          <div className="recipe-card p-12 rounded-[40px] mb-8">
            <div className="flex gap-4 mb-8">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="Add ingredient..."
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF7A00]"
              />
              <button
                onClick={addItem}
                className="px-8 py-4 spice-gradient rounded-2xl font-black text-white hover:scale-105 transition-all"
              >
                + Add
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pantryItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-[#B22222]/10 border border-[#B22222]/30 rounded-2xl text-center group hover:bg-[#B22222]/20 transition-all cursor-pointer"
                  onClick={() => removeItem(idx)}
                >
                  <p className="text-sm font-bold text-[#FFF3E0] mb-2">{item}</p>
                  <p className="text-xs text-gray-400 group-hover:text-red-400">Click to remove</p>
                </motion.div>
              ))}
            </div>

            {pantryItems.length === 0 && (
              <p className="text-center text-gray-500 py-8">Your pantry is empty. Add ingredients to get started!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyPantry;
