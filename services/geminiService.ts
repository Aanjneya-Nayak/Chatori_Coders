
import { GoogleGenAI, Type } from "@google/genai";
import { TranslationResult } from "../types";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const translationSchema = {
  type: Type.OBJECT,
  properties: {
    translatedDishName: { type: Type.STRING },
    originalCuisine: { type: Type.STRING },
    targetCuisine: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          originalName: { type: Type.STRING },
          role: { type: Type.STRING },
          chemicalMatch: { type: Type.STRING },
          similarityScore: { type: Type.NUMBER }
        },
        required: ["name", "role", "similarityScore"]
      }
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    explanation: { type: Type.STRING },
    compoundOverlap: { type: Type.NUMBER },
    overallSimilarity: { type: Type.NUMBER },
    fingerprint: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        sweet: { type: Type.NUMBER },
        sour: { type: Type.NUMBER },
        salty: { type: Type.NUMBER },
        bitter: { type: Type.NUMBER },
        umami: { type: Type.NUMBER },
        spicy: { type: Type.NUMBER }
      }
    },
    structuralMapping: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          translated: { type: Type.STRING },
          role: { type: Type.STRING }
        }
      }
    }
  },
  required: [
    "translatedDishName",
    "ingredients",
    "instructions",
    "explanation",
    "compoundOverlap",
    "overallSimilarity",
    "fingerprint"
  ]
};

export async function translateCuisine(
  dishName: string,
  fromCuisine: string,
  toCuisine: string
): Promise<TranslationResult> {
  // Switched to gemini-3-flash-preview for much faster response times
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the dish "${dishName}" from ${fromCuisine} cuisine to ${toCuisine} cuisine.
    Perform a molecular-level substitution analysis using structural culinary roles.
    1. Identify ingredients of "${dishName}".
    2. Assign roles (Aromatic Base, Fat Medium, Umami Source, Acid Component, Texture Element, Garnish).
    3. Find molecularly similar ingredients in ${toCuisine} that fulfill the same role (e.g., Parmesan matches Miso for Umami due to high Glutamic Acid).
    4. Provide the result in a structured format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: translationSchema,
      temperature: 0.6,
      // Disabled thinking budget to minimize latency as requested
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  // Extract the generated text output using the .text property
  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TranslationResult;
}
