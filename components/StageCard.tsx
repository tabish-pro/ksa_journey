import React, { useRef, useEffect } from 'react';
import { JourneyStage } from '../types';
import { DynamicIcon } from './Icons';

interface StageCardProps {
  stage: JourneyStage;
  isActive: boolean;
  onClick: () => void;
}

export const StageCard: React.FC<StageCardProps> = ({ stage, isActive, onClick }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && contentRef.current) {
      // Logic for scrolling could go here, but disabled for smoother manual control
    }
  }, [isActive]);

  return (
    <div 
      onClick={onClick}
      ref={contentRef}
      className={`
        relative p-5 lg:p-6 rounded-2xl cursor-pointer transition-all duration-300 border group
        ${isActive 
          ? 'bg-slate-900/80 border-ksa-gold shadow-[0_0_30px_rgba(197,160,89,0.15)] scale-[1.01] z-10 ring-1 ring-ksa-gold/50' 
          : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 hover:border-white/10'
        }
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
             <h3 className={`font-display text-lg lg:text-xl font-semibold tracking-wide ${isActive ? 'text-ksa-gold' : 'text-slate-200 group-hover:text-slate-100'}`}>
               {stage.stageName}
             </h3>
             {isActive && <span className="animate-pulse w-2 h-2 rounded-full bg-ksa-gold"></span>}
          </div>
          <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
            <DynamicIcon name="map" size={12} className={isActive ? "text-ksa-gold/70" : "text-slate-500"} />
            {stage.location}
          </p>
        </div>
        <div className={`
          flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full font-bold text-xs lg:text-sm border backdrop-blur-sm transition-colors duration-300
          ${stage.sentimentScore >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
            stage.sentimentScore >= 50 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 
            'bg-red-500/10 border-red-500/30 text-red-400'}
        `}>
          {stage.sentimentScore}
        </div>
      </div>

      <div className={`
        grid transition-all duration-500 ease-in-out
        ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}
      `}>
        <div className="overflow-hidden">
          <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-ksa-gold/30 pl-3 italic mb-5">
            "{stage.narrative}"
          </p>
          
          <div className="space-y-2.5">
            {stage.experiencePoints.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                <div className={`
                  mt-0.5 p-1.5 rounded-md shrink-0
                  ${exp.type === 'positive' ? 'text-emerald-400 bg-emerald-500/10' : 
                    exp.type === 'negative' ? 'text-red-400 bg-red-500/10' : 'text-slate-400 bg-slate-700/30'}
                `}>
                  <DynamicIcon name={exp.icon} size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 leading-tight mb-1">{exp.title}</p>
                  <p className="text-xs text-slate-500 leading-normal">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {!isActive && (
         <div className="mt-3 py-1 text-[10px] text-slate-600 text-center uppercase tracking-widest font-medium flex items-center justify-center gap-2 opacity-60 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
            <span className="w-4 h-px bg-slate-700"></span>
            Tap to expand
            <span className="w-4 h-px bg-slate-700"></span>
         </div>
      )}
    </div>
  );
};