import React from 'react';
import { X, Heart, Trash2, ExternalLink, Bed, Bath, Maximize2 } from 'lucide-react';
import { PropertyListing, Language, Currency } from '../types';
import { getTranslation } from '../data/translations';
import { formatPrice } from '../utils/formatters';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: PropertyListing[];
  onRemoveFavorite: (id: string) => void;
  onSelectListing: (listing: PropertyListing) => void;
  lang: Language;
  currency: Currency;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectListing,
  lang,
  currency,
}) => {
  const t = getTranslation(lang);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#0B172E] border border-blue-900/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/40 bg-[#071224]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 
                className="text-lg font-serif font-bold text-white tracking-tight"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {t.nav_favorites} ({favorites.length})
              </h2>
              <p className="text-[11px] text-slate-400">
                Saved properties to review or inquire on
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

        {/* List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Heart className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm">You have not saved any properties yet.</p>
              <p className="text-xs text-slate-500">Tap the heart icon on any listing card to save it here.</p>
            </div>
          ) : (
            favorites.map((listing) => (
              <div 
                key={listing.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 p-3 rounded-xl flex items-center justify-between gap-4 transition-all"
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    onSelectListing(listing);
                    onClose();
                  }}
                >
                  <img
                    src={listing.photos[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'}
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide truncate">
                      {listing.city} &middot; {listing.neighborhood}
                    </div>
                    <h4 className="text-sm font-bold text-white truncate font-serif">
                      {lang === 'am' && listing.titleAm ? listing.titleAm : listing.title}
                    </h4>
                    <div className="text-xs font-mono font-semibold text-blue-300 mt-0.5">
                      {formatPrice(listing.price, currency)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectListing(listing);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                    title="View details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(listing.id)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
