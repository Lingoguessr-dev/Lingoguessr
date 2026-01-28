import React, { useMemo, useState } from "react";
import { Region } from "../types";

interface WorldMapProps {
  onSelectRegion?: (region: Region) => void;
  onSelectCountry?: (country: string) => void;
  mode: "REGION" | "COUNTRY";
  activeRegion?: Region;
}

/**
 * REGION mode: proper cartoony world map (recognisable continents, thick outline, soft sticker shadow).
 * COUNTRY mode: kept as a placeholder surface (you didn't ask to rebuild country borders yet).
 */
const WorldMap: React.FC<WorldMapProps> = ({
  onSelectRegion,
  onSelectCountry,
  mode,
  activeRegion,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const worldRegions = useMemo(() => {
    // ViewBox is 0 0 1000 500 (easy to place continents and make it look like a real map).
    // These are simplified continent silhouettes (cartoony, not accurate borders, but clearly real-world).
    return [
      {
        id: "North America" as Region,
        color: "#d92a34",
        d: `
          M95,135
          C110,95 155,70 210,72
          C265,75 300,95 325,125
          C350,155 347,190 322,212
          C298,232 270,233 255,252
          C238,274 235,300 214,317
          C188,339 165,330 148,310
          C132,292 122,270 112,245
          C100,215 85,180 95,135 Z

          M300,240
          C320,228 343,235 352,252
          C361,268 350,288 332,293
          C314,300 294,288 290,270
          C286,256 289,246 300,240 Z
        `,
        labelPos: { x: 210, y: 180 },
      },
      {
        id: "South America" as Region,
        color: "#3cb34d",
        d: `
          M295,315
          C330,300 365,310 382,342
          C400,378 387,415 370,440
          C350,468 332,488 315,480
          C298,472 295,450 286,430
          C274,405 260,382 268,350
          C273,332 280,322 295,315 Z
        `,
        labelPos: { x: 330, y: 395 },
      },
      {
        id: "Europe" as Region,
        color: "#29abe2",
        d: `
          M470,145
          C492,124 520,116 548,120
          C570,123 590,132 598,148
          C607,167 594,182 573,188
          C555,194 538,190 522,198
          C502,208 486,206 472,192
          C455,175 452,160 470,145 Z

          M520,98
          C530,90 544,90 553,98
          C561,106 556,118 545,122
          C533,126 520,116 518,106
          C517,103 518,100 520,98 Z
        `,
        labelPos: { x: 530, y: 165 },
      },
      {
        id: "Africa" as Region,
        color: "#f26522",
        d: `
          M505,205
          C540,190 575,190 600,210
          C620,226 628,252 622,274
          C615,302 598,318 590,343
          C580,374 560,410 530,415
          C505,420 492,395 483,370
          C472,340 456,320 455,292
          C454,258 470,232 505,205 Z

          M588,235
          C602,232 614,242 614,255
          C614,270 600,278 587,274
          C575,270 570,258 573,248
          C576,240 580,237 588,235 Z
        `,
        labelPos: { x: 540, y: 300 },
      },
      {
        id: "Asia" as Region,
        color: "#fbb040",
        d: `
          M600,130
          C650,95 725,85 790,95
          C850,105 900,140 915,185
          C930,230 905,255 885,275
          C860,300 845,330 820,345
          C790,363 750,360 720,345
          C690,330 670,320 655,295
          C640,270 625,265 615,240
          C600,205 590,165 600,130 Z

          M760,250
          C772,242 790,245 798,257
          C806,270 800,285 786,290
          C772,295 758,286 754,272
          C752,264 754,256 760,250 Z
        `,
        labelPos: { x: 760, y: 215 },
      },
      {
        id: "Oceania" as Region,
        color: "#2e3192",
        d: `
          M820,345
          C848,332 882,335 900,355
          C918,375 910,405 888,418
          C862,432 830,428 812,410
          C792,392 795,362 820,345 Z

          M920,420
          C930,413 944,416 948,427
          C952,438 944,450 932,450
          C920,450 912,435 920,420 Z
        `,
        labelPos: { x: 860, y: 390 },
      },
    ];
  }, []);

  const handleClick = (id: string) => {
    if (mode === "REGION") onSelectRegion?.(id as Region);
    else onSelectCountry?.(id);
  };

  const renderRegionMap = () => {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {/* Ocean */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-slate-100 dark:from-slate-900 dark:to-slate-950" />
        <div className="absolute inset-0 opacity-45 dark:opacity-25">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.35),transparent_40%),radial-gradient(circle_at_80%_55%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_55%_85%,rgba(56,189,248,0.2),transparent_52%)]" />
        </div>

        {/* Map SVG */}
        <svg viewBox="0 0 1000 500" className="relative w-full h-full">
          {/* Dotted “sea texture” */}
          <g opacity="0.12" className="dark:opacity-[0.10]">
            {Array.from({ length: 19 }).map((_, r) =>
              Array.from({ length: 39 }).map((__, c) => {
                const x = 25 + c * 25;
                const y = 25 + r * 25;
                return (
                  <circle
                    key={`${r}-${c}`}
                    cx={x}
                    cy={y}
                    r="1.3"
                    fill="currentColor"
                    className="text-slate-500"
                  />
                );
              })
            )}
          </g>

          {/* Continents */}
          {worldRegions.map((reg) => {
            const isHover = hovered === reg.id;

            return (
              <g
                key={reg.id}
                className="cursor-pointer select-none"
                onMouseEnter={() => setHovered(reg.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleClick(reg.id)}
              >
                {/* sticker shadow */}
                <path d={reg.d} fill="black" opacity={0.22} transform="translate(6 8)" />

                {/* main fill */}
                <path
                  d={reg.d}
                  fill={reg.color}
                  className={`transition-all duration-150 ${
                    isHover ? "opacity-95" : "opacity-100"
                  }`}
                />

                {/* thick cartoon outline */}
                <path
                  d={reg.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth={6}
                  strokeLinejoin="round"
                />

                {/* inner highlight stroke */}
                <path
                  d={reg.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  transform="translate(-2 -2)"
                />

                {/* subtle dark outline behind white outline (adds punch) */}
                <path
                  d={reg.d}
                  fill="none"
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth={8}
                  strokeLinejoin="round"
                  transform="translate(1 2)"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover label */}
        {hovered && (
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/90 text-white rounded-full text-sm font-black tracking-widest backdrop-blur-md pointer-events-none animate-in slide-in-from-bottom-2">
            {hovered}
          </div>
        )}
      </div>
    );
  };

  const renderCountryPlaceholder = () => {
    // You didn't ask for countries yet. This keeps the component working without breaking screens.
    // If you want a proper country map later, we’ll swap this for real region zoom + country shapes.
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-xl text-center bg-white/60 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-2xl font-black dark:text-white">Country Map Coming Next</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300 font-bold">
              Region map is now a proper world map. If you want clickable countries per region,
              tell me and I’ll build that next.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col bg-white dark:bg-[#020617] rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-[#0ea5e9] py-3 px-6 flex items-center justify-center text-white font-black text-lg relative">
        <div className="flex items-center gap-2">
          <span className="material-icons-round">public</span>
          {mode === "REGION" ? "Select a Region to Start" : "Click Map to Guess Country"}
        </div>
      </div>

      {mode === "REGION" ? renderRegionMap() : renderCountryPlaceholder()}
    </div>
  );
};

export default WorldMap;
