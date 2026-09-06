import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2,
  Car
} from 'lucide-react';
import { Language } from '../types';

interface CarHeroSectionProps {
  onOpenSearch: () => void;
  onOpenListCar?: () => void;
  lang: Language;
  totalCarsCount: number;
}

export const CarHeroSection: React.FC<CarHeroSectionProps> = ({
  onOpenSearch,
  onOpenListCar,
  lang,
  totalCarsCount,
}) => {
  return (
    <section className="relative pt-12 pb-14 sm:pb-20 overflow-hidden bg-[#07132B]">
      
      {/* Background Layer: Blue Sports Car on Bridge */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="/charte-hero-car.jpg"
          alt="Charte Cars Hero"
          className="w-full h-full object-cover object-center scale-105 filter contrast-105 brightness-95"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80';
          }}
        />
      </div>

      {/* Cinematic Blue Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A255C]/75 via-[#0B3A8E]/60 to-[#0A255C]/80 pointer-events-none z-0" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        
        {/* Main Hero Headline */}
        <div className="max-w-4xl mx-auto my-6 sm:my-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'am' ? 'የኢትዮጵያ ቀዳሚ የመኪና የገበያ ስፍራ' : "Ethiopia's Leading Verified Car Marketplace"}</span>
          </div>

          <h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1] mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
          >
            {lang === 'am' ? (
              <>
                እራስዎን የሚያዩበትን ተመራጭ መኪና ያግኙ
              </>
            ) : (
              <>
                FIND A CAR YOU CAN<br />
                ACTUALLY SEE YOURSELF IN.
              </>
            )}
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm font-medium drop-shadow max-w-xl mx-auto mb-8">
            {lang === 'am'
              ? 'በአዲስ አበባና በመላው ኢትዮጵያ አስተማማኝ ተሽከርካሪዎችን ይግዙ፣ ይሽጡ ወይም ይከራዩ። ቀጥታ ከባለቤቶችና ከተረጋገጡ ሻጮች ጋር ያለ ደላላ ይገናኙ።'
              : 'Browse verified vehicles for sale and rent across Addis Ababa and Ethiopia. Zero broker commission, direct owner & dealer connection.'}
          </p>

          {/* Interactive Search Trigger Action & List Car Button (Clean and uncluttered) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0051E8] hover:bg-blue-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-950/80 border border-blue-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-blue-200" />
              <span>{lang === 'am' ? 'መኪና ፈልግ (Search Vehicles)' : 'Search Vehicles'}</span>
              <span className="bg-blue-900/80 text-blue-200 text-[11px] px-2 py-0.5 rounded-full font-mono ml-1">
                {totalCarsCount}
              </span>
            </button>

            {onOpenListCar && (
              <button
                type="button"
                onClick={onOpenListCar}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === 'am' ? 'መኪና ይሽጡ / ይዘርዝሩ' : '+ List Your Car'}</span>
              </button>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-blue-900/50 flex flex-wrap items-center justify-center gap-6 text-[11px] sm:text-xs text-blue-200/90 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'am' ? '0% የደላላ ኮሚሽን' : '0% Broker Commission'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>{lang === 'am' ? 'የተረጋገጡ የባለቤት ሰነዶች' : 'Verified Ownership Papers'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-400" />
              <span>{lang === 'am' ? 'በአዲስ አበባ እና በክፍለ ሀገር' : 'Addis Ababa & Regional Delivery'}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
