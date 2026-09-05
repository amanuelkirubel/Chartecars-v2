import React from 'react';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  Zap,
  Phone
} from 'lucide-react';
import { PropertyListing, Language, Currency } from '../types';
import { getTranslation } from '../data/translations';
import { formatPrice } from '../utils/formatters';

interface ListingCardProps {
  listing: PropertyListing;
  lang: Language;
  currency: Currency;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (listing: PropertyListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  lang,
  currency,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const t = getTranslation(lang);
  const coverPhoto = listing.photos[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  const categoryLabelMap: Record<string, string> = {
    villa: t.cat_villa,
    apartment: t.cat_apartment,
    compound_g2: t.cat_compound_g2,
    townhouse: t.cat_townhouse,
    penthouse: t.cat_penthouse,
    commercial_residential: t.cat_commercial_residential,
  };

  return (
    <div 
      className="group relative bg-[#0D1B34] border border-blue-900/30 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/70 flex flex-col cursor-pointer"
      onClick={() => onSelect(listing)}
    >
      {/* Top Image Container with Badges */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        <img
          src={coverPhoto}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B34] via-transparent to-black/30 opacity-70" />

        {/* Status Ribbon / Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {/* Sale or Rent Tag */}
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-md ${
            listing.type === 'rent'
              ? 'bg-amber-600 text-white'
              : 'bg-blue-600 text-white'
          }`}>
            {listing.type === 'rent' ? t.for_rent : t.for_sale}
          </span>

          {/* Urgent status */}
          {listing.status === 'urgent' && (
            <span className="bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Zap className="w-3 h-3 fill-current" />
              {t.ribbon_urgent}
            </span>
          )}

          {/* Sold status */}
          {listing.status === 'sold' && (
            <span className="bg-slate-700 text-white px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              {t.ribbon_sold}
            </span>
          )}

          {/* Title Deed Carta Verified */}
          {listing.hasCarta && (
            <span className="bg-emerald-700/90 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3" />
              <span>ካርታ</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(listing.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
          }`}
          aria-label="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom image overlay: Category & Neighborhood */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-200 z-10">
          <span className="bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-blue-200">
            {categoryLabelMap[listing.category] || listing.category}
          </span>
          <span className="flex items-center gap-1 font-medium bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{listing.city}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Neighborhood Subtitle */}
          <div className="text-xs font-semibold text-blue-400 tracking-wide uppercase mb-1.5">
            {listing.neighborhood}
          </div>

          {/* Title */}
          <h3 
            className="text-base font-serif font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors mb-3"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {lang === 'am' && listing.titleAm ? listing.titleAm : listing.title}
          </h3>

          {/* Price */}
          <div className="mb-4">
            <span className="text-xl font-mono font-bold text-white tracking-tight">
              {formatPrice(listing.price, currency)}
            </span>
            {listing.type === 'rent' && (
              <span className="text-slate-400 text-xs font-medium ml-1">
                {t.per_month}
              </span>
            )}
          </div>
        </div>

        {/* Specs & CTA */}
        <div>
          {/* Specs: Beds, Baths, Area */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-slate-300 text-xs text-center font-medium">
            <div className="flex items-center justify-center gap-1.5">
              <Bed className="w-4 h-4 text-blue-400" />
              <span>{listing.bedrooms} {t.bd}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 border-x border-slate-800">
              <Bath className="w-4 h-4 text-blue-400" />
              <span>{listing.bathrooms} {t.ba}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-blue-400" />
              <span>{listing.area} {t.sqm}</span>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {lang === 'am' ? 'የተረጋገጠ ንብረት' : 'Direct listing'}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300 uppercase tracking-wider">
              <span>{t.learn_more}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
