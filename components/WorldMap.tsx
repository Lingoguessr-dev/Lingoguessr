
import React, { useState } from 'react';
import { Region } from '../types';

interface WorldMapProps {
  onSelectRegion?: (region: Region) => void;
  onSelectCountry?: (country: string) => void;
  mode: 'REGION' | 'COUNTRY';
  activeRegion?: Region;
}

const WorldMap: React.FC<WorldMapProps> = ({ onSelectRegion, onSelectCountry, mode, activeRegion }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Region paths based on a realistic world map projection with specific colors
  const regionData = [
    { 
      id: 'North America', 
      color: '#d92a34', // Red
      d: "M20,15 L35,10 L50,12 L85,25 L88,40 L75,50 L60,70 L55,90 L45,85 L35,80 L25,75 L15,65 Z",
      viewBox: "0 0 100 100",
      countries: [
        { id: 'USA', name: 'United States', d: "M30,35 L75,35 L80,55 L45,62 L30,55 Z" },
        { id: 'Canada', name: 'Canada', d: "M15,10 L85,15 L80,32 L25,32 Z" },
        { id: 'Mexico', name: 'Mexico', d: "M45,65 L68,58 L62,85 L52,90 Z" },
        { id: 'Greenland', name: 'Greenland', d: "M40,2 L60,2 L55,15 L40,15 Z" }
      ]
    },
    { 
      id: 'South America', 
      color: '#3cb34d', // Green
      d: "M65,95 L95,92 L115,115 L110,145 L95,185 L65,150 L55,115 Z",
      viewBox: "50 90 70 110",
      countries: [
        { id: 'Brazil', name: 'Brazil', d: "M80,100 L110,105 L105,140 L80,135 Z" },
        { id: 'Argentina', name: 'Argentina', d: "M75,145 L90,150 L85,180 L70,175 Z" },
        { id: 'Chile', name: 'Chile', d: "M65,135 L72,140 L65,180 L60,175 Z" },
        { id: 'Colombia', name: 'Colombia', d: "M65,98 L80,98 L75,110 L65,110 Z" }
      ]
    },
    { 
      id: 'Europe', 
      color: '#29abe2', // Cyan
      d: "M115,15 L135,10 L165,12 L175,45 L150,70 L115,65 L105,40 Z",
      viewBox: "100 0 80 80",
      countries: [
        { id: 'France', name: 'France', d: "M125,40 L140,40 L140,55 L125,55 Z" },
        { id: 'Germany', name: 'Germany', d: "M142,30 L158,30 L158,45 L142,45 Z" },
        { id: 'Italy', name: 'Italy', d: "M145,58 L155,58 L158,75 L148,75 Z" },
        { id: 'Spain', name: 'Spain', d: "M110,50 L125,50 L122,70 L110,68 Z" },
        { id: 'UK', name: 'United Kingdom', d: "M118,25 L130,22 L132,35 L120,38 Z" }
      ]
    },
    { 
      id: 'Africa', 
      color: '#f26522', // Orange
      d: "M105,75 L165,70 L195,110 L165,185 L125,185 L95,125 Z",
      viewBox: "90 65 105 130",
      countries: [
        { id: 'Egypt', name: 'Egypt', d: "M150,75 L175,75 L175,95 L150,95 Z" },
        { id: 'South Africa', name: 'South Africa', d: "M135,160 L155,160 L155,180 L135,180 Z" },
        { id: 'Nigeria', name: 'Nigeria', d: "M110,110 L125,110 L125,125 L110,125 Z" },
        { id: 'Ethiopia', name: 'Ethiopia', d: "M160,110 L175,110 L175,130 L160,130 Z" },
        { id: 'Algeria', name: 'Algeria', d: "M105,75 L140,75 L140,105 L105,105 Z" }
      ]
    },
    { 
      id: 'Asia', 
      color: '#fbb040', // Yellow
      d: "M180,15 L285,15 L298,135 L195,145 L175,45 Z",
      viewBox: "180 0 120 150",
      countries: [
        { id: 'China', name: 'China', d: "M210,45 L265,50 L260,95 L210,95 Z" },
        { id: 'India', name: 'India', d: "M200,100 L230,105 L220,135 L195,130 Z" },
        { id: 'Russia', name: 'Russia', d: "M185,15 L290,20 L285,45 L185,40 Z" },
        { id: 'Japan', name: 'Japan', d: "M280,50 L290,50 L292,85 L282,85 Z" },
        { id: 'Indonesia', name: 'Indonesia', d: "M220,125 L285,130 L285,145 L220,140 Z" }
      ]
    },
    { 
      id: 'Oceania', 
      color: '#2e3192', // Navy Blue
      d: "M225,145 L295,150 L290,195 L220,195 L215,145 Z",
      viewBox: "215 135 85 65",
      countries: [
        { id: 'Australia', name: 'Australia', d: "M225,150 L280,155 L275,185 L225,180 Z" },
        { id: 'New Zealand', name: 'New Zealand', d: "M282,185 L292,185 L292,200 L282,200 Z" }
      ]
    }
  ];

  const currentRegion = regionData.find(r => r.id === activeRegion);
  const isWorld = !activeRegion || activeRegion === 'World';

  const handleClick = (itemId: string) => {
    if (mode === 'REGION') {
      onSelectRegion?.(itemId as Region);
    } else {
      onSelectCountry?.(itemId);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col bg-white dark:bg-[#020617] rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in duration-700">
      {/* Header - Title Centered */}
      <div className="bg-[#0ea5e9] py-3 px-6 flex items-center justify-center text-white font-bold text-lg relative">
        <div className="flex items-center gap-2">
           <span className="material-icons-round">public</span>
           {mode === 'REGION' ? 'Select a Region to Start' : 'Click Map to Guess Country'}
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full bg-[#f8fafc] dark:bg-slate-900/50 overflow-hidden">
        <svg 
          viewBox={mode === 'COUNTRY' && !isWorld ? currentRegion?.viewBox : "0 0 300 200"} 
          className="w-full h-full transition-all duration-1000 ease-in-out"
        >
          {/* Detailed Land Paths */}
          {(mode === 'REGION' || isWorld ? regionData : currentRegion?.countries || []).map((item: any) => (
            <path
              key={item.id}
              d={item.d}
              fill={mode === 'REGION' ? item.color : (hoveredItem === item.id ? '#38bdf8' : '#cbd5e1')}
              className={`transition-all duration-200 cursor-pointer stroke-white/40 stroke-[0.3] hover:brightness-110 ${hoveredItem === item.id ? 'opacity-80' : 'opacity-100'}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleClick(item.id)}
            />
          ))}
        </svg>

        {/* Floating Label */}
        {hoveredItem && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/90 text-white rounded-full text-sm font-black tracking-widest backdrop-blur-md pointer-events-none animate-in slide-in-from-bottom-2">
            {hoveredItem}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap;
