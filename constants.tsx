
import { LanguageData, Region } from './types';

export const LANGUAGES: LanguageData[] = [
  { language: 'French', country: 'France', region: 'Europe', voiceName: 'Kore' },
  { language: 'German', country: 'Germany', region: 'Europe', voiceName: 'Puck' },
  { language: 'Italian', country: 'Italy', region: 'Europe', voiceName: 'Kore' },
  { language: 'Spanish', country: 'Spain', region: 'Europe', voiceName: 'Puck' },
  { language: 'Dutch', country: 'Netherlands', region: 'Europe', voiceName: 'Kore' },
  { language: 'Japanese', country: 'Japan', region: 'Asia', voiceName: 'Kore' },
  { language: 'Chinese', country: 'China', region: 'Asia', voiceName: 'Puck' },
  { language: 'Korean', country: 'South Korea', region: 'Asia', voiceName: 'Kore' },
  { language: 'Hindi', country: 'India', region: 'Asia', voiceName: 'Puck' },
  { language: 'Vietnamese', country: 'Vietnam', region: 'Asia', voiceName: 'Kore' },
  { language: 'Swahili', country: 'Kenya', region: 'Africa', voiceName: 'Puck' },
  { language: 'Yoruba', country: 'Nigeria', region: 'Africa', voiceName: 'Kore' },
  { language: 'Arabic', country: 'Egypt', region: 'Africa', voiceName: 'Puck' },
  { language: 'Zulu', country: 'South Africa', region: 'Africa', voiceName: 'Kore' },
  { language: 'Portuguese', country: 'Brazil', region: 'South America', voiceName: 'Puck' },
  { language: 'Spanish', country: 'Argentina', region: 'South America', voiceName: 'Kore' },
  { language: 'Spanish', country: 'Colombia', region: 'South America', voiceName: 'Puck' },
  { language: 'English', country: 'USA', region: 'North America', voiceName: 'Kore' },
  { language: 'English', country: 'Canada', region: 'North America', voiceName: 'Puck' },
  { language: 'Spanish', country: 'Mexico', region: 'North America', voiceName: 'Kore' },
  { language: 'English', country: 'Australia', region: 'Oceania', voiceName: 'Puck' },
  { language: 'English', country: 'New Zealand', region: 'Oceania', voiceName: 'Kore' },
];

export const REGIONS: Region[] = [
  'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'
];
