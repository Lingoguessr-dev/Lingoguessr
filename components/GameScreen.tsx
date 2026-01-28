
import React, { useState, useEffect } from 'react';
import { GameState, GameMode } from '../types';
import { playTTSFromData, getClue, generateCulturalHint } from '../services/geminiService';
import WorldMap from './WorldMap';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, setGameState }) => {
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [clueError, setClueError] = useState<string | null>(null);

  const handlePlayAudio = async () => {
    if (gameState.isAudioPlaying || !gameState.audioData) return;
    
    setGameState(prev => ({ ...prev, isAudioPlaying: true }));
    const source = await playTTSFromData(gameState.audioData);
    
    if (source) {
      source.start();
      source.onended = () => {
        setGameState(prev => ({ ...prev, isAudioPlaying: false }));
      };
    } else {
      setGameState(prev => ({ ...prev, isAudioPlaying: false }));
    }
  };

  const handleAskClue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    setIsAsking(true);
    setClueError(null);

    const clue = await getClue(question, gameState.targetLanguage!, gameState.targetCountry!);
    
    if (clue === 'ASK_ANOTHER') {
      setClueError("Ask something less direct!");
    } else {
      setGameState(prev => ({
        ...prev,
        currentClues: [`Q: ${question} \n A: ${clue}`, ...prev.currentClues].slice(0, 3)
      }));
      setQuestion('');
    }
    setIsAsking(false);
  };

  const handleRequestHint = async () => {
    if (gameState.hintsRemaining <= 0 || isGettingHint) return;

    setIsGettingHint(true);
    let hintText = "";
    const hintCount = gameState.revealedHints.length;

    if (hintCount === 0) {
      hintText = `Starts with "${gameState.targetCountry?.[0]}"`;
    } else if (hintCount === 1) {
      hintText = await generateCulturalHint(gameState.targetLanguage!, gameState.targetCountry!);
    } else {
      hintText = `It's specifically within the ${gameState.selectedRegion} region boundaries.`;
    }

    setGameState(prev => ({
      ...prev,
      hintsRemaining: prev.hintsRemaining - 1,
      revealedHints: [...prev.revealedHints, hintText],
      score: Math.max(0, prev.score - 15)
    }));
    setIsGettingHint(false);
  };

  const handleAnswer = (country: string) => {
    if (country === 'World') return; // Close/Cancel

    const isCorrect = country.toLowerCase() === gameState.targetCountry?.toLowerCase();
    
    setGameState(prev => ({
      ...prev,
      gameEnded: true,
      mode: GameMode.RESULTS,
      score: isCorrect ? prev.score + 150 : prev.score
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 h-full overflow-y-auto pb-12 px-6 pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Control Center */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
          <div className="glass-panel bg-white/40 dark:bg-slate-800/40 p-10 rounded-[3rem] border border-white/40 shadow-2xl space-y-8">
            <div className="space-y-2">
              <span className="px-4 py-1 bg-primary/10 text-primary text-xs font-black uppercase rounded-full tracking-widest border border-primary/20">The Prompt</span>
              <p className="text-3xl font-black dark:text-white leading-tight tracking-tight italic">
                "{gameState.englishSentence}"
              </p>
            </div>

            <button
              onClick={handlePlayAudio}
              disabled={gameState.isAudioPlaying}
              className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl group ${
                gameState.isAudioPlaying 
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50 grayscale' 
                : 'bg-primary text-white hover:bg-sky-400 hover:-translate-y-1'
              }`}
            >
              <span className={`material-icons-round text-4xl ${gameState.isAudioPlaying ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`}>
                {gameState.isAudioPlaying ? 'graphic_eq' : 'volume_up'}
              </span>
              {gameState.isAudioPlaying ? 'LISTENING...' : 'HEAR LANGUAGE'}
            </button>

            <div className="pt-6 border-t border-white/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Oracle Inquiries</span>
                <span className="text-xs font-bold text-primary">{gameState.hintsRemaining} HINTS LEFT</span>
              </div>
              <form onSubmit={handleAskClue} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-white/50 dark:bg-slate-900/50 border-none rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/30 dark:text-white font-bold transition-all"
                />
                <button 
                  type="submit"
                  disabled={isAsking}
                  className="bg-secondary text-white p-4 rounded-2xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                >
                  <span className="material-icons-round">bolt</span>
                </button>
              </form>
              
              <button
                onClick={handleRequestHint}
                disabled={gameState.hintsRemaining <= 0 || isGettingHint}
                className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-sm tracking-widest transition-all hover:shadow-amber-500/30 shadow-lg disabled:opacity-30 disabled:grayscale uppercase"
              >
                {isGettingHint ? 'UNVEILING...' : 'REVEAL HINT'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
             {gameState.revealedHints.map((hint, i) => (
                <div key={`h-${i}`} className="p-5 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-[2rem] text-sm font-bold text-amber-600 dark:text-amber-400 animate-in slide-in-from-left duration-300">
                   <span className="material-icons-round text-lg mr-2 align-middle">lightbulb</span> {hint}
                </div>
             ))}
          </div>
        </div>

        {/* Right Map Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-4xl font-black dark:text-white tracking-tighter">Locate Native Speakers</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Search Area: {gameState.selectedRegion}</p>
            </div>
            <div className="flex gap-2">
               <div className="px-4 py-2 bg-white/20 dark:bg-black/20 rounded-full font-black text-sm uppercase border border-white/20">{gameState.playType}</div>
               <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full font-black text-sm uppercase border border-emerald-500/20">{gameState.difficulty}</div>
            </div>
          </div>
          
          <WorldMap mode="COUNTRY" activeRegion={gameState.selectedRegion} onSelectCountry={handleAnswer} />
        </div>

      </div>
    </div>
  );
};

export default GameScreen;
