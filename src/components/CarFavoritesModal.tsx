import React from 'react';
import { X, Heart, Trash2, ExternalLink, Gauge, Fuel, Calendar, ArrowRight } from 'lucide-react';
import { CarListing, Language, Currency } from '../types';
import { formatCarPrice } from '../utils/formatters';

interface CarFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: CarListing[];
  onRemoveFavorite: (id: string) => void;
  onSelectCar: (car: CarListing) => void;
  lang: Language;
  currency: Currency;
}

export const CarFavoritesModal: React.FC<CarFavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectCar,
  lang,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#001438] border border-blue-900/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/50 bg-[#000E29]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {lang === 'am' ? 'የተቀመጡ መኪኖች' : 'Saved Vehicles'} ({favorites.length})
              </h2>
              <p className="text-[11px] text-blue-200/70">
                {lang === 'am' ? 'እርስዎ ያስቀመጧቸው ተሽከርካሪዎች' : 'Vehicles you saved for quick comparison'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-blue-950/60">
          {favorites.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                {lang === 'am' ? 'ምንም የተቀመጠ መኪና የለም' : 'No saved cars yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {lang === 'am' 
                  ? 'በመኪናዎች ካርድ ላይ የልብ ቅርፁን በመጫን በቀላሉ ያስቀምጡ።' 
                  : 'Tap the heart icon on any vehicle card to bookmark it for later review.'}
              </p>
            </div>
          ) : (
            favorites.map((car) => (
              <div
                key={car.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <img
                    src={car.images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'}
                    alt={car.title}
                    className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl object-cover border border-blue-900/50 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {lang === 'am' && car.titleAm ? car.titleAm : car.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-blue-400 mt-0.5">
                      {formatCarPrice(car.price, car.type, currency, lang)}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {car.year}
                      </span>
                      <span>·</span>
                      <span>{car.transmission}</span>
                      <span>·</span>
                      <span>{car.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onSelectCar(car);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <span>{lang === 'am' ? 'ዝርዝር እይ' : 'View'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(car.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-900/50 bg-[#000E29] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            {lang === 'am' ? 'ዝጋ' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
