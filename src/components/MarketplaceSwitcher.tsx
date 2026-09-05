import React from 'react';
import { Car, Home, Sparkles } from 'lucide-react';
import { MarketplaceMode, Language } from '../types';

interface MarketplaceSwitcherProps {
  mode: MarketplaceMode;
  onSelectMode: (mode: MarketplaceMode) => void;
  lang: Language;
  carsCount: number;
  homesCount: number;
}

export const MarketplaceSwitcher: React.FC<MarketplaceSwitcherProps> = ({
  mode,
  onSelectMode,
  lang,
  carsCount,
  homesCount,
}) => {
  return (
    <div className="bg-slate-950/90 border-b border-slate-800 text-white py-1.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Brand switcher buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-[11px] font-semibold text-slate-400 hidden md:inline mr-1 uppercase tracking-wider">
            {lang === 'am' ? 'የቻርቴ ገበያ፡' : 'Charte Marketplace:'}
          </span>

          {/* Charte Cars Toggle */}
          <button
            type="button"
            onClick={() => onSelectMode('cars')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mode === 'cars'
                ? 'bg-[#003399] text-white shadow-md shadow-blue-600/40 border border-blue-400/50'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-blue-300" />
            <span>Charte Cars</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              mode === 'cars' ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
            }`}>
              {carsCount}
            </span>
          </button>

          {/* Charte Homes Toggle */}
          <button
            type="button"
            onClick={() => onSelectMode('homes')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mode === 'homes'
                ? 'bg-[#003399] text-white shadow-md shadow-blue-600/40 border border-blue-400/50'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-blue-300" />
            <span>Charte Homes</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              mode === 'homes' ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
            }`}>
              {homesCount}
            </span>
          </button>
        </div>

        {/* Right: Hotline / Direct Access */}
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="hidden sm:inline text-slate-400">
            {mode === 'cars' 
              ? (lang === 'am' ? 'መኪና ይግዙ ወይም ይከራዩ' : 'Buy, Rent or Sell Cars') 
              : (lang === 'am' ? 'ዘመናዊ ቤቶችና ቪላዎች' : 'Modern Homes & Villas')}
          </span>
          <a
            href="tel:0715737393"
            className="font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>📞 0715737393</span>
          </a>
        </div>

      </div>
    </div>
  );
};
