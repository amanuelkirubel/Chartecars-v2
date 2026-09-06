import React, { useState } from 'react';
import { 
  X, 
  Car, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Trash2,
  CreditCard 
} from 'lucide-react';
import { CarListing, Language, ListingType } from '../types';
import { POPULAR_CAR_MAKES, CAR_BODY_TYPES, ETHIOPIAN_PLATE_CODES } from '../data/mockCars';
import { ETHIOPIAN_CITIES } from '../data/mockListings';

interface ListCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (newCar: Omit<CarListing, 'id' | 'createdAt' | 'views'>) => void;
  onAddCar?: (newCar: Omit<CarListing, 'id' | 'createdAt' | 'views'>) => void;
  lang: Language;
}

export const ListCarModal: React.FC<ListCarModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onAddCar,
  lang,
}) => {
  if (!isOpen) return null;

  // Form State
  const [type, setType] = useState<ListingType>('sale');
  const [make, setMake] = useState('Toyota');
  const [customMake, setCustomMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2023);
  const [bodyType, setBodyType] = useState('suv');
  const [condition, setCondition] = useState<'brand_new' | 'like_new' | 'used' | 'duty_free'>('like_new');
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>('automatic');
  const [fuelType, setFuelType] = useState<'petrol' | 'electric' | 'hybrid' | 'diesel'>('petrol');
  const [plateCode, setPlateCode] = useState<'code_2' | 'code_3' | 'code_1' | 'duty_free' | 'unregistered'>('code_2');
  const [color, setColor] = useState('White');
  const [mileage, setMileage] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [neighborhood, setNeighborhood] = useState('Bole');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Push Button Start',
    'Touchscreen Display',
    'Reverse Camera',
    'Air Conditioning'
  ]);

  // Private Seller Contact Info (Strictly confidential for admin)
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerAltPhone, setSellerAltPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerTelegram, setSellerTelegram] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'telegram' | 'any'>('phone');
  const [sellerNotes, setSellerNotes] = useState('');

  // Featured Gold Promotion & Payment
  const [isFeaturedPromotion, setIsFeaturedPromotion] = useState(false);
  const [featuredPaymentMethod, setFeaturedPaymentMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [featuredTxnRef, setFeaturedTxnRef] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const AVAILABLE_FEATURES = [
    'Panoramic Sunroof',
    'Leather Seats',
    '360° Surround Camera',
    'Apple CarPlay / Android Auto',
    'Push Button Start',
    'Blind Spot Monitor',
    'Cruise Control',
    'Wireless Phone Charger',
    'Electric Tailgate',
    'Heated Seats',
    'Reverse Camera',
    'Air Conditioning'
  ];

  const handleToggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: string[] = [];
    const maxAllowed = 15 - photos.length;
    const toProcess: File[] = Array.from(files).slice(0, maxAllowed) as File[];

    toProcess.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string].slice(0, 15));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actualMake = make === 'Other' ? customMake.trim() : make;
    if (!actualMake || !model.trim()) {
      setErrorMsg(lang === 'am' ? 'እባክዎ የመኪናውን ብራንድና ሞዴል ያስገቡ።' : 'Please specify vehicle make and model.');
      return;
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg(lang === 'am' ? 'እባክዎ ትክክለኛ ዋጋ ያስገቡ።' : 'Please enter a valid price in ETB.');
      return;
    }

    if (!sellerName.trim() || !sellerPhone.trim()) {
      setErrorMsg(lang === 'am' 
        ? 'እባክዎ የባለቤቱን ስምና ስልክ ቁጥር ያስገቡ (ይህ መረጃ ለአስተዳዳሪ ብቻ ሚስጥራዊ ሆኖ ይቀመጣል)።' 
        : 'Owner name and phone are required for admin verification (will NEVER be published publicly).');
      return;
    }

    const defaultPhotos = photos.length > 0 ? photos : [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ];

    const finalTitle = `${year} ${actualMake} ${model} (${condition === 'brand_new' ? 'Brand New' : 'Used'})`;

    const submitHandler = onSubmit || onAddCar;
    if (submitHandler) {
      submitHandler({
        title: finalTitle,
        make: actualMake,
        model: model.trim(),
        year: Number(year),
        type,
        condition,
        transmission,
        fuelType,
        plateCode,
        bodyType: bodyType as any,
        color: color.trim() || 'White',
        mileage: Number(mileage) || 0,
        engineCapacity: engineCapacity.trim(),
        city,
        neighborhood: neighborhood.trim() || 'Addis Ababa',
        price: parsedPrice,
        photos: defaultPhotos,
        features: selectedFeatures,
        description: description.trim() || `${year} ${actualMake} ${model} available for ${type === 'rent' ? 'rent' : 'sale'} in ${city}. Verified condition.`,
        status: 'active',
        isFeatured: isFeaturedPromotion,
        sellerType: 'owner',
        sellerContact: {
          name: sellerName.trim(),
          phone: sellerPhone.trim(),
          altPhone: sellerAltPhone.trim() || undefined,
          email: sellerEmail.trim() || undefined,
          telegram: sellerTelegram.trim() || undefined,
          preferredContact,
          notes: sellerNotes.trim() || undefined,
        }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#003399] text-white flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {lang === 'am' ? 'መኪናዎን በቻርቴ ይዘርዝሩ' : 'List Your Vehicle on Charte Cars'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'am' ? 'መኪናዎን ለሽያጭ ወይም ለኪራይ ያቅርቡ' : 'Direct listing for car sale or rental across Ethiopia'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="max-h-[82vh] overflow-y-auto p-5 sm:p-7 space-y-6 text-xs">
          
          {/* FOR SELLERS — 600 ETB, ONE TIME INFO BANNER */}
          <div className="bg-[#051A46] border border-blue-500/40 rounded-2xl p-4 sm:p-5 text-slate-100 shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-sky-300 flex items-center gap-2">
                  <span>{lang === 'am' ? 'ለሻጮች — ' : 'FOR SELLERS — '}</span>
                  <span className="text-amber-400 font-extrabold">
                    {lang === 'am' ? '600 ብር፣ የአንድ ጊዜ' : '600 ETB, ONE TIME'}
                  </span>
                </h3>
                <p className="text-slate-200 text-[11px] sm:text-xs leading-relaxed">
                  {lang === 'am'
                    ? 'ይመዝገቡ፣ የአንድ ጊዜ 600 ብር ክፍያ ብቻ ይክፈሉ፣ መኪናዎን እስከ 15 ፎቶዎች እና ሙሉ መግለጫ ጋር ይዘርዝሩ። ዋጋዎን ወይም ፎቶዎችዎን በማንኛውም ጊዜ ያሻሽሉ፤ ሲፈልጉ መኪናዎን የተሸጠ ወይም አስቸኳይ ብለው ምልክት ያድርጉ።'
                    : 'Register, pay a single 600 ETB fee, and list your car with up to 15 photos and a full description. Edit your price or photos anytime, and mark your car as Sold or Urgent whenever you need.'}
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Listing Mode (Sale vs Rent) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              1. {lang === 'am' ? 'የዝርዝሩ አይነት' : 'Listing Purpose'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('sale')}
                className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                  type === 'sale'
                    ? 'bg-[#003399] text-white border-[#003399] shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🚗 {lang === 'am' ? 'ለመሸጥ (For Sale)' : 'Sell My Car'}</span>
              </button>

              <button
                type="button"
                onClick={() => setType('rent')}
                className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                  type === 'rent'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🔑 {lang === 'am' ? 'ለኪራይ (For Rent)' : 'Rent Out My Car'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Vehicle Specs */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              2. {lang === 'am' ? 'የመኪናው ዝርዝር መረጃዎች' : 'Vehicle Specifications'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Make */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Make / Brand *</label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {POPULAR_CAR_MAKES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  <option value="Other">Other Make...</option>
                </select>
                {make === 'Other' && (
                  <input
                    type="text"
                    value={customMake}
                    onChange={(e) => setCustomMake(e.target.value)}
                    placeholder="Enter custom make name"
                    className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>

              {/* Model */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Model *</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. RAV4, Dzire, Tucson, Atto 3"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Year */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Model Year *</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium font-mono"
                >
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010, 2008].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Body Type */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Body Type</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {CAR_BODY_TYPES.map((b) => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="petrol">Petrol (Benzine)</option>
                  <option value="electric">Electric (EV)</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="brand_new">Brand New 0km</option>
                  <option value="like_new">Like New</option>
                  <option value="used">Used</option>
                  <option value="duty_free">Duty Free</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Plate Code */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Plate Code</label>
                <select
                  value={plateCode}
                  onChange={(e) => setPlateCode(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {ETHIOPIAN_PLATE_CODES.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Mileage */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mileage (km)</label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Exterior Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. White, Black, Silver"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Engine */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Engine / Battery</label>
                <input
                  type="text"
                  value={engineCapacity}
                  onChange={(e) => setEngineCapacity(e.target.value)}
                  placeholder="e.g. 1.5L Turbo / 60 kWh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Price & Location */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              3. {lang === 'am' ? 'ዋጋና መገኛ አካባቢ' : 'Price & Location'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  {type === 'rent' ? 'Rental Price (ETB / month or day) *' : 'Asking Price (ETB) *'}
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 4500000"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {ETHIOPIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Neighborhood / Area *</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Bole, CMC, Sarbet, Hawassa Piazza"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Features */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              4. {lang === 'am' ? 'የመኪናው ገጽታዎችና አማራጮች' : 'Vehicle Options & Features'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_FEATURES.map((feat) => {
                const isChecked = selectedFeatures.includes(feat);
                return (
                  <button
                    type="button"
                    key={feat}
                    onClick={() => handleToggleFeature(feat)}
                    className={`p-2 rounded-lg text-left border transition-all flex items-center justify-between text-[11px] ${
                      isChecked
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{feat}</span>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Photos */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              5. {lang === 'am' ? 'የመኪናው ፎቶዎች (እስከ 15)' : 'Vehicle Photos (Up to 15)'}
            </label>
            
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center hover:border-blue-500 transition-colors bg-slate-50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                id="carPhotoUpload"
                className="hidden"
              />
              <label htmlFor="carPhotoUpload" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-blue-700 hover:underline">Click to upload photos</span>
                  <span className="text-slate-500"> or drag and drop</span>
                </div>
                <p className="text-[11px] text-slate-400">Exterior, interior, dashboard, and engine bay</p>
              </label>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                {photos.map((photo, i) => (
                  <div key={i} className="relative group h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              6. {lang === 'am' ? 'ተጨማሪ ማብራሪያ' : 'Additional Description'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, accident history, service records, and warranty details..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* SECTION 7: STRICTLY CONFIDENTIAL OWNER / SELLER CONTACT (Admin-Only Privacy) */}
          <div className="bg-[#051329] border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-5 text-white space-y-3.5 shadow-lg">
            
            <div className="flex items-start justify-between gap-3 border-b border-blue-900/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>{lang === 'am' ? 'የባለቤቱ ሚስጥራዊ መረጃ (ለአስተዳዳሪ ብቻ)' : 'Owner / Seller Confidential Verification (Admin Only)'}</span>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[9px] px-2 py-0.5 rounded-full uppercase font-mono">Private</span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'am'
                      ? 'ይህ መረጃ ድህረ ገጹ ላይ በጭራሽ አይለጠፍም። ገዢዎች በቀጥታ ቻርቴን ያገኛሉ፣ እኛም ከእርስዎ ጋር እናስተባብራለን።'
                      : 'Your personal phone & name will NEVER be shown publicly. Inquiries route to Charte Cars official team.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Seller Full Name */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Owner / Representative Full Name *
                </label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Dawit Tadesse"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Primary Phone / WhatsApp */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Primary Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="e.g. 0911223344 or 0715..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              {/* Alternative Phone */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Alternative Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={sellerAltPhone}
                  onChange={(e) => setSellerAltPhone(e.target.value)}
                  placeholder="e.g. 0922334455"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              {/* Telegram */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Telegram Username (Optional)
                </label>
                <input
                  type="text"
                  value={sellerTelegram}
                  onChange={(e) => setSellerTelegram(e.target.value)}
                  placeholder="e.g. @dawit_cars"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="e.g. seller@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Preferred Contact Mode */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Preferred Contact Mode
                </label>
                <select
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="phone">Direct Phone Call</option>
                  <option value="whatsapp">WhatsApp Message</option>
                  <option value="telegram">Telegram Chat</option>
                  <option value="any">Any Mode</option>
                </select>
              </div>
            </div>

            {/* Viewing Notes */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Admin & Inspection Availability Notes
              </label>
              <input
                type="text"
                value={sellerNotes}
                onChange={(e) => setSellerNotes(e.target.value)}
                placeholder="e.g. Car parked in Bole showroom, available for inspection weekends"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

          </div>

          {/* SECTION 8: OPTIONAL GOLD FEATURED PROMOTION & TELEBIRR / CBE CHECKOUT */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>{lang === 'am' ? 'የጎልድ ማስታወቂያ ማሳደጊያ (Gold Featured Upgrade)' : 'Gold Featured Listing Upgrade (600 ETB)'}</span>
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">5x Views</span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'am'
                      ? 'መኪናዎ በመነሻ ገጽ አናት ላይ በወርቃማ ባጅ ጎልቶ ይታያል። በቴሌብር ወይም በንግድ ባንክ 600 ብር ይክፈሉ።'
                      : 'Pin your vehicle at the top of the marketplace with a Gold Verified badge for maximum buyer calls.'}
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                id="featuredToggle"
                checked={isFeaturedPromotion}
                onChange={(e) => setIsFeaturedPromotion(e.target.checked)}
                className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 border-slate-700 bg-slate-950 mt-1 cursor-pointer"
              />
            </div>

            {isFeaturedPromotion && (
              <div className="pt-2 border-t border-amber-500/20 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-300">Pay via:</span>
                  <button
                    type="button"
                    onClick={() => setFeaturedPaymentMethod('telebirr')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      featuredPaymentMethod === 'telebirr'
                        ? 'bg-[#0072CE] text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Telebirr (0715737393)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedPaymentMethod('cbe')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      featuredPaymentMethod === 'cbe'
                        ? 'bg-[#8B1874] text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    CBE (1000582914029)
                  </button>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Enter 600 ETB Transfer Reference ID (Optional proof)
                  </label>
                  <input
                    type="text"
                    value={featuredTxnRef}
                    onChange={(e) => setFeaturedTxnRef(e.target.value)}
                    placeholder="e.g. FT2608... or Telebirr Txn"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#003399] hover:bg-blue-800 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>{lang === 'am' ? 'መኪናውን አትም (Publish Vehicle)' : 'Publish Vehicle Listing'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
