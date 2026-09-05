import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Lock, 
  Share2, 
  Heart, 
  Phone, 
  Mail, 
  Send, 
  Check,
  Building,
  Calculator,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PropertyListing, Language, Currency } from '../types';
import { getTranslation } from '../data/translations';
import { 
  formatPrice, 
  createWhatsAppInquiryLink, 
  createTelegramInquiryLink 
} from '../utils/formatters';
import { CONTACT_INFO } from '../data/mockListings';

interface ListingDetailModalProps {
  listing: PropertyListing | null;
  onClose: () => void;
  lang: Language;
  currency: Currency;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenCalculator: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  lang,
  currency,
  isFavorite,
  onToggleFavorite,
  onOpenCalculator,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!listing) return null;

  const t = getTranslation(lang);
  const photos = listing.photos && listing.photos.length > 0 
    ? listing.photos 
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Charte Homes: ${listing.title}`,
          text: `Check out this house on Charte Homes: ${listing.title} (${listing.price.toLocaleString()} ETB)`,
          url,
        });
      } catch (err) {
        // user cancelled or share failed, fallback to copy
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const whatsappLink = createWhatsAppInquiryLink(listing.title, listing.price, listing.id);
  const telegramLink = createTelegramInquiryLink(listing.title, listing.price);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-[#0B172E] border border-blue-900/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Sticky Header with Close and Quick Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/40 bg-[#081226]">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              listing.type === 'rent' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {listing.type === 'rent' ? t.for_rent : t.for_sale}
            </span>
            {listing.status === 'urgent' && (
              <span className="bg-red-600 text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{t.ribbon_urgent}</span>
              </span>
            )}
            {listing.status === 'sold' && (
              <span className="bg-slate-700 text-white px-2.5 py-1 rounded-md text-xs font-bold">
                {t.ribbon_sold}
              </span>
            )}
            {listing.hasCarta && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-700/80 text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.amenity_carta}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite toggle */}
            <button
              onClick={() => onToggleFavorite(listing.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-red-500/20 border-red-500/60 text-red-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Share property"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Gallery */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-slate-950 border border-blue-900/30">
              <img
                src={photos[activePhotoIdx]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-colors"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white">
                    {activePhotoIdx + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activePhotoIdx 
                        ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/30' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Location & Price Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-blue-900/40">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{listing.city} &middot; {listing.neighborhood}</span>
              </div>
              <h1 
                className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {lang === 'am' && listing.titleAm ? listing.titleAm : listing.title}
              </h1>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {listing.type === 'rent' ? t.for_rent : t.for_sale}
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-blue-300">
                {formatPrice(listing.price, currency)}
                {listing.type === 'rent' && (
                  <span className="text-sm font-normal text-slate-400 ml-1">{t.per_month}</span>
                )}
              </div>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Bed className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">{t.stat_bedrooms || 'Bedrooms'}</div>
                <div className="text-base font-bold text-white">{listing.bedrooms} Beds</div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Bath className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">{t.stat_bathrooms || 'Bathrooms'}</div>
                <div className="text-base font-bold text-white">{listing.bathrooms} Baths</div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Maximize2 className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">{t.stat_area || 'Total Area'}</div>
                <div className="text-base font-bold text-white">{listing.area} m²</div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Car className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">{t.amenity_parking}</div>
                <div className="text-base font-bold text-white">{listing.parkingSpaces || 2} Cars</div>
              </div>
            </div>
          </div>

          {/* Amenities & Utilities */}
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.amenities}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <ShieldCheck className={`w-4 h-4 ${listing.hasCarta ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>{t.amenity_carta}</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <Zap className={`w-4 h-4 ${listing.hasGenerator ? 'text-amber-400' : 'text-slate-600'}`} />
                <span>{t.amenity_generator}</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <Droplets className={`w-4 h-4 ${listing.hasWaterTank ? 'text-blue-400' : 'text-slate-600'}`} />
                <span>{t.amenity_water_tank}</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <Lock className={`w-4 h-4 ${listing.hasSecurity ? 'text-indigo-400' : 'text-slate-600'}`} />
                <span>{t.amenity_security}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
              {t.description}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {lang === 'am' && listing.descriptionAm ? listing.descriptionAm : listing.description}
            </p>
          </div>

          {/* Contact Direct Box */}
          <div className="bg-gradient-to-r from-blue-950/95 via-[#0A1A3A] to-indigo-950/95 p-5 sm:p-6 rounded-2xl border border-blue-500/40 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Charte Homes Official Brokerage Desk</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  {t.contact_agent}
                </h3>
                <p className="text-xs text-blue-200/80 max-w-xl leading-relaxed">
                  {t.contact_sub} Inquiries and on-site viewings are coordinated directly with Charte Homes agents.
                </p>
                <div className="pt-1 text-xs font-mono text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Call / WA: <strong className="text-white">{CONTACT_INFO.phone1Display}</strong> / <strong className="text-white">{CONTACT_INFO.phone2Display}</strong></span>
                  <span>Telegram: <strong className="text-blue-300">@charte7</strong> & <strong className="text-blue-300">@charte77</strong></span>
                  <span>Email: <strong className="text-white">{CONTACT_INFO.email}</strong></span>
                </div>
              </div>

              {/* Inquiry Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* WhatsApp 1 */}
                <a
                  href={createWhatsAppInquiryLink(listing.title, listing.price, listing.id, CONTACT_INFO.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                  title="WhatsApp 0715737393"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp 1</span>
                </a>

                {/* WhatsApp 2 */}
                <a
                  href={createWhatsAppInquiryLink(listing.title, listing.price, listing.id, CONTACT_INFO.whatsappNumber2)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-700/30 flex items-center gap-1.5 transition-all"
                  title="WhatsApp 0939804748"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp 2</span>
                </a>

                {/* Direct Call 1 */}
                <a
                  href={`tel:${CONTACT_INFO.phone1}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {CONTACT_INFO.phone1Display}</span>
                </a>

                {/* Direct Call 2 */}
                <a
                  href={`tel:${CONTACT_INFO.phone2}`}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {CONTACT_INFO.phone2Display}</span>
                </a>

                {/* Telegram @charte7 */}
                <a
                  href={createTelegramInquiryLink(listing.title, listing.price, 'charte7')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-sky-600/30 flex items-center gap-1.5 transition-all"
                >
                  <span>@charte7</span>
                </a>

                {/* Telegram @charte77 */}
                <a
                  href={createTelegramInquiryLink(listing.title, listing.price, 'charte77')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-sky-700/30 flex items-center gap-1.5 transition-all"
                >
                  <span>@charte77</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
