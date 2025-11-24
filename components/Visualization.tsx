import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { JourneyStage } from '../types';

interface VisualizationProps {
  stages: JourneyStage[];
}

export const SentimentFlow: React.FC<VisualizationProps> = ({ stages }) => {
  const data = stages.map(s => ({
    name: s.stageName,
    score: s.sentimentScore,
    fullData: s
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C5A059" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            tick={{fontSize: 12}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            domain={[0, 100]} 
            hide
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
            itemStyle={{ color: '#C5A059' }}
          />
          <ReferenceLine y={50} stroke="#475569" strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#C5A059" 
            fillOpacity={1} 
            fill="url(#colorScore)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};