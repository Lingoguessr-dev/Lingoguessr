
export enum GameMode {
  HOME = 'HOME',
  REGION_SELECT = 'REGION_SELECT',
  PLAYING = 'PLAYING',
  SETTINGS = 'SETTINGS',
  RESULTS = 'RESULTS'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export type Region = 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania' | 'World';

export interface GameState {
  mode: GameMode;
  playType: 'Standard' | 'Daily' | 'Random';
  selectedRegion: Region;
  difficulty: Difficulty;
  targetLanguage?: string;
  targetCountry?: string;
  englishSentence?: string;
  nativeSentence?: string;
  audioData?: string; // Base64 audio data pre-generated
  currentClues: string[];
  hintsRemaining: number;
  revealedHints: string[];
  isAudioPlaying: boolean;
  gameEnded: boolean;
  score: number;
}

export interface LanguageData {
  language: string;
  country: string;
  region: Region;
  voiceName: string;
}
