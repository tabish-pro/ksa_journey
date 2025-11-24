import { GoogleGenAI, Type } from "@google/genai";
import { JourneyData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVisitorJourney = async (personaType: string = "random"): Promise<JourneyData> => {
  // Using 2.5-flash for speed
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    Generate a visitor journey for a tourist in Saudi Arabia (KSA).
    Persona: "${personaType}" style traveler.
    
    Create 5 chronological stages:
    1. Pre-Trip
    2. Arrival
    3. Accommodation
    4. Exploration (Key site)
    5. Departure

    Requirements:
    - Sentiment score (0-100) for the curve.
    - Narrative: CONCISE (max 30 words).
    - Experience Points: 3 specific moments per stage with short descriptions.
    
    Output valid JSON matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          persona: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              origin: { type: Type.STRING },
              travelStyle: { type: Type.STRING },
              duration: { type: Type.STRING },
              summary: { type: Type.STRING, description: "Max 2 sentences." },
            },
            required: ["name", "origin", "travelStyle", "duration", "summary"]
          },
          stages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                stageName: { type: Type.STRING },
                location: { type: Type.STRING },
                sentimentScore: { type: Type.INTEGER },
                narrative: { type: Type.STRING, description: "Max 30 words." },
                imageUrl: { type: Type.STRING, description: "Visual keyword for image search" },
                experiencePoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["positive", "neutral", "negative"] },
                      icon: { type: Type.STRING, description: "Icon name: plane, map, camera, coffee, bed, star, sun, creditcard, user, heart, alert, check, luggage, utensils, mountain, landmark, building" }
                    },
                    required: ["title", "description", "type", "icon"]
                  }
                }
              },
              required: ["id", "stageName", "location", "sentimentScore", "narrative", "experiencePoints", "imageUrl"]
            }
          }
        },
        required: ["persona", "stages"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No data returned from Gemini");
  }

  try {
    return JSON.parse(text) as JourneyData;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Invalid JSON format from Gemini");
  }
};