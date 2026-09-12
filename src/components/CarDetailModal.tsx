import React, { useState } from 'react';
import { 
  X, 
  Car, 
  MapPin, 
  Gauge, 
  Fuel, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Heart,
  SlidersHorizontal,
  User,
  Check,
  Lock,
  Tag
} from 'lucide-react';
import { CarListing, Language, Currency, ListingStatus } from '../types';

interface CarDetailModalProps {
  car: CarListing;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  lang: Language;
  currency: Currency;
  onUpdateStatus?: (id: string, status: ListingStatus) => void;
  isAdminLoggedIn?: boolean;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  isFavorite,
  onToggleFavorite,
  lang,
  currency,
  onUpdateStatus,
  isAdminLoggedIn,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [localStatus, setLocalStatus] = useState<ListingStatus>(car.status);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleSellerStatusChange = (newStatus: ListingStatus) => {
    setLocalStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(car.id, newStatus);
    }
    const label = newStatus === 'urgent' 
      ? (lang === 'am' ? 'መኪናው ወደ አጣዳፊ ሽያጭ (Urgent Deal) ተቀይሯል!' : 'Car listing updated to URGENT DEAL!') 
      : newStatus === 'sold'
      ? (lang === 'am' ? 'መኪናው እንደተሸጠ (SOLD) ተመዝግቧል!' : 'Car listing marked as SOLD!')
      : (lang === 'am' ? 'መኪናው ወደ ዝርዝር (Active) ተመልሷል!' : 'Car listing reset to Active Listed!');
    
    setStatusFeedback(label);
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usdRate = 145;
      return `$${Math.round(amount / usdRate).toLocaleString()} USD`;
    }
    return `${amount.toLocaleString()} ETB`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car.title,
        text: `Check out this ${car.year} ${car.make} ${car.model} on Charte Cars: ${formatPrice(car.price)}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inquiryMessage = `Hello Charte Cars, I am interested in this vehicle:\n\n🚗 ${car.year} ${car.make} ${car.model}\n💰 Price: ${car.price.toLocaleString()} ETB\n📍 Location: ${car.city}, ${car.neighborhood}\n🆔 Reference ID: #${car.id}\n\nPlease let me know if it is available for inspection.`;

  const sellerPhone = car.sellerContact?.phone || '0710783877';
  const sellerName = car.sellerContact?.name || (lang === 'am' ? 'የመኪናው ባለቤት' : 'Vehicle Owner');
  const sellerTelegram = car.sellerContact?.telegram;
  const sellerAltPhone = car.sellerContact?.altPhone;
  const sellerPhoneClean = sellerPhone.replace(/[^0-9]/g, '');
  const waPhone = sellerPhoneClean.startsWith('0') 
    ? '251' + sellerPhoneClean.substring(1) 
    : (sellerPhoneClean.startsWith('251') ? sellerPhoneClean : '251' + sellerPhoneClean);
  const sellerWaMsg = encodeURIComponent(
    `Hello ${sellerName}, I am interested in viewing / purchasing your car: ${car.year} ${car.make} ${car.model} (${car.price.toLocaleString()} ETB, Ref: #${car.id}) on Charte Cars.`
  );

  // Once a car is marked SOLD, seller name/phone/WhatsApp/Telegram are hidden
  // from public view — only the Admin Portal keeps full access.
  const isSoldAndHidden = localStatus === 'sold' && !isAdminLoggedIn;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {/* Status Mark: Sold Red, Urgent Yellow, List Green */}
            {localStatus === 'sold' ? (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-red-600 text-white border border-red-500 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{lang === 'am' ? 'የተሸጠ (SOLD)' : 'SOLD'}</span>
              </span>
            ) : localStatus === 'urgent' ? (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-yellow-400 text-slate-950 border border-yellow-300 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                <span>{lang === 'am' ? 'አጣዳፊ (URGENT)' : 'URGENT'}</span>
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-600 text-white border border-emerald-500 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                <span>{lang === 'am' ? 'በዝርዝር ላይ (LISTED)' : 'LISTED'}</span>
              </span>
            )}

            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
              car.type === 'rent' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {car.type === 'rent' ? (lang === 'am' ? 'ኪራይ Rent' : 'For Rent') : (lang === 'am' ? 'ሽያጭ Buy' : 'For Sale')}
            </span>
            {typeof car.listingCode === 'number' && (
              <span className="text-[10px] font-black bg-slate-900 text-white px-2.5 py-1 rounded-full font-mono">
                C{car.listingCode}
              </span>
            )}
            <span className="text-xs text-slate-400 truncate">
              Ref: #{car.id} &bull; {car.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(car.id)}
              className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${
                isFavorite ? 'text-red-500' : 'text-slate-600'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors ml-1"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Photo Showcase Carousel */}
          <div className="space-y-2.5">
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img 
                src={car.photos[activePhotoIdx]} 
                alt={`${car.title} - photo ${activePhotoIdx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Prev / Next buttons */}
              {car.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? car.photos.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev === car.photos.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-mono px-2.5 py-1 rounded-full">
                    {activePhotoIdx + 1} / {car.photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {car.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {car.photos.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === i ? 'border-blue-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span className="text-blue-700 font-bold uppercase tracking-wider">{car.make}</span>
                <span>&bull;</span>
                <span>{car.year}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{car.city}, {car.neighborhood}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">
                {lang === 'am' && car.titleAm ? car.titleAm : car.title}
              </h2>

              {/* Seller Name Display in Detail View (hidden once sold, admin excepted) */}
              {isSoldAndHidden ? (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'am' ? 'የሻጭ መረጃ ከሽያጭ በኋላ ተሰውሯል' : 'Seller info hidden after sale'}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-slate-500 font-medium">{lang === 'am' ? 'የመኪናው ሻጭ:' : 'Seller:'}</span>
                    <strong className="text-slate-900 font-bold">{car.sellerContact?.name || (lang === 'am' ? 'የመኪናው ባለቤት' : 'Car Owner')}</strong>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                    {lang === 'am' ? 'ቀጥተኛ ሻጭ (0% ኮሚሽን)' : 'Direct Owner Listing (0% Commission)'}
                  </span>
                </div>
              )}
            </div>

            {!isSoldAndHidden && (
            <div className="shrink-0 bg-blue-50/80 border border-blue-100 p-3.5 rounded-2xl md:text-right">
              <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
                {car.type === 'rent' ? (lang === 'am' ? 'የኪራይ ዋጋ' : 'Rental Rate') : (lang === 'am' ? 'የመኪናው ዋጋ' : 'Asking Price')}
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#003399]">
                {formatPrice(car.price)}
                {car.type === 'rent' && (
                  <span className="text-xs font-semibold text-slate-600">
                    /{car.rentPeriod === 'day' ? 'day' : 'month'}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {lang === 'am' ? 'በቀጥታ ስም ማዞሪያ ዝግጁ' : 'Verified documentation & direct transfer'}
              </span>
            </div>
            )}
          </div>

          {isSoldAndHidden ? (
            /* Price, specs, features & description are all withheld once a
               car is marked sold — only the SOLD status itself is public. */
            <div className="bg-slate-100 border border-slate-200 p-5 sm:p-6 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">
                {lang === 'am' ? 'የመኪናው ዝርዝር መረጃ ተሰውሯል' : 'Vehicle Details Hidden'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {lang === 'am'
                  ? 'ይህ መኪና ተሸጧል። ዋጋ፣ ቴክኒካዊ መረጃ እና ሌሎች ዝርዝሮች ከህዝብ እይታ ተደብቀዋል፤ አስተዳዳሪ ብቻ ማየት ይችላል።'
                  : 'This car has been sold. Price, technical specifications, and other details are hidden from public view — only Charte Admin can access them.'}
              </p>
            </div>
          ) : (
          <>
          {/* Key Technical Specifications Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>{lang === 'am' ? 'ቴክኒካዊ መረጃዎች (Vehicle Specifications)' : 'Technical Specifications'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የተሰራበት ዓመት' : 'Model Year'}</span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{car.year}</span>
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የተጓዘው ኪሎሜትር' : 'Mileage'}</span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1 font-mono">
                  <Gauge className="w-3.5 h-3.5 text-amber-600" />
                  <span>{car.mileage.toLocaleString()} km</span>
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የማርሽ አይነት' : 'Transmission'}</span>
                <span className="font-bold text-slate-900 text-sm capitalize">
                  ⚙️ {car.transmission}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የነዳጅ አይነት' : 'Fuel Type'}</span>
                <span className="font-bold text-slate-900 text-sm capitalize flex items-center gap-1">
                  {car.fuelType === 'electric' ? <Zap className="w-3.5 h-3.5 text-emerald-600" /> : <Fuel className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{car.fuelType}</span>
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የሰሌዳ አይነት' : 'Plate Code'}</span>
                <span className="font-bold text-slate-900 text-sm uppercase">
                  {car.plateCode ? car.plateCode.replace('_', ' ') : 'N/A'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የመኪናው ሁኔታ' : 'Condition'}</span>
                <span className="font-bold text-slate-900 text-sm capitalize">
                  {car.condition === 'brand_new' ? 'Brand New 0km' : car.condition === 'like_new' ? 'Like New' : car.condition}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'የመኪና አይነት' : 'Body Style'}</span>
                <span className="font-bold text-slate-900 text-sm uppercase">
                  {car.bodyType}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">{lang === 'am' ? 'ቀለም' : 'Color'}</span>
                <span className="font-bold text-slate-900 text-sm truncate">
                  {car.color}
                </span>
              </div>
            </div>

            {car.engineCapacity && (
              <div className="mt-2.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Engine / Battery System:</strong> {car.engineCapacity}</span>
              </div>
            )}
          </div>

          {/* Features & Equipment List */}
          {car.features && car.features.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                {lang === 'am' ? 'ዋና ዋና ገጽታዎች (Features & Options)' : 'Key Features & Equipment'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {car.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              {lang === 'am' ? 'የመኪናው መግለጫ (Overview)' : 'Vehicle Description'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
              {lang === 'am' && car.descriptionAm ? car.descriptionAm : car.description}
            </p>
          </div>
          </>
          )}

          {/* Direct Seller Contact & Buyer Connection Panel (hidden once sold, admin excepted) */}
          {isSoldAndHidden ? (
            <div className="bg-slate-100 border border-slate-200 p-5 sm:p-6 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">
                {lang === 'am' ? 'የሻጭ መገናኛ ተሰውሯል' : 'Seller Contact Hidden'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {lang === 'am'
                  ? 'ይህ መኪና ተሸጧል። የሻጭ ስም፣ ስልክ እና ሌሎች ዝርዝሮች ከህዝብ እይታ ተደብቀዋል፤ አስተዳዳሪ ብቻ ማየት ይችላል።'
                  : 'This car has been sold. The seller\u2019s name, phone, and other contact details are hidden from public view — only Charte Admin can access them.'}
              </p>
            </div>
          ) : (
          <div className="bg-gradient-to-br from-[#051329] to-[#0A224A] text-white p-5 sm:p-6 rounded-2xl border border-blue-800/60 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{lang === 'am' ? 'የሻጩ ቀጥተኛ መገናኛ' : 'Direct Seller Contact'}</span>
                    <span className="text-emerald-400 font-mono font-normal">({sellerName})</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    {lang === 'am' 
                      ? 'ከባለቤቱ ጋር በቀጥታ ይደራደሩ፤ ምንም አይነት የደላላ ኮሚሽን የለም።' 
                      : 'Deal directly with the verified seller — 0% middleman and zero broker markups.'}
                  </p>
                </div>
              </div>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                {lang === 'am' ? '0% ኮሚሽን (ቀጥተኛ)' : '0% Commission Direct'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Phone Call Seller */}
              <a
                href={`tel:${sellerPhone}`}
                className="bg-[#003399] hover:bg-blue-600 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all font-mono"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{lang === 'am' ? 'ለሻጩ ይደውሉ' : 'Call Seller'}: {sellerPhone}</span>
              </a>

              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${waPhone}?text=${sellerWaMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Telegram */}
              {sellerTelegram ? (
                <a
                  href={`https://t.me/${sellerTelegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram: {sellerTelegram}</span>
                </a>
              ) : (
                <a
                  href="https://t.me/charte7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram: @charte7</span>
                </a>
              )}
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-1 border-t border-blue-950/80">
              {sellerAltPhone && (
                <span className="block sm:inline mr-2">
                  {lang === 'am' ? 'ተጨማሪ ስልክ:' : 'Alt Phone:'} <strong className="text-slate-300 font-mono">{sellerAltPhone}</strong> &bull;{' '}
                </span>
              )}
              <span>
                {lang === 'am'
                  ? 'የሻጭ ስም በምዝገባ የተረጋገጠ ሲሆን በአስተዳዳሪ ብቻ ነው የሚቀየረው። የቻርቴ እገዛ ዴስክ፡ 0710783877'
                  : 'Seller name is verified and cannot be edited by seller (Admin only). Charte Assistance: 0710783877'}
              </span>
            </div>
          </div>
          )}

          {/* Seller Listing Status Controls (Policy: After listing only admin can edit car list, seller can edit only urgent and sold place on their own car list) */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-xl space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white">
                      {lang === 'am' ? 'የመኪናው ሁኔታ ማስተካከያ (Owner Status Controls)' : 'Seller Listing Status Controls'}
                    </h4>
                    <span className="text-[10px] bg-slate-800 border border-slate-700 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      Seller Self-Service
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                    {lang === 'am'
                      ? '🔒 መመሪያ፡ ከተዘረዘረ በኋላ የመኪናውን ሙሉ መረጃና ዋጋ ማስተካከል የሚችለው አስተዳዳሪ (Admin) ብቻ ነው። ሻጩ በራሱ ዝርዝር ላይ ሁኔታውን ወደ "አጣዳፊ (Urgent)" ወይም "ተሽጧል (Sold)" ብቻ መቀየር ይችላል።'
                      : '🔒 Policy: After listing, only Admin can edit car specifications or price. Sellers can ONLY toggle listing status to "Urgent Deal" or "Sold" on their own car list.'}
                  </p>
                </div>
              </div>

              {/* Current Status Indicator */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current:</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  localStatus === 'sold'
                    ? 'bg-red-600 text-white'
                    : localStatus === 'urgent'
                    ? 'bg-yellow-400 text-slate-950'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {localStatus === 'sold' ? 'Sold' : localStatus === 'urgent' ? 'Urgent' : 'Listed'}
                </span>
              </div>
            </div>

            {/* Quick Status Control Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Mark as Urgent */}
              <button
                type="button"
                onClick={() => handleSellerStatusChange('urgent')}
                className={`py-3 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  localStatus === 'urgent'
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-lg ring-2 ring-yellow-400/40'
                    : 'bg-slate-800/90 hover:bg-slate-800 text-yellow-300 border-yellow-400/30'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-slate-950" />
                <span>{lang === 'am' ? 'አጣዳፊ ሽያጭ (Mark Urgent)' : 'Mark as Urgent Deal'}</span>
              </button>

              {/* Mark as Sold */}
              <button
                type="button"
                onClick={() => handleSellerStatusChange('sold')}
                className={`py-3 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  localStatus === 'sold'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg ring-2 ring-red-500/40'
                    : 'bg-slate-800/90 hover:bg-slate-800 text-red-300 border-red-500/30'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white" />
                <span>{lang === 'am' ? 'ተሽጧል (Mark as Sold)' : 'Mark as Sold'}</span>
              </button>

              {/* Set back to Listed/Active */}
              <button
                type="button"
                onClick={() => handleSellerStatusChange('active')}
                className={`py-3 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  localStatus === 'active'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg ring-2 ring-emerald-500/40'
                    : 'bg-slate-800/90 hover:bg-slate-800 text-emerald-300 border-emerald-500/30'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                <span>{lang === 'am' ? 'በሽያጭ ላይ (Set Listed)' : 'Set as Listed (Active)'}</span>
              </button>
            </div>

            {/* Status Change Notification Feedback */}
            {statusFeedback && (
              <div className="bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-fade-in shadow-inner">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{statusFeedback}</span>
              </div>
            )}

            {/* Note regarding Admin edits */}
            <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between flex-wrap gap-1">
              <span>
                {lang === 'am'
                  ? 'ዋጋ ወይም የመኪናውን ቴክኒካል መረጃ ለመቀየር የአስተዳዳሪ ማረጋገጫ ያስፈልጋል'
                  : 'To change price, photos or technical specs, only Charte Admin can make edits'}
              </span>
              <a href="tel:0710783877" className="text-amber-400 font-bold hover:underline font-mono">
                Admin Hotline: 0710783877
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
