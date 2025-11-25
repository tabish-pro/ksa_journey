import React, { useState, useEffect } from 'react';
import { generateVisitorJourney } from './services/gemini';
import { JourneyData } from './types';
import { StageCard } from './components/StageCard';
import { SentimentFlow } from './components/Visualization';
import { DynamicIcon } from './components/Icons';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [personaType, setPersonaType] = useState<string>('Luxury');

  const fetchData = async (pType: string) => {
    setLoading(true);
    setError(null);
    // Note: We do NOT clear 'data' here to allow the previous journey to remain visible 
    // while the new one loads, preventing layout shifts and improving perceived speed.
    try {
      const journey = await generateVisitorJourney(pType);
      setData(journey);
      if (journey.stages.length > 0) setActiveStageIndex(0);
    } catch (err) {
      setError("Failed to generate journey. Please try again. Ensure API Key is valid.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(personaType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePersonaChange = (type: string) => {
    setPersonaType(type);
    fetchData(type);
  };

  const bgImage = data && data.stages[activeStageIndex] 
    ? `https://picsum.photos/seed/${data.stages[activeStageIndex].imageUrl.replace(/\s/g, '')}/1920/1080` 
    : 'https://picsum.photos/seed/saudidesert/1920/1080';

  return (
    <div className="min-h-screen bg-ksa-deep text-white relative transition-all duration-1000 selection:bg-ksa-gold selection:text-white">
      
      {/* Background with Overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ksa-deep via-ksa-deep/90 to-ksa-deep/40" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      {/* Main Layout Container 
          - Mobile: min-h-screen (allows scrolling)
          - Desktop: h-screen (fixed viewport application feel)
      */}
      <div className="relative z-10 container mx-auto px-4 py-6 lg:py-8 lg:px-12 flex flex-col min-h-screen lg:h-screen">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8 border-b border-white/10 pb-6 shrink-0">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display text-white tracking-tight">
              Kingdom <span className="text-ksa-gold italic">Journeys</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Visitor Experience Mapper</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <select 
                value={personaType} 
                onChange={(e) => handlePersonaChange(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 pr-8 focus:ring-ksa-gold focus:border-ksa-gold outline-none appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <option value="Luxury">Luxury Seeker</option>
                <option value="Adventure">Desert Adventurer</option>
                <option value="Cultural">History & Heritage</option>
                <option value="Business">Business & Investment</option>
                <option value="Family">Family Vacation</option>
                <option value="Religious">Pilgrim (Umrah)</option>
                <option value="Eco">Eco-Tourism</option>
                <option value="Culinary">Foodie Explorer</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <DynamicIcon name="map" size={14} />
              </div>
            </div>
            {/* Show spinner in header when reloading existing data */}
            {loading && data && <Loader2 className="animate-spin text-ksa-gold shrink-0" size={20} />}
          </div>
        </header>

        {error ? (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="bg-red-900/50 border border-red-500/50 p-8 rounded-xl max-w-md text-center backdrop-blur-md">
              <DynamicIcon name="alert" className="mx-auto mb-4 text-red-400" size={48} />
              <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
              <p className="text-slate-300 mb-6">{error}</p>
              <button 
                onClick={() => fetchData(personaType)}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !data && loading ? (
          // Initial Full Screen Loader
          <div className="flex-1 flex flex-col items-center justify-center animate-pulse min-h-[50vh]">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-ksa-gold border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-ksa-gold/10 flex items-center justify-center">
                <DynamicIcon name="sun" className="text-ksa-gold animate-pulse" size={24} />
              </div>
            </div>
            <p className="text-xl font-display text-white">Crafting your journey...</p>
            <p className="text-slate-400 text-sm mt-2">Generating personalized experiences</p>
          </div>
        ) : data ? (
          // Main Content
          // Use dimming opacity to indicate loading state instead of unmounting
          <div className={`flex-1 flex flex-col lg:flex-row gap-8 lg:overflow-hidden transition-all duration-500 ${loading ? 'opacity-60 pointer-events-none grayscale-[0.5]' : 'opacity-100'}`}>
            
            {/* Left Column: Persona & Sentiment Chart */}
            <div className="lg:w-1/3 flex flex-col gap-6 shrink-0 lg:h-full lg:overflow-y-auto no-scrollbar pb-6 lg:pb-0">
              {/* Persona Card */}
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-ksa-gold shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-inner shrink-0">
                    <DynamicIcon name="user" size={28} className="text-ksa-gold" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display text-white">{data.persona.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs font-semibold bg-ksa-gold/20 text-ksa-gold px-2 py-0.5 rounded">
                        {data.persona.travelStyle}
                      </span>
                      <span className="text-xs text-slate-400 px-2 py-0.5 border border-slate-700 rounded">
                        {data.persona.origin}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 font-light">
                  {data.persona.summary}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5">
                  <DynamicIcon name="sun" size={14} className="text-ksa-gold" />
                  <span className="uppercase tracking-wider font-medium">Duration: {data.persona.duration}</span>
                </div>
              </div>

              {/* Chart Card */}
              <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col min-h-[300px] lg:min-h-0 shadow-xl">
                <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2 font-display">
                  <DynamicIcon name="heart" className="text-ksa-gold" size={18} />
                  Emotional Journey
                </h3>
                <div className="flex-1 w-full min-h-[200px]">
                  <SentimentFlow stages={data.stages} />
                </div>
              </div>
            </div>

            {/* Right Column: Stages Timeline */}
            <div className="lg:w-2/3 flex flex-col lg:h-full lg:overflow-hidden">
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2 shrink-0 font-display sticky top-0 bg-ksa-deep/95 lg:bg-transparent z-20 py-3 lg:py-0 backdrop-blur-md lg:backdrop-blur-none border-b lg:border-none border-white/5">
                <DynamicIcon name="map" className="text-ksa-gold" size={18} />
                Experience Timeline
              </h3>
              
              {/* Scrollable Area */}
              <div className="flex-1 lg:overflow-y-auto pr-0 lg:pr-2 pb-10 lg:pb-0 space-y-4 scroll-smooth custom-scrollbar">
                {data.stages.map((stage, idx) => (
                  <StageCard 
                    key={stage.id} 
                    stage={stage} 
                    isActive={idx === activeStageIndex}
                    onClick={() => setActiveStageIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}