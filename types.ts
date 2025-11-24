export interface ExperiencePoint {
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'negative';
  icon: string; // Lucide icon name mapping
}

export interface JourneyStage {
  id: string;
  stageName: string; // e.g., "Dreaming", "Arrival", "Exploration"
  location: string;
  sentimentScore: number; // 0-100
  narrative: string;
  experiencePoints: ExperiencePoint[];
  imageUrl: string;
}

export interface TouristPersona {
  name: string;
  origin: string;
  travelStyle: 'Luxury' | 'Adventure' | 'Cultural' | 'Business';
  duration: string;
  summary: string;
}

export interface JourneyData {
  persona: TouristPersona;
  stages: JourneyStage[];
}

export const INITIAL_JOURNEY_DATA: JourneyData = {
  persona: {
    name: "Loading...",
    origin: "...",
    travelStyle: "Cultural",
    duration: "...",
    summary: "Please wait while we generate a unique visitor journey."
  },
  stages: []
};