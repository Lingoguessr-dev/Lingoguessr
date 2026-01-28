import React, { useMemo, useState } from 'react';
import { Region } from '../types';

interface WorldMapProps {
  onSelectRegion?: (region: Region) => void;
  onSelectCountry?: (country: string) => void;
  mode: 'REGION' | 'COUNTRY';
  activeRegion?: Region;
}

const WorldMap: React.FC<WorldMapProps> = ({ onSelectRegion, onSelectCountry, mode, activeRegion }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const regionData = useMemo(() => {
    // Cartoony continent silhouettes (curved paths) to replace the old polygon blocks.
    // Coordinates keep the same overall "0 0 300 200" map space so COUNTRY mode can still work.
    return [
      {
        id: 'North America',
        color: '#d92a34',
        // Curvy "North America" blob
        d: `
          M28,20
          C38,10 62,8 80,16
          C92,22 100,32 98,44
          C96,58 86,58 82,70
          C78,82 64,94 52,88
          C40,82 30,78 24,66
          C18,54 18,34 28,20
          Z
        `,
        viewBox: '0 0 110 110',
        countries: [
          { id: 'USA', name: 'United States', d: 'M30,35 L75,35 L80,55 L45,62 L30,55 Z' },
          { id: 'Canada', name: 'Canada', d: 'M15,10 L85,15 L80,32 L25,32 Z' },
          { id: 'Mexico', name: 'Mexico', d: 'M45,65 L68,58 L62,85 L52,90 Z' },
          { id: 'Greenland', name: 'Greenland', d: 'M40,2 L60,2 L55,15 L40,15 Z' },
        ],
      },
      {
        id: 'South America',
        color: '#3cb34d',
        // Curvy "South America" blob
        d: `
          M78,92
          C92,90 108,98 112,112
          C116,128 112,144 104,160
          C96,176 84,190 74,176
          C64,162 56,140 58,124
          C60,108 64,96 78,92
          Z
        `,
        viewBox: '45 85 95 125',
        countries: [
          { id: 'Brazil', name: 'Brazil', d: 'M80,100 L110,105 L105,140 L80,135 Z' },
          { id: 'Argentina', name: 'Argentina', d: 'M75,145 L90,150 L85,180 L70,175 Z' },
          { id: 'Chile', name: 'Chile', d: 'M65,135 L72,140 L65,180 L60,175 Z' },
          { id: 'Colombia', name: 'Colombia', d: 'M65,98 L80,98 L75,110 L65,110 Z' },
        ],
      },
      {
        id: 'Europe',
        color: '#29abe2',
        // Curvy "Europe" blob
        d: `
          M120,22
          C134,12 156,12 168,24
          C178,34 176,48 164,56
          C152,64 134,66 122,56
          C110,46 110,32 120,22
          Z
        `,
        viewBox: '95 0 95 95',
        countries: [
          { id: 'France', name: 'France', d: 'M125,40 L140,40 L140,55 L125,55 Z' },
          { id: 'Germany', name: 'Germany', d: 'M142,30 L158,30 L158,45 L142,45 Z' },
          { id: 'Italy', name: 'Italy', d: 'M145,58 L155,58 L158,75 L148,75 Z' },
          { id: 'Spain', name: 'Spain', d: 'M110,50 L125,50 L122,70 L110,68 Z' },
          { id: 'UK', name: 'United Kingdom', d: 'M118,25 L130,22 L132,35 L120,38 Z' },
        ],
      },
      {
        id: 'Africa',
        color: '#f26522',
        // Curvy "Africa" blob
        d: `
          M120,70
          C142,62 168,64 184,78
          C200,94 198,112 190,126
          C182,140 176,160 160,178
          C144,196 122,192 112,170
          C102,150 96,120 104,104
          C112,88 106,78 120,70
          Z
        `,
        viewBox: '85 55 140 160',
        countries: [
          { id: 'Egypt', name: 'Egypt', d: 'M150,75 L175,75 L175,95 L150,95 Z' },
          { id: 'South Africa', name: 'South Africa', d: 'M135,160 L155,160 L155,180 L135,180 Z' },
          { id: 'Nigeria', name: 'Nigeria', d: 'M110,110 L125,110 L125,125 L110,125 Z' },
          { id: 'Ethiopia', name: 'Ethiopia', d: 'M160,110 L175,110 L175,130 L160,130 Z' },
          { id: 'Algeria', name: 'Algeria', d: 'M105,75 L140,75 L140,105 L105,105 Z' },
        ],
      },
      {
        id: 'Asia',
        color: '#fbb040',
        // Curvy "Asia" blob (big mass to the right)
        d: `
          M182,28
          C210,12 258,10 286,24
          C306,34 306,62 300,80
          C294,98 294,124 280,138
          C266,152 242,150 226,144
          C210,138 196,128 188,112
          C180,96 172,86 174,66
          C176,46 168,40 182,28
          Z
        `,
        viewBox: '165 0 150 170',
        countries: [
          { id: 'China', name: 'China', d: 'M210,45 L265,50 L260,95 L210,95 Z' },
          { id: 'India', name: 'India', d: 'M200,100 L230,105 L220,135 L195,130 Z' },
          { id: 'Russia', name: 'Russia', d: 'M185,15 L290,20 L285,45 L185,40 Z' },
          { id: 'Japan', name: 'Japan', d: 'M280,50 L290,50 L292,85 L282,85 Z' },
          { id: 'Indonesia', name: 'Indonesia', d: 'M220,125 L285,130 L285,145 L220,140 Z' },
        ],
      },
      {
        id: 'Oceania',
        color: '#2e3192',
        // Curvy "Oceania" blob (Australia-ish)
        d: `
          M222,152
          C236,140 270,140 288,154
          C300,164 298,186 284,192
          C270,198 242,198 228,190
          C214,182 210,164 222,152
          Z
        `,
        viewBox: '205 135 110 80',
        countries: [
          { id: 'Australia', name: 'Australia', d: 'M225,150 L280,155 L275,185 L225,180 Z' },
          { id: 'New Zealand', name: 'New Zealand', d: 'M282,185 L292,185 L292,200 L282,200 Z' },
        ],
      },
    ] as const;
  }, []);

  const currentRegion = regionData.find(r => r.id === activeRegion);
  const isWorld = !activeRegion || activeRegion === 'World';

  const handleClick = (itemId: string) => {
    if (mode === 'REGION') {
      onSelectRegion?.(itemId as Region);
    } else {
      onSelectCountry?.(itemId);
    }
  };

  const itemsToRender: any[] =
    mode === 'REGION' || isWorld ? (regionData as any[]) : (currentRegion?.countries as any[]) || [];

  const svgViewBox =
    mode === 'COUNTRY' && !isWorld
      ? (currentRegion?.viewBox ?? '0 0 300 200')
      : '0 0 300 200';

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col bg-white dark:bg-[#020617] rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-[#0ea5e9] py-3 px-6 flex items-center justify-center text-white font-black text-lg relative">
        <div className="flex items-center gap-2">
          <span className="material-icons-round">public</span>
          {mode === 'REGION' ? 'Select a Region to Start' : 'Click Map to Guess Country'}
        </div>
      </div>

      {/* Map */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {/* Ocean background that matches your glassy vibe */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-slate-100 dark:from-slate-900 dark:to-slate-950" />
        <div className="absolute inset-0 opacity-40 dark:opacity-25">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.35),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_55%_85%,rgba(56,189,248,0.2),transparent_50%)]" />
        </div>

        <svg viewBox={svgViewBox} className="relative w-full h-full transition-all duration-1000 ease-in-out">
          {/* subtle grid dots */}
          <g opacity="0.15" className="dark:opacity-[0.10]">
            {Array.from({ length: 18 }).map((_, row) =>
              Array.from({ length: 28 }).map((__, col) => {
                const x = 10 + col * 10;
                const y = 10 + row * 10;
                return <circle key={`${row}-${col}`} cx={x} cy={y} r="0.6" fill="currentColor" className="text-slate-500" />;
              })
            )}
          </g>

          {/* Land */}
          {itemsToRender.map((item: any) => {
            const isHover = hoveredItem === item.id;
            const isRegionMode = mode === 'REGION';

            // REGION mode: use strong color palette
            // COUNTRY mode: use neutral land and highlight on hover
            const fill = isRegionMode ? item.color : isHover ? '#38bdf8' : '#cbd5e1';

            return (
              <g
                key={item.id}
                className="cursor-pointer select-none"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleClick(item.id)}
              >
                {/* soft shadow “sticker” effect */}
                <path
                  d={item.d}
                  fill="black"
                  opacity={0.18}
                  transform="translate(1.8 2.4)"
                />

                {/* thick cartoon outline */}
                <path
                  d={item.d}
                  fill={fill}
                  className={`transition-all duration-200 ${isHover ? 'opacity-95' : 'opacity-100'}`}
                  stroke={isRegionMode ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.5)'}
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                />

                {/* inner highlight line for “cute” depth */}
                {isRegionMode && (
                  <path
                    d={item.d}
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth={0.9}
                    strokeLinejoin="round"
                    transform="translate(-0.8 -0.8)"
                  />
                )}
              </g>
            );
          })}
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
