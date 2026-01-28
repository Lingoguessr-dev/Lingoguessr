
import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, GameState, Difficulty, Region, LanguageData } from './types';
import { LANGUAGES, REGIONS } from './constants';
import { generateGameContent, fetchTTSData } from './services/geminiService';
import GameScreen from './components/GameScreen';
import WorldMap from './components/WorldMap';

const INITIAL_STATE: GameState = {
  mode: GameMode.HOME,
  playType: 'Standard',
  selectedRegion: 'World',
  difficulty: Difficulty.MEDIUM,
  currentClues: [],
  hintsRemaining: 3,
  revealedHints: [],
  isAudioPlaying: false,
  gameEnded: false,
  score: 0
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  // Default to dark mode as requested
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const startGame = useCallback(async (type: 'Standard' | 'Daily' | 'Random', region?: Region) => {
    setLoading(true);
    let targetRegion: Region = region || 'World';
    
    if (type === 'Daily') {
      const today = new Date().toDateString();
      const lastPlayed = localStorage.getItem('lastDailyPlayed');
      if (lastPlayed === today) {
        alert("Daily limit reached! Try Standard Play.");
        setLoading(false);
        return;
      }
      localStorage.setItem('lastDailyPlayed', today);
      targetRegion = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    }

    if (type === 'Random') {
      targetRegion = 'World';
    }

    const filtered = targetRegion === 'World' 
      ? LANGUAGES 
      : LANGUAGES.filter(l => l.region === targetRegion);
    
    const target = filtered[Math.floor(Math.random() * filtered.length)];
    
    const content = await generateGameContent(target.language, target.country);
    // Pre-generate audio for zero latency
    const voice = target.language === 'French' || target.language === 'Japanese' ? 'Kore' : 'Puck';
    const audioData = await fetchTTSData(content.native, voice);
    
    setGameState(prev => ({
      ...prev,
      mode: GameMode.PLAYING,
      playType: type,
      selectedRegion: targetRegion,
      targetLanguage: target.language,
      targetCountry: target.country,
      englishSentence: content.english,
      nativeSentence: content.native,
      audioData: audioData || undefined,
      currentClues: [],
      hintsRemaining: 3,
      revealedHints: [],
      gameEnded: false
    }));
    setLoading(false);
  }, []);

  const renderHome = () => (
    <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-6">
      <div className="lg:col-span-7 flex flex-col items-center lg:items-end space-y-12 order-2 lg:order-1">
        <div className="text-center lg:text-right space-y-4">
          <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter text-slate-900 dark:text-white drop-shadow-2xl transition-all">
            LINGO<span className="text-primary">GUESSR</span>
          </h1>
          <div className="relative group inline-block">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
             <p className="relative text-2xl md:text-3xl font-black text-slate-900 dark:text-sky-50 tracking-tight uppercase px-8 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
              Explore the World, One Word at a Time
            </p>
          </div>
        </div>
        
        <nav className="w-full max-w-md glass-panel bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 rounded-[3rem] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all">
          <ul className="flex flex-col space-y-4">
            <li>
              <button 
                onClick={() => setGameState(prev => ({ ...prev, mode: GameMode.REGION_SELECT, playType: 'Standard' }))}
                className="w-full bg-primary text-white font-black py-5 px-8 rounded-[2rem] transition-all flex items-center justify-between group hover:scale-[1.02] hover:shadow-primary/40 shadow-xl"
              >
                <span className="text-xl">Standard Play</span>
                <span className="material-icons-round text-3xl transition-transform group-hover:rotate-12">map</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => startGame('Daily')}
                className="w-full bg-secondary text-white font-black py-5 px-8 rounded-[2rem] transition-all flex items-center justify-between group hover:scale-[1.02] hover:shadow-secondary/40 shadow-xl"
              >
                <span className="text-xl">Daily Challenge</span>
                <span className="material-icons-round text-3xl group-hover:animate-pulse">bolt</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => startGame('Random')}
                className="w-full bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-black py-5 px-8 rounded-[2rem] transition-all flex items-center justify-between border border-white/50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-700 shadow-lg"
              >
                <span className="text-xl">Random Mode</span>
                <span className="material-icons-round text-3xl">shuffle</span>
              </button>
            </li>
            <li className="pt-4 flex gap-4">
              <button 
                onClick={() => setGameState(prev => ({ ...prev, mode: GameMode.SETTINGS }))}
                className="flex-1 bg-slate-900/10 dark:bg-white/10 hover:bg-slate-900/20 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <span className="material-icons-round">settings</span> Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="lg:col-span-5 flex justify-center lg:justify-start h-full items-center order-1 lg:order-2">
        <div className="relative animate-float cursor-default group">
          <div className="relative z-20 bg-white dark:bg-slate-900 rounded-[3rem] rounded-bl-none p-12 shadow-2xl border-4 border-dashed border-slate-200 dark:border-slate-700 transform transition-transform duration-500 hover:scale-105 min-w-[320px] text-center">
            <div className="space-y-4 font-display">
              <h2 className="text-5xl font-bold text-sky-400">Hello</h2>
              <h2 className="text-5xl font-bold text-rose-500">Bonjour</h2>
              <h2 className="text-5xl font-bold text-emerald-500">你好</h2>
              <h2 className="text-4xl font-bold text-purple-500">ستري مشي</h2>
              <h2 className="text-4xl font-bold text-orange-500">Habari</h2>
              <h2 className="text-4xl font-bold text-pink-500">Báwo</h2>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-white dark:bg-slate-900 border-b-4 border-l-4 border-slate-100 dark:border-slate-700 transform rotate-45 z-10 rounded-bl-xl"></div>
        </div>
      </div>
    </div>
  );

  const renderRegionSelect = () => (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 space-y-12 animate-in zoom-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-5xl font-black dark:text-white tracking-tight">Select Your Region</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Narrow your search on the map below</p>
      </div>

      <WorldMap 
        mode="REGION" 
        onSelectRegion={(reg) => setGameState(prev => ({ ...prev, selectedRegion: reg }))} 
      />

      <div className="flex gap-6 items-center bg-white/20 dark:bg-black/20 p-2 rounded-[2rem] border border-white/20">
        {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map(diff => (
          <button
            key={diff}
            onClick={() => setGameState(prev => ({ ...prev, difficulty: diff }))}
            className={`px-10 py-4 rounded-[1.5rem] font-black transition-all transform-gpu ${
              gameState.difficulty === diff 
              ? 'bg-white text-primary shadow-2xl scale-110' 
              : 'text-slate-500 hover:text-white'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      <button 
        onClick={() => startGame('Standard', gameState.selectedRegion === 'World' ? undefined : gameState.selectedRegion)}
        disabled={gameState.selectedRegion === 'World'}
        className={`px-16 py-6 rounded-full font-black text-xl shadow-2xl flex items-center gap-4 transform transition-all hover:scale-105 active:scale-95 ${
          gameState.selectedRegion === 'World' 
          ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed' 
          : 'bg-emerald-500 text-white hover:bg-emerald-400'
        }`}
      >
        Start Adventure <span className="material-icons-round text-3xl">flight_takeoff</span>
      </button>
    </div>
  );

  const renderResults = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in slide-in-from-bottom-12 duration-700">
      <div className="glass-panel bg-white/80 dark:bg-slate-900/90 p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/40 max-w-2xl w-full">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
           <span className="material-icons-round text-6xl text-primary">{gameState.score > 0 ? 'stars' : 'sentiment_dissatisfied'}</span>
        </div>
        <h2 className="text-6xl font-black mb-4 dark:text-white tracking-tighter">
          {gameState.score > 0 ? "EXCELLENT!" : "STAY BRAVE!"}
        </h2>
        <p className="text-2xl text-slate-500 dark:text-slate-400 mb-12">
          The correct answer was <span className="text-primary font-black uppercase">{gameState.targetLanguage}</span> in <span className="text-secondary font-black uppercase">{gameState.targetCountry}</span>
        </p>

        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Final Score</span>
             <span className="text-4xl font-black text-primary">{gameState.score}</span>
          </div>
          <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
             <span className="text-4xl font-black text-amber-500">{gameState.score > 0 ? 'PASSED' : 'FAILED'}</span>
          </div>
        </div>

        <button 
          onClick={() => setGameState(INITIAL_STATE)}
          className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xl hover:opacity-90 shadow-2xl transition-all transform hover:-translate-y-1"
        >
          BACK TO HUB
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-lg w-full glass-panel bg-white/80 dark:bg-slate-900/90 p-16 rounded-[4rem] shadow-2xl border border-white/40 space-y-12 animate-in zoom-in duration-500">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center">
           <span className="material-icons-round text-3xl dark:text-white">settings_suggest</span>
        </div>
        <h2 className="text-4xl font-black dark:text-white tracking-tighter">Preferences</h2>
      </div>
      
      <div className="space-y-8">
        <div className="flex items-center justify-between p-6 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-white shadow-sm">
          <div>
            <h4 className="font-black text-xl dark:text-white">Night View</h4>
            <p className="text-slate-500 font-medium">Switch to midnight atmosphere</p>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-20 h-10 rounded-full transition-all relative ${darkMode ? 'bg-primary shadow-[0_0_20px_rgba(14,165,233,0.5)]' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-xl transform transition-transform duration-500 ${darkMode ? 'translate-x-11' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <button 
        onClick={() => setGameState(prev => ({ ...prev, mode: GameMode.HOME }))}
        className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-sky-400 transition-all"
      >
        SAVE & CLOSE
      </button>
    </div>
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden font-body text-slate-900 dark:text-white">
      {/* Immersive Sky Background */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Atmospheric sky" 
          className="w-full h-full object-cover transition-all duration-[2000ms] scale-105" 
          src={darkMode 
            ? "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=1920" 
            : "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&q=80&w=1920" 
          } 
        />
        <div className={`absolute inset-0 transition-all duration-[2000ms] ${darkMode ? 'bg-slate-950/70 backdrop-blur-sm' : 'bg-primary/5'}`} />
        {darkMode && (
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse-slow"></div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 dark:bg-slate-950/60 backdrop-blur-xl transition-all">
          <div className="relative">
             <div className="w-32 h-32 border-[12px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-icons-round text-4xl text-primary animate-bounce">public</span>
             </div>
          </div>
          <p className="mt-8 text-3xl font-black text-primary tracking-tighter uppercase animate-pulse">Navigating Boundaries...</p>
        </div>
      )}

      <main className="relative z-10 flex flex-col items-center justify-center h-full w-full p-4 overflow-hidden">
        {gameState.mode === GameMode.HOME && renderHome()}
        {gameState.mode === GameMode.REGION_SELECT && renderRegionSelect()}
        {gameState.mode === GameMode.PLAYING && <GameScreen gameState={gameState} setGameState={setGameState} />}
        {gameState.mode === GameMode.SETTINGS && renderSettings()}
        {gameState.mode === GameMode.RESULTS && renderResults()}
      </main>

      {/* Level UI and Footer Label Cleaned Up */}
      <div className="absolute bottom-8 right-8 z-20 opacity-30 select-none">
        <span className="font-black text-2xl tracking-[0.2em] uppercase text-slate-500 dark:text-white/20">LingoGuessr Engine v3.0</span>
      </div>
    </div>
  );
};

export default App;
