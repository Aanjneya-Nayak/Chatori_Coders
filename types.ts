
export interface Ingredient {
  name: string;
  role: 'Aromatic Base' | 'Fat Medium' | 'Umami Source' | 'Acid Component' | 'Texture Element' | 'Garnish' | 'Main' | 'Spice/Flavoring';
  originalName?: string;
  chemicalMatch?: string;
  similarityScore: number;
}

export interface CuisineFingerprint {
  name: string;
  sweet: number;
  sour: number;
  salty: number;
  bitter: number;
  umami: number;
  spicy: number;
}

export interface TranslationResult {
  originalDishName: string;
  translatedDishName: string;
  originalCuisine: string;
  cuisine?: string; // New field for target cuisine name
  targetCuisine?: string; // Legacy field for compatibility
  ingredients: Ingredient[];
  instructions: string[];
  explanation: string;
  compoundOverlap: number;
  overallSimilarity: number;
  fingerprint: CuisineFingerprint;
  structuralMapping: {
    original: string;
    translated: string;
    role: string;
  }[];
  nutrition?: {
    translated?: {
      calories?: string | number;
      protein?: string | number;
      carbs?: string | number;
      fat?: string | number;
    };
    original?: {
      calories?: string | number;
      protein?: string | number;
      carbs?: string | number;
      fat?: string | number;
    };
    comparison?: {
      caloriesDiff: number;
      proteinDiff: number;
      carbsDiff: number;
      fatDiff: number;
      overallNutritionScore?: number;
      isBalanced?: boolean;
    };
  };
  algorithmMetadata?: {
    method?: string;
    similarityScore?: number;
    recipesAnalyzed?: number;
    matchesEvaluated?: number;
    fallbackUsed?: boolean;
    reason?: string;
    error?: string;
    phasesCompleted?: string[];
  };
  molecularAnalysis?: {
    compounds?: {
      overlapPercentage: number;
      sharedCompounds: any[];
      description: string;
    };
    tasteIntensity?: Array<{
      dimension: string;
      originalIntensity: number;
      targetIntensity: number;
      match: number;
      status: 'perfect' | 'good' | 'moderate' | 'low';
    }>;
    molecularMatch?: {
      score: number;
      methodology: string;
    };
  };
  advancedIntelligence?: {
    dietary?: {
      original: {
        vegetarian: boolean;
        vegan: boolean;
        pescetarian: boolean;
        glutenFree: boolean;
        keto: boolean;
      };
      target: {
        vegetarian: boolean;
        vegan: boolean;
        pescetarian: boolean;
        glutenFree: boolean;
        keto: boolean;
      };
      compatible: {
        vegetarian: boolean;
        vegan: boolean;
      };
    };
    nutrition?: {
      score: number;
      calorieMatch: number;
      proteinMatch: number;
      carbMatch: number;
      fatMatch: number;
      balanced: boolean;
    };
    cookingMethods?: {
      preserved: string[];
      additional: string[];
      substituted: string[];
      description: string;
    };
    alternativeMatches?: Array<{
      dishName: string;
      similarityScore: number;
      cuisine: string;
      reasoning: string;
    }>;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}
