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
        // Cu
