FlavorShift: Cuisine Fusion
🔹 Phase 1: Project Initialization & Setup

Objective: Set up the project structure and development environment.

Key Tasks:

Created GitHub repository

Initialized Git locally

Defined folder structure

Added basic configuration files

Initial README documentation

Commit Examples:

Initial project setup

Added base folder structure

Configured repository
Phase 2: Core UI & Layout Development

Objective: Build the basic user interface and layout.

Key Tasks:

Designed homepage layout

Added navigation bar and footer

Implemented responsive styling

Created reusable UI components

Commit Examples:

Added homepage UI

Implemented navbar and footer

Improved responsive layout

Phase 3: Feature Development

Objective: Implement core features of the application.

Key Tasks:

Developed primary user features

Connected UI components with logic

Added form handling and validations

Improved user interaction flow

Commit Examples:

Implemented main feature logic

Added form validation

Connected frontend components

Phase 4: Integration & Enhancements

Objective: Improve functionality and integrate different modules.

Key Tasks:

Integrated frontend with backend (if applicable)

Enhanced performance and UI consistency

Fixed feature-level bugs

Refactored code for readability

Commit Examples:

Integrated modules

Refactored code structure

Improved performance and UX


Phase 5: Testing & Bug Fixes

Objective: Ensure application stability and correctness.

Key Tasks:

Manual testing of features

Bug identification and fixes

Edge case handling

Code cleanup

Commit Examples:

Fixed UI bugs

Resolved feature edge cases

Code cleanup and optimizations


## 🎯 *Project Overview*

*FlavorShift* is an innovative cuisine translator application that uses molecular/structural analysis to suggest dishes with similar characteristics across different culinary traditions. It bridges cultures through flavor science.

---

## 🏗️ *Architecture & Tech Stack*

*Frontend:*
- *React 19.2* with TypeScript
- *Vite* (build tool, dev server on port 3000)
- *Framer Motion* - smooth animations & transitions
- *Recharts* - data visualization (radar charts, bar charts)
- *Tailwind CSS* - utility-first styling with custom variables
- *React Router v7* - client-side navigation
- *react-globe.gl* & *Three.js* - 3D globe visualization

*Backend/APIs:*
- *Gemini AI* (Google) - narrative generation & quality validation
- *RecipeDB (Cosylab)* - 118K+ recipes database  
- *FlavourDB (Cosylab)* - molecular flavor compound analysis
- *Bearer token authentication* for API requests

---

## 📋 *Key Files & Their Purpose*

### *Services* (API Integration)
- *recipeAPIService.ts* (891 lines)
  - Main translation engine with 3-phase hybrid architecture
  - *Phase 1*: Hybrid Translation (RecipeDB + FlavourDB as primary)
  - *Phase 2*: Molecular Analysis (compound overlap, taste intensity)
  - *Phase 3*: Advanced Intelligence (dietary, nutrition, cooking methods, alternatives)
  - Falls back to Gemini AI if RecipeDB insufficient
  - Key functions:
    - translateCuisineHybrid() - main translation
    - getRecipesByRegion() - fetch regional recipes
    - getFlavorPropertiesByDescription() - flavor profile analysis
    - calculateCompoundOverlap() - molecular matching
    - buildMolecularAnalysis() - Phase 2 analysis
    - buildAdvancedIntelligence() - Phase 3 analysis

- *geminiService.ts* (104 lines)
  - Google Gemini API integration using @google/genai
  - Structured JSON output with response schema
  - Model: gemini-3-flash-preview (optimized for speed)
  - Uses function calling for ingredient role classification
  - Temperature: 0.6, thinking budget disabled for latency


## 🔄 *Data Flow & Algorithm*

### *Phase 1: Hybrid Translation*
1. Get flavor profile of input dish from FlavourDB
2. Search target cuisine recipes in RecipeDB (50 recipes)
3. Analyze each recipe's flavor profile
4. Calculate similarity score using 6 flavor dimensions
5. Select best match (highest similarity score)

### *Phase 2: Molecular Analysis*
1. Extract molecules/compounds for both original and target ingredients (via FlavourDB)
2. Calculate compound overlap percentage
3. Analyze taste intensity matching (sweet, salty, sour, bitter, umami, spicy)
4. Generate molecular match score

### *Phase 3: Advanced Intelligence*
1. Extract dietary info (vegetarian, vegan, pescetarian, gluten-free, keto)
2. Calculate nutritional balance (calories, protein, carbs, fat differences)
3. Map cooking processes (preserved, additional, substituted methods)
4. Find 2-3 alternative recipe suggestions with similarity scores
