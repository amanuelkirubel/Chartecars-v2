import React, { useState, useRef } from 'react';
import { 
  Car, 
  MapPin, 
  Fuel, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  Heart, 
  Eye, 
  ChevronLeft,
  ChevronRight, 
  Calendar,
  User,
  AlertCircle,
  Tag,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { CarListing, Language, Currency } from '../types';

interface CarListingCardProps {
  car: CarListing;
  onSelect: (car: CarListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  lang: Language;
  currency: Currency;
  isAdminLoggedIn?: boolean;
}

export const CarListingCard: React.FC<CarListingCardProps> = ({
  car,
  onSelect,
  isFavorite,
  onToggleFavorite,
  lang,
  currency,
  isAdminLoggedIn = false,
}) => {
  // Once a car is marked SOLD, the seller's name/phone/WhatsApp are hidden
  // from public view — only the Admin Portal keeps full access.
  const isSoldAndHidden = car.status === 'sold' && !isAdminLoggedIn;
  // Direct photo navigation state right on the card (without entering inside)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usdRate = 145; // Approx ETB to USD
      return `$${Math.round(amount / usdRate).toLocaleString()} USD`;
    }
    return `${amount.toLocaleString()} ETB`;
  };

  const getConditionBadge = () => {
    switch (car.condition) {
      case 'brand_new':
        return { label: lang === 'am' ? 'አዲስ 0 ኪ.ሜ' : 'Brand New 0km', bg: 'bg-emerald-500 text-white' };
      case 'like_new':
        return { label: lang === 'am' ? 'በጣም ንጹህ' : 'Like New', bg: 'bg-blue-600 text-white' };
      case 'duty_free':
        return { label: lang === 'am' ? 'ቀረጥ ነጻ' : 'Duty Free', bg: 'bg-purple-600 text-white' };
      default:
        return { label: lang === 'am' ? 'ያገለገለ' : 'Used', bg: 'bg-slate-700 text-slate-200' };
    }
  };

  const conditionBadge = getConditionBadge();

  // Color Requirements:
  // 1. Sold mark: RED
  // 2. Urgent mark: YELLOW
  // 3. List mark: GREEN
  const getStatusBadge = () => {
    if (car.status === 'sold') {
      return {
        label: lang === 'am' ? 'የተሸጠ (SOLD)' : 'SOLD',
        bg: 'bg-red-600 text-white border-red-500 shadow-red-900/30',
        dot: 'bg-white'
      };
    }
    if (car.status === 'urgent') {
      return {
        label: lang === 'am' ? 'አጣዳፊ (URGENT)' : 'URGENT',
        bg: 'bg-yellow-400 text-slate-950 font-black border-yellow-300 shadow-amber-900/30',
        dot: 'bg-slate-950'
      };
    }
    // Default or active status: GREEN "LISTED"
    return {
      label: lang === 'am' ? 'በዝርዝር ላይ (LISTED)' : 'LISTED',
      bg: 'bg-emerald-600 text-white border-emerald-400/70 shadow-emerald-900/30',
      dot: 'bg-emerald-200'
    };
  };

  const statusBadge = getStatusBadge();

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (car.photos && car.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : car.photos.length - 1));
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (car.photos && car.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev < car.photos.length - 1 ? prev + 1 : 0));
    }
  };

  // Touch swipe handlers to change photo on mobile without entering
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40 && car.photos && car.photos.length > 1) {
      if (diff > 0) {
        // Swipe left -> Next photo
        setCurrentPhotoIndex((prev) => (prev < car.photos.length - 1 ? prev + 1 : 0));
      } else {
        // Swipe right -> Prev photo
        setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : car.photos.length - 1));
      }
    }
    touchStartX.current = null;
  };

  const sellerPhoneRaw = car.sellerContact?.phone?.replace(/[^0-9]/g, '') || '';
  const waPhone = sellerPhoneRaw
    ? (sellerPhoneRaw.startsWith('0') ? `251${sellerPhoneRaw.substring(1)}` : (sellerPhoneRaw.startsWith('251') ? sellerPhoneRaw : `251${sellerPhoneRaw}`))
    : '251715737393';
  const sellerText = encodeURIComponent(
    `Hello ${car.sellerContact?.name || 'Seller'}, I found your car on Charte Cars: ${car.year} ${car.make} ${car.model} (${car.price.toLocaleString()} ETB, Ref: #${car.id}). I am interested in viewing / purchasing it.`
  );

  const activePhoto = (car.photos && car.photos[currentPhotoIndex]) || car.photos?.[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between relative"
    >
      <div>
        {/* Photo Container & Interactive Navigation Directly on Card */}
        <div 
          className="relative h-56 sm:h-64 overflow-hidden bg-slate-950 cursor-pointer select-none" 
          onClick={() => onSelect(car)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={activePhoto} 
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Top Gradient for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 pointer-events-none" />

          {/* Sold Overlay Stamp if marked sold */}
          {car.status === 'sold' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none flex items-center justify-center z-15">
              <span className="bg-red-600/95 text-white font-black text-sm sm:text-base uppercase px-5 py-2 rounded-xl shadow-2xl tracking-widest border border-white/40 rotate-[-7deg]">
                {lang === 'am' ? 'የተሸጠ • SOLD' : 'SOLD • የተሸጠ'}
              </span>
            </div>
          )}

          {/* Top Left Badges: Status (Sold=Red, Urgent=Yellow, List=Green), Type, Plate */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-20">
            {/* Status Badge: SOLD (Red) | URGENT (Yellow) | LISTED (Green) */}
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-md flex items-center gap-1 backdrop-blur-md ${statusBadge.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              <span>{statusBadge.label}</span>
            </span>

            {/* Sale or Rent */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm ${
              car.type === 'rent'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-[#003399] text-white'
            }`}>
              {car.type === 'rent' ? (lang === 'am' ? 'ኪራይ Rent' : 'Rent') : (lang === 'am' ? 'ሽያጭ Buy' : 'For Sale')}
            </span>

            {/* Condition Badge */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full backdrop-blur-md shadow-sm ${conditionBadge.bg}`}>
              {conditionBadge.label}
            </span>

            {/* Plate Code */}
            {car.plateCode && (
              <span className="text-[10px] font-bold bg-slate-950/80 border border-slate-700/80 text-slate-200 px-2 py-0.5 rounded-full uppercase backdrop-blur-md">
                {car.plateCode.replace('_', ' ').toUpperCase()}
              </span>
            )}

            {/* Public Reference Code (for YouTube/TikTok/etc. posts) */}
            {typeof car.listingCode === 'number' && (
              <span className="text-[10px] font-black bg-white/90 text-slate-900 border border-white px-2 py-0.5 rounded-full font-mono backdrop-blur-md shadow-sm">
                C{car.listingCode}
              </span>
            )}
          </div>

          {/* Top Right Favorite Button */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(car.id);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110' 
                  : 'bg-black/50 text-white hover:bg-black/80'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* DIRECT PHOTO SWITCHING ARROWS ON CARD (Changeable without entering inside) */}
          {car.photos && car.photos.length > 1 && (
            <>
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all shadow-lg active:scale-90 opacity-90 hover:opacity-100"
                title="Previous photo"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all shadow-lg active:scale-90 opacity-90 hover:opacity-100"
                title="Next photo"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Photo Counter Badge (e.g. 2 / 2 like user's screenshot) */}
              <div className="absolute bottom-3 right-3 z-20 bg-black/75 backdrop-blur-md text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow">
                {currentPhotoIndex + 1} / {car.photos.length}
              </div>
            </>
          )}

          {/* Bottom Left Photo Overlay Info */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white z-15">
            <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{car.year}</span>
            </span>
            <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>{car.mileage.toLocaleString()} km</span>
            </span>
            {car.fuelType === 'electric' && (
              <span className="text-[11px] font-bold bg-emerald-500/90 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow">
                <Zap className="w-3 h-3" />
                <span>EV</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Location & Body Type */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-medium text-slate-700 truncate">{car.city} &bull; {car.neighborhood}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {car.bodyType}
            </span>
          </div>

          {/* Car Title */}
          <h3 
            onClick={() => onSelect(car)}
            className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 hover:text-blue-700 cursor-pointer transition-colors"
          >
            {lang === 'am' && car.titleAm ? car.titleAm : car.title}
          </h3>

          {/* Tech Spec Chips (Transmission, Fuel, Color) */}
          <div className="flex flex-wrap items-center gap-2 py-1 text-xs text-slate-600 border-y border-slate-100">
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md font-medium">
              <span className="text-slate-400">⚙️</span>
              <span className="capitalize">{car.transmission}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md font-medium">
              {car.fuelType === 'electric' ? <Zap className="w-3.5 h-3.5 text-emerald-600" /> : <Fuel className="w-3.5 h-3.5 text-blue-600" />}
              <span className="capitalize">{car.fuelType}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md font-medium text-slate-500 truncate max-w-[130px]">
              <span>🎨 {car.color}</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-1">
            <span className="text-[11px] uppercase font-semibold text-slate-400 block">
              {car.type === 'rent' ? (lang === 'am' ? 'የኪራይ ዋጋ' : 'Rental Price') : (lang === 'am' ? 'የሽያጭ ዋጋ' : 'Price')}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-[#003399]">
                {formatPrice(car.price)}
              </span>
              {car.type === 'rent' && (
                <span className="text-xs font-semibold text-slate-500">
                  /{car.rentPeriod === 'day' ? (lang === 'am' ? 'በቀን' : 'day') : (lang === 'am' ? 'በወር' : 'mo')}
                </span>
              )}
            </div>
          </div>

          {/* Seller Name Option in the List (hidden once sold, admin excepted) */}
          {isSoldAndHidden ? (
            <div className="flex items-center gap-1.5 text-xs bg-slate-100 border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{lang === 'am' ? 'የሻጭ መረጃ ከሽያጭ በኋላ ተሰውሯል' : 'Seller info hidden after sale'}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
              <div className="flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">
                  <span className="text-slate-500 font-medium">{lang === 'am' ? 'ሻጭ: ' : 'Seller: '}</span>
                  <span className="font-bold text-slate-900">{car.sellerContact?.name || (lang === 'am' ? 'የመኪናው ባለቤት' : 'Car Owner')}</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                {lang === 'am' ? 'ቀጥተኛ ሻጭ' : 'Direct Seller'}
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect(car)}
          className="flex-1 bg-slate-900 hover:bg-[#003399] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{lang === 'am' ? 'ዝርዝር መረጃ' : 'View Specs'}</span>
        </button>

        {isSoldAndHidden ? (
          <span
            className="bg-slate-200 text-slate-500 text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
            title={lang === 'am' ? 'መኪናው ተሸጧል — ግንኙነት ተሰውሯል' : 'Car sold — contact unavailable'}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'am' ? 'ተሸጧል' : 'Sold'}</span>
          </span>
        ) : (
          <a
            href={`https://wa.me/${waPhone}?text=${sellerText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
            title={car.sellerContact?.name ? `WhatsApp ${car.sellerContact.name}` : 'Contact Seller on WhatsApp'}
          >
            <span>WhatsApp</span>
          </a>
        )}
      </div>

    </div>
  );
};
