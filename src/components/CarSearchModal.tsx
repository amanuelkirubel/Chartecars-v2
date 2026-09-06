import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Car, 
  MapPin, 
  Gauge, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Fuel, 
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { CarFilterState, Language, ListingType } from '../types';
import { POPULAR_CAR_MAKES, CAR_BODY_TYPES, ETHIOPIAN_PLATE_CODES } from '../data/mockCars';
import { ETHIOPIAN_CITIES } from '../data/mockListings';

interface CarSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CarFilterState;
  onFilterChange: (patch: Partial<CarFilterState>) => void;
  onResetFilters: () => void;
  lang: Language;
  totalCarsCount: number;
}

export const CarSearchModal: React.FC<CarSearchModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  lang,
  totalCarsCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-[#071739] text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-700/60 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002B82] px-5 py-4 border-b border-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{lang === 'am' ? 'ተሽከርካሪዎችን ይፈልጉ እና ያጣሩ' : 'Search & Filter Vehicles'}</span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                  {totalCarsCount} {lang === 'am' ? 'ተገኝተዋል' : 'cars'}
                </span>
              </h3>
              <p className="text-xs text-blue-200">
                {lang === 'am' ? 'በብራንድ፣ በሞዴል፣ በከተማ እና በዋጋ ፈጣን ፍለጋ' : 'Find your exact car by make, model, city, body type, or price'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Top Toggles: All Cars, Buy (Sale), Rent */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#001033] p-2 rounded-2xl border border-blue-900/80">
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onFilterChange({ type: 'all' })}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'all'
                    ? 'bg-[#0037A3] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'am' ? 'ሁሉም መኪኖች (All)' : 'All Cars'}
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'sale' })}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'sale'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'am' ? 'ለሽያጭ Buy (Sale)' : 'Buy (Sale)'}
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ type: 'rent' })}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filters.type === 'rent'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'am' ? 'ለኪራይ (Rent)' : 'Rent'}
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              {totalCarsCount} {lang === 'am' ? 'መኪኖች ይገኛሉ' : 'cars matching criteria'}
            </div>
          </div>

          {/* Primary Filter Row: Keyword, Make, Body Type, City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'am' ? 'ሞዴል ወይም ቃል ይፈልጉ' : 'Search Model / Keyword'}</span>
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder={lang === 'am' ? 'ምሳሌ፡ Land Cruiser, RAV4, Dzire...' : 'e.g. Land Cruiser, RAV4, Dzire, BYD...'}
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                autoFocus
              />
            </div>

            {/* 2. Vehicle Make */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'am' ? 'የመኪና ብራንድ (Vehicle Make)' : 'Vehicle Make'}</span>
              </label>
              <select
                value={filters.make}
                onChange={(e) => onFilterChange({ make: e.target.value })}
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option value="">{lang === 'am' ? 'ሁሉም ብራንዶች (All Makes)' : 'All Makes'}</option>
                {POPULAR_CAR_MAKES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* 3. Body Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'am' ? 'የመኪና ቅርጽ (Body Type)' : 'Body Type'}</span>
              </label>
              <select
                value={filters.bodyType}
                onChange={(e) => onFilterChange({ bodyType: e.target.value })}
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option value="">{lang === 'am' ? 'ሁሉም ቅርጾች (All Body Types)' : 'All Body Types'}</option>
                {CAR_BODY_TYPES.map((bt) => (
                  <option key={bt.id} value={bt.id}>
                    {bt.icon} {bt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. City / Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'am' ? 'ከተማ (City / Location)' : 'City / Location'}</span>
              </label>
              <select
                value={filters.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
                className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-400"
              >
                <option value="">{lang === 'am' ? 'ሁሉም ከተሞች (All Cities)' : 'All Cities'}</option>
                {ETHIOPIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Toggle More Filters */}
          <div className="pt-2 flex items-center justify-between border-t border-blue-900/60">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-blue-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                {showAdvanced
                  ? (lang === 'am' ? 'ተጨማሪ ማጣሪያዎችን ደብቅ' : 'Hide Advanced Filters')
                  : (lang === 'am' ? 'ተጨማሪ ማጣሪያዎች (ነዳጅ፣ ማርሽ፣ ታርጋ ኮድ፣ ዋጋ...)' : 'More Filters (Fuel, Transmission, Plate Code, Price...)')}
              </span>
            </button>

            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'ማጣሪያ አጽዳ' : 'Reset All'}</span>
            </button>
          </div>

          {/* Advanced Filters Section */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 border-t border-blue-900/60 animate-in fade-in">
              
              {/* Transmission */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  {lang === 'am' ? 'ማርሽ (Transmission)' : 'Transmission'}
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => onFilterChange({ transmission: e.target.value })}
                  className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">{lang === 'am' ? 'ሁሉም (All)' : 'All'}</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  {lang === 'am' ? 'የነዳጅ አይነት (Fuel Type)' : 'Fuel Type'}
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => onFilterChange({ fuelType: e.target.value })}
                  className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">{lang === 'am' ? 'ሁሉም (All)' : 'All'}</option>
                  <option value="electric">Electric (EV)</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="petrol">Benzine / Petrol</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>

              {/* Plate Code */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  {lang === 'am' ? 'የታርጋ ኮድ (Plate Code)' : 'Ethiopian Plate Code'}
                </label>
                <select
                  value={filters.plateCode}
                  onChange={(e) => onFilterChange({ plateCode: e.target.value })}
                  className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">{lang === 'am' ? 'ሁሉም ኮዶች (All)' : 'All Plate Codes'}</option>
                  {ETHIOPIAN_PLATE_CODES.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Max Price */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  {lang === 'am' ? 'ከፍተኛ ዋጋ (Max Price ETB)' : 'Max Price (ETB)'}
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                  placeholder="e.g. 10000000"
                  className="w-full bg-[#001033] border border-blue-900/90 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-[#001440] px-5 py-4 border-t border-blue-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'am' ? 'አጽዳ' : 'Clear Filters'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial bg-[#0051E8] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{lang === 'am' ? `${totalCarsCount} መኪኖችን አሳይ` : `View ${totalCarsCount} Matching Cars`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
