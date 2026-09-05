import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Fuel, 
  Gauge, 
  Calendar 
} from 'lucide-react';
import { CarFilterState, Language, ListingType } from '../types';
import { POPULAR_CAR_MAKES, CAR_BODY_TYPES, ETHIOPIAN_PLATE_CODES } from '../data/mockCars';
import { ETHIOPIAN_CITIES } from '../data/mockListings';

interface CarHeroSectionProps {
  filters: CarFilterState;
  onFilterChange: (patch: Partial<CarFilterState>) => void;
  onResetFilters: () => void;
  lang: Language;
  totalCarsCount: number;
}

export const CarHeroSection: React.FC<CarHeroSectionProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  lang,
  totalCarsCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <section className="relative pt-12 pb-16 overflow-hidden bg-[#07132B]">
      
      {/* Background Layer: Blue Sports Car on Bridge (Identical to Screenshot 1) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="/charte-hero-car.jpg"
          alt="Charte Cars Hero"
          className="w-full h-full object-cover object-center scale-105 filter contrast-105 brightness-95"
          onError={(e) => {
            // High reliability fallback to sports car
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80';
          }}
        />
      </div>

      {/* Cinematic Blue Overlay for Readability (Matching Screenshot 1) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A255C]/70 via-[#0B3A8E]/50 to-[#0A255C]/75 pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Main Hero Headline (Exactly matching Screenshot 1) */}
        <div className="text-center max-w-4xl mx-auto my-6 sm:my-10">
          <h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1] mb-3 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
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
          <p className="text-blue-100 text-xs sm:text-sm font-medium drop-shadow max-w-xl mx-auto">
            {lang === 'am'
              ? 'በአዲስ አበባና በመላው ኢትዮጵያ አስተማማኝ ተሽከርካሪዎችን ይግዙ፣ ይሽጡ ወይም ይከራዩ'
              : 'Browse verified vehicles for sale and rent across Addis Ababa and Ethiopia.'}
          </p>
        </div>

        {/* Search & Filter Container Card */}
        <div className="max-w-5xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-blue-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-white space-y-4">
          
          {/* Top Toggles: Mode (Buy / Rent / All) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-1.5 bg-[#001033] p-1 rounded-xl border border-blue-900/60">
              <button
                type="button"
                onClick={() => onFilterChange({ type: 'all' })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filters.type === 'all'
                    ? 'bg-[#0037A3] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'am' ? 'ሁሉም (All)' : 'All Cars'}
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'sale' })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filters.type === 'sale'
                    ? 'bg-[#0037A3] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'am' ? 'ለሽያጭ (Buy)' : 'Buy (Sale)'}
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'rent' })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filters.type === 'rent'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'am' ? 'ለኪራይ (Rent)' : 'Rent'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-mono text-emerald-400 font-bold">{totalCarsCount}</span>
              <span>{lang === 'am' ? 'መኪኖች ተገኝተዋል' : 'cars available'}</span>
            </div>
          </div>

          {/* Core Search Filters: Make, Body Type, City, Query */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* 1. Keyword / Model Search */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Search className="w-3 h-3 text-blue-400" />
                <span>{lang === 'am' ? 'ሞዴል ወይም ቃል ፈልግ' : 'Search Model / Keyword'}</span>
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder={lang === 'am' ? 'ምሳሌ፡ Land Cruiser, Tucson...' : 'e.g. Land Cruiser, RAV4, Dzire...'}
                className="w-full bg-[#001033] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 2. Make Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Car className="w-3 h-3 text-blue-400" />
                <span>{lang === 'am' ? 'የመኪና ብራንድ (Make)' : 'Vehicle Make'}</span>
              </label>
              <select
                value={filters.make}
                onChange={(e) => onFilterChange({ make: e.target.value })}
                className="w-full bg-[#001033] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">{lang === 'am' ? 'ሁሉም ብራንዶች (All Makes)' : 'All Makes'}</option>
                {POPULAR_CAR_MAKES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* 3. Body Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-blue-400" />
                <span>{lang === 'am' ? 'የመኪና ቅርጽ (Body)' : 'Body Type'}</span>
              </label>
              <select
                value={filters.bodyType}
                onChange={(e) => onFilterChange({ bodyType: e.target.value })}
                className="w-full bg-[#001033] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">{lang === 'am' ? 'ሁሉም ቅርጾች (All Types)' : 'All Body Types'}</option>
                {CAR_BODY_TYPES.map((bt) => (
                  <option key={bt.id} value={bt.id}>
                    {bt.icon} {bt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. City Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" />
                <span>{lang === 'am' ? 'ከተማ (City)' : 'City / Location'}</span>
              </label>
              <select
                value={filters.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
                className="w-full bg-[#001033] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">{lang === 'am' ? 'ሁሉም ከተሞች (All Cities)' : 'All Cities'}</option>
                {ETHIOPIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Toggle Advanced Filters Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                {showAdvanced
                  ? (lang === 'am' ? 'ተጨማሪ ማጣሪያዎችን ደብቅ' : 'Hide Advanced Filters')
                  : (lang === 'am' ? 'ተጨማሪ ማጣሪያዎች (ነዳጅ፣ ማርሽ፣ ታርጋ ኮድ...)' : 'More Filters (Fuel, Transmission, Plate Code...)')}
              </span>
            </button>

            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'am' ? 'ማጣሪያ አጽዳ' : 'Reset'}</span>
            </button>
          </div>

          {/* Advanced Collapsible Filter Row */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 animate-in fade-in-50">
              
              {/* Transmission */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">
                  {lang === 'am' ? 'ማርሽ (Transmission)' : 'Transmission'}
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => onFilterChange({ transmission: e.target.value })}
                  className="w-full bg-[#001033] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">{lang === 'am' ? 'ሁሉም (All)' : 'All'}</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">
                  {lang === 'am' ? 'የነዳጅ አይነት (Fuel)' : 'Fuel Type'}
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => onFilterChange({ fuelType: e.target.value })}
                  className="w-full bg-[#001033] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">{lang === 'am' ? 'ሁሉም (All)' : 'All'}</option>
                  <option value="Electric">Electric (EV)</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Benzine">Benzine / Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>

              {/* Plate Code */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">
                  {lang === 'am' ? 'የታርጋ ኮድ (Plate Code)' : 'Ethiopian Plate Code'}
                </label>
                <select
                  value={filters.plateCode}
                  onChange={(e) => onFilterChange({ plateCode: e.target.value })}
                  className="w-full bg-[#001033] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">{lang === 'am' ? 'ሁሉም ኮዶች (All)' : 'All Plate Codes'}</option>
                  {ETHIOPIAN_PLATE_CODES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Max Price */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">
                  {lang === 'am' ? 'ከፍተኛ ዋጋ (Max Price ETB)' : 'Max Price (ETB)'}
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                  placeholder="e.g. 10000000"
                  className="w-full bg-[#001033] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
