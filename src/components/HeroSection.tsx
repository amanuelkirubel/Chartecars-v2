import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  Bed, 
  SlidersHorizontal, 
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Play,
  Pause,
  Video
} from 'lucide-react';
import { FilterState, Language, ListingType } from '../types';
import { getTranslation } from '../data/translations';
import { ETHIOPIAN_CITIES } from '../data/mockListings';

interface HeroSectionProps {
  filters: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onResetFilters: () => void;
  lang: Language;
  totalListingsCount: number;
}

const DEFAULT_HERO_VIDEO = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/89/Aerial_views_of_Downtown_Manhattan%2C_New_York_City%2C_USA_at_night_including_Battery_Park%2C_Freedom_Tower%2C_Wall_Street%2C_The_Oculus%2C_West_Side_Highway_and_Hudson_River.webm/Aerial_views_of_Downtown_Manhattan%2C_New_York_City%2C_USA_at_night_including_Battery_Park%2C_Freedom_Tower%2C_Wall_Street%2C_The_Oculus%2C_West_Side_Highway_and_Hudson_River.webm.480p.vp9.webm';

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  lang,
  totalListingsCount,
}) => {
  const t = getTranslation(lang);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoSrc, setVideoSrc] = useState<string>(() => {
    return localStorage.getItem('charte_homes_hero_video') || DEFAULT_HERO_VIDEO;
  });

  // Listen for video changes from Admin Portal
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('charte_homes_hero_video');
      setVideoSrc(stored || DEFAULT_HERO_VIDEO);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="relative pt-10 pb-16 overflow-hidden bg-[#09152A] border-b border-blue-900/30">
      
      {/* Background Video Layer - Highly Visible & Vibrant */}
      {videoSrc && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center opacity-85 sm:opacity-90 scale-105 filter brightness-100 contrast-105 transition-opacity duration-700"
            poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
          />
        </div>
      )}

      {/* Cinematic Contrast Overlay (Light enough to clearly see the video, strong enough for text legibility) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#061226]/55 via-[#091D3E]/35 to-[#071328]/75 pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] z-0" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Background Video Control Button (Discreet) */}
      <div className="absolute top-3 right-4 z-20">
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/70 hover:bg-slate-900 text-slate-300 text-[11px] font-medium border border-slate-700/60 backdrop-blur-md transition-colors"
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3 text-blue-400" />
              <span className="hidden sm:inline">Pause Video</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Play Video</span>
            </>
          )}
        </button>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top Tag & Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 backdrop-blur-md border border-blue-400/40 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-black/40">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.hero_badge}</span>
          </div>

          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.18] mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {t.hero_title}
          </h1>

          <p className="text-slate-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium">
            {t.hero_sub}
          </p>
        </div>

        {/* Search & Filter Container */}
        <div className="max-w-5xl mx-auto bg-[#09162E]/92 backdrop-blur-xl rounded-2xl border border-blue-700/50 p-4 sm:p-6 shadow-2xl shadow-black/80">
          
          {/* Top Row: Purpose Mode (Buy / Rent / All) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onFilterChange({ type: 'all' })}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filters.type === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.tab_all}
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ type: 'sale' })}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filters.type === 'sale'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.tab_sale}
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ type: 'rent' })}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filters.type === 'rent'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.tab_rent}
              </button>
            </div>

            {/* Carta Title Deed Checkbox */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800 hover:border-blue-500/40 transition-colors">
              <input
                type="checkbox"
                checked={filters.hasCartaOnly}
                onChange={(e) => onFilterChange({ hasCartaOnly: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
              />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.carta_verified}</span>
              </span>
            </label>
          </div>

          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search query (Neighborhood / keyword) */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {lang === 'am' ? 'ሰፈር / ቁልፍ ቃል' : 'Neighborhood / Keyword'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  placeholder={t.search_placeholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* City Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {t.label_city}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={filters.city}
                  onChange={(e) => onFilterChange({ city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">{t.all_cities}</option>
                  {ETHIOPIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Category */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {t.label_property_type}
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={filters.category}
                  onChange={(e) => onFilterChange({ category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">{t.all_types}</option>
                  <option value="villa">{t.cat_villa}</option>
                  <option value="apartment">{t.cat_apartment}</option>
                  <option value="compound_g2">{t.cat_compound_g2}</option>
                  <option value="penthouse">{t.cat_penthouse}</option>
                  <option value="townhouse">{t.cat_townhouse}</option>
                  <option value="commercial_residential">{t.cat_commercial_residential}</option>
                </select>
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {t.label_bedrooms}
              </label>
              <div className="relative">
                <Bed className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={filters.bedrooms}
                  onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">{t.any_bedrooms}</option>
                  <option value="1">1+ Beds</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                  <option value="5">5+ Beds</option>
                </select>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Reset & Active Count */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>
              {lang === 'am' ? 'የተገኙ ቤቶች፦ ' : 'Showing: '}
              <strong className="text-white font-semibold">{totalListingsCount}</strong>
              {lang === 'am' ? ' ቤቶች' : ' verified properties'}
            </span>

            {(filters.city || filters.searchQuery || filters.category || filters.bedrooms || filters.hasCartaOnly || filters.type !== 'all') && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.btn_reset}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
