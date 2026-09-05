import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  Droplets,
  Plus,
  Lock,
  Phone,
  Mail,
  Send,
  User,
  MessageSquare
} from 'lucide-react';
import { PropertyListing, Language, ListingType, PropertyCategory } from '../types';
import { getTranslation } from '../data/translations';
import { ETHIOPIAN_CITIES } from '../data/mockListings';
import { sanitizeListingText } from '../utils/formatters';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddListing: (newListing: PropertyListing) => void;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddListing,
}) => {
  const t = getTranslation(lang);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<ListingType>('sale');
  const [category, setCategory] = useState<PropertyCategory>('villa');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState(ETHIOPIAN_CITIES[0]);
  const [neighborhood, setNeighborhood] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('3');
  const [area, setArea] = useState('280');
  const [description, setDescription] = useState('');
  const [hasCarta, setHasCarta] = useState(true);
  const [hasGenerator, setHasGenerator] = useState(false);
  const [hasWaterTank, setHasWaterTank] = useState(true);
  const [hasSecurity, setHasSecurity] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerAltPhone, setSellerAltPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerTelegram, setSellerTelegram] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'telegram' | 'any'>('phone');
  const [sellerNotes, setSellerNotes] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  // Compress image helper so local storage doesn't blow up
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round(height * (maxDim / width));
              width = maxDim;
            } else {
              width = Math.round(width * (maxDim / height));
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList: File[] = Array.from(e.target.files);
    const files = fileList.slice(0, 8 - photos.length);
    if (files.length === 0) return;

    setIsCompressing(true);
    const newPhotos: string[] = [];
    for (const f of files) {
      try {
        const base64 = await compressImage(f);
        newPhotos.push(base64);
      } catch (err) {
        console.error('Failed to compress photo', err);
      }
    }
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 8));
    setIsCompressing(false);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError(lang === 'am' ? 'እባክዎ የቤቱን ርዕስ ያስገቡ' : 'Please enter a property title');
      return;
    }
    if (!price || Number(price) <= 0) {
      setFormError(lang === 'am' ? 'እባክዎ ትክክለኛ ዋጋ ያስገቡ' : 'Please enter a valid price in ETB');
      return;
    }
    if (!sellerName.trim()) {
      setFormError(lang === 'am' ? 'እባክዎ የባለቤቱን/የሻጩን ሙሉ ስም ያስገቡ (ለአስተዳዳሪ ብቻ የሚታይ)' : 'Please enter seller / owner name (strictly confidential to admin)');
      return;
    }
    if (!sellerPhone.trim() || sellerPhone.trim().length < 8) {
      setFormError(lang === 'am' ? 'እባክዎ ትክክለኛ የስልክ/ዋትስአፕ ቁጥር ያስገቡ (ለአስተዳዳሪ ብቻ የሚታይ)' : 'Please enter a valid phone / WhatsApp number (strictly confidential to admin)');
      return;
    }

    const cleanTitle = sanitizeListingText(title);
    const cleanDesc = sanitizeListingText(description);

    // Default sample photo if none uploaded
    const finalPhotos = photos.length > 0 
      ? photos 
      : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
        ];

    const newListing: PropertyListing = {
      id: `ch-user-${Date.now()}`,
      title: cleanTitle,
      type,
      category,
      city,
      neighborhood: neighborhood.trim() || 'Prime Residential Area',
      price: Number(price),
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 2,
      area: Number(area) || 200,
      parkingSpaces: 2,
      description: cleanDesc || 'Beautiful property situated in a tranquil neighborhood with verified access to electricity and water services.',
      photos: finalPhotos,
      status: 'active',
      isFeatured: true,
      hasCarta,
      hasGenerator,
      hasWaterTank,
      hasSecurity,
      createdAt: new Date().toISOString(),
      views: 1,
      sellerType: 'owner',
      sellerContact: {
        name: sellerName.trim(),
        phone: sellerPhone.trim(),
        altPhone: sellerAltPhone.trim() || undefined,
        email: sellerEmail.trim() || undefined,
        telegram: sellerTelegram.trim() || undefined,
        preferredContact,
        notes: sellerNotes.trim() ? sellerNotes.trim() : 'Submitted via Charte Homes web portal'
      }
    };

    onAddListing(newListing);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#0A162C] border border-blue-900/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/40 bg-[#071224]">
          <div>
            <h2 
              className="text-xl font-serif font-bold text-white tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {t.list_title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.list_subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Success Banner */}
          {successToast && (
            <div className="bg-emerald-900/50 border border-emerald-500/50 text-emerald-200 text-xs p-4 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Listing published successfully! It is now live on Charte Homes.</span>
            </div>
          )}

          {/* Form Error */}
          {formError && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Purpose & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t.form_listing_type}
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setType('sale')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    type === 'sale' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.for_sale}
                </button>
                <button
                  type="button"
                  onClick={() => setType('rent')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    type === 'rent' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.for_rent}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t.form_category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="villa">{t.cat_villa}</option>
                <option value="compound_g2">{t.cat_compound_g2}</option>
                <option value="apartment">{t.cat_apartment}</option>
                <option value="penthouse">{t.cat_penthouse}</option>
                <option value="townhouse">{t.cat_townhouse}</option>
                <option value="commercial_residential">{t.cat_commercial_residential}</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.form_title}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.form_title_ph}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* City, Neighborhood & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t.form_city}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {ETHIOPIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t.form_neighborhood}
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder={t.form_neighborhood_ph}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {type === 'rent' ? t.form_price_rent : t.form_price}
              </label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 35000000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Specs: Beds, Baths, Area */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t.form_beds}
              </label>
              <input
                type="number"
                min="1"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t.form_baths}
              </label>
              <input
                type="number"
                min="1"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t.form_area}
              </label>
              <input
                type="number"
                min="1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Verified Legal & Utilities Toggles */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Legal Status & Utilities
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasCarta}
                  onChange={(e) => setHasCarta(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
                />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t.form_has_carta}</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasWaterTank}
                  onChange={(e) => setHasWaterTank(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
                />
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>{t.form_has_water}</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasGenerator}
                  onChange={(e) => setHasGenerator(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
                />
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{t.form_has_generator}</span>
                </span>
              </label>
            </div>
          </div>

          {/* Photo Upload with Preview Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.form_photos} ({photos.length}/8)
            </label>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-950/60 rounded-xl p-4 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xs text-slate-300 font-medium">
                {isCompressing ? 'Processing photos...' : t.form_drop_hint}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Up to 8 clear photos of living room, compound, bedrooms, and kitchen.
              </div>
            </div>

            {/* Photo Preview Strip */}
            {photos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden h-16 border border-slate-800">
                    <img src={photo} alt={`preview-${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.form_desc}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.form_desc_ph}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
            <div className="text-[11px] text-blue-300/80 mt-1 flex items-start gap-1">
              <span>ℹ️</span>
              <span>{t.form_scrub_notice}</span>
            </div>
          </div>

          {/* Private Seller Contact (Strictly Admin Verification Only) */}
          <div className="bg-[#060F20] border-2 border-amber-500/40 sm:border-emerald-500/40 p-4 sm:p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{lang === 'am' ? 'የባለቤት/የሻጭ መረጃ (ለአስተዳዳሪ ብቻ የሚታይ)' : 'Seller / Owner Contact (Admin-Only Confidential)'}</span>
                    <span className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Private
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'am'
                      ? 'ይህ መረጃ ድረ-ገጹ ላይ አይለጠፍም። ለቻርቴ ሆምስ አስተዳዳሪ ብቻ ሚስጥራዊ ሆኖ ይቀመጣል።'
                      : 'This contact info will NEVER appear publicly. Only authorized Charte Homes admins can view it.'}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/60 border border-blue-800 text-[11px] text-blue-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected by Charte Privacy</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Seller Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                  {lang === 'am' ? 'የባለቤቱ/የሻጩ ሙሉ ስም' : 'Seller / Owner Full Name'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder={lang === 'am' ? 'ለምሳሌ፡ ዳዊት ከበደ' : 'e.g. Dawit Kebede / Abebech Tadesse'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Primary Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                  {lang === 'am' ? 'ዋና ስልክ ቁጥር (ጥሪ እና WhatsApp)' : 'Primary Phone / WhatsApp'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="e.g. 0911234567 or +251 91 123 4567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Alternative Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {lang === 'am' ? 'ተጨማሪ ስልክ ቁጥር (አማራጭ)' : 'Alternative Phone Number (Optional)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={sellerAltPhone}
                    onChange={(e) => setSellerAltPhone(e.target.value)}
                    placeholder="e.g. 0922334455 or 0715..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Telegram Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {lang === 'am' ? 'የቴሌግራም አድራሻ (አማራጭ)' : 'Telegram Username (Optional)'}
                </label>
                <div className="relative">
                  <Send className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={sellerTelegram}
                    onChange={(e) => setSellerTelegram(e.target.value)}
                    placeholder="e.g. @dawit_home"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {lang === 'am' ? 'ኢሜይል አድራሻ (አማራጭ)' : 'Email Address (Optional)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    placeholder="e.g. owner@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Preferred Contact Mode */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {lang === 'am' ? 'ተመራጭ የመገናኛ መንገድ' : 'Preferred Admin Contact Mode'}
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreferredContact('phone')}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                      preferredContact === 'phone' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredContact('whatsapp')}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                      preferredContact === 'whatsapp' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredContact('telegram')}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                      preferredContact === 'telegram' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Telegram
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredContact('any')}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                      preferredContact === 'any' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Any
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Notes / Visiting Availability */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {lang === 'am' ? 'ለአስተዳዳሪ ማስታወሻ (የካርታ ሁኔታ፣ ቤት የሚጎበኝበት ሰዓት ወዘተ)' : 'Private Notes for Admin (Viewing times, Carta location, keyholder etc.)'}
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={sellerNotes}
                  onChange={(e) => setSellerNotes(e.target.value)}
                  placeholder={lang === 'am' ? 'ለምሳሌ፡ ካርታው ዝግጁ ነው፣ ቅዳሜና እሁድ መጎብኘት ይቻላል' : 'e.g., Carta is available in Bole subcity bureau; available for physical showing after 3 PM'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 text-sm transition-all"
            >
              {t.form_submit}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
