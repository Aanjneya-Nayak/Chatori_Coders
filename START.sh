#!/bin/bash

# 🚀 FlavorShift - Complete Setup & Run

echo "=========================================="
echo "   🍳 FlavorShift - API Integration Ready"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "📝 The app will be available at:"
echo "   → http://localhost:3000/"
echo ""
echo "📖 Documentation files:"
echo "   → API_INTEGRATION_GUIDE.md - Technical reference"
echo "   → QUICK_START_GUIDE.md - Testing instructions"
echo "   → IMPLEMENTATION_SUMMARY.md - What's new"
echo "   → HACKATHON_CHECKLIST.md - Submission checklist"
echo ""
echo "🎯 Quick test:"
echo "   1. Click 'Try Translator' button"
echo "   2. Enter 'Butter Chicken'"
echo "   3. Translate from Indian to Italian"
echo "   4. See flavor-matched recipes!"
echo ""
echo "=========================================="
echo ""

npm run dev
