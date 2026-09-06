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
  CreditCard,
  User,
  Copy,
  Check,
  FileText
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
  isAdminLoggedIn?: boolean;
  existingCars?: CarListing[];
}

export const ListCarModal: React.FC<ListCarModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onAddCar,
  lang,
  isAdminLoggedIn = false,
  existingCars = [],
}) => {
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

  // Private Seller Contact Info
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerAltPhone, setSellerAltPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerTelegram, setSellerTelegram] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'telegram' | 'any'>('phone');
  const [sellerNotes, setSellerNotes] = useState('');

  // Mandatory Payment Verification State (Enforced: No one can list without pay; only admin can list without pay)
  const [listingPaymentMethod, setListingPaymentMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [listingTxnRef, setListingTxnRef] = useState('');
  const [receiptScreenshot, setReceiptScreenshot] = useState<string | null>(null);
  const [receiptFileType, setReceiptFileType] = useState<'pdf' | 'image'>('image');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Optional Featured Promotion Upgrade
  const [isFeaturedPromotion, setIsFeaturedPromotion] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  // Keep hook calls unconditionally above return guard
  if (!isOpen) return null;

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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setReceiptFileType(isPdf ? 'pdf' : 'image');
    setReceiptFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReceiptScreenshot(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

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

    if (!sellerName.trim()) {
      setErrorMsg(lang === 'am' 
        ? 'የሻጭ ስም ማስገባት ግዴታ ነው። ባዶ ከሆነ መኪናዎን መዘርዘር አይችሉም።' 
        : 'Seller Name is required. If left blank, you cannot post your car to the marketplace.');
      return;
    }

    if (!sellerPhone.trim()) {
      setErrorMsg(lang === 'am' 
        ? 'የሻጭ ስልክ ቁጥር ማስገባት ግዴታ ነው (ገዢዎች በቀጥታ እንዲያገኙዎት)።' 
        : 'Primary Phone Number is required so buyers can contact you directly.');
      return;
    }

    // STRICT PAYMENT ENFORCEMENT & ANTI-REUSE SAFEGUARD:
    // "no one can list their car to sell without pay, only admin can list without pay"
    if (!isAdminLoggedIn) {
      const cleanRef = listingTxnRef.trim();
      if (!cleanRef || cleanRef.length < 5) {
        setErrorMsg(lang === 'am'
          ? 'ክፍያ ሳይፈጽሙ መኪናዎን መዘርዘር አይችሉም! እባክዎ የ600 ብር መዘርዘሪያ ክፍያ በቴሌብር (0715737393) ወይም በንግድ ባንክ (1000582914029) ከፍለው የደረሰኝ ቁጥር (Transaction Reference) ያስገቡ። አስተዳዳሪ (Admin) ብቻ ነው ያለ ክፍያ መዘርዘር የሚችለው።'
          : 'Payment is strictly required! No one can list their car to sell without paying the 600 ETB listing fee. Please pay via Telebirr or CBE and enter your valid transaction reference code. Only verified administrators can list without pay.');
        return;
      }

      // CRITICAL CHECK: WHAT IF HE USED TWO TIMES IN ONE TRANSACTION?
      // 1. Check local registry of previously used transaction references
      const usedRefs: string[] = JSON.parse(localStorage.getItem('charte_used_txn_refs') || '[]');
      const isAlreadyInRegistry = usedRefs.some((r) => r.toLowerCase() === cleanRef.toLowerCase());

      // 2. Check all cars already in database/state
      const isAlreadyInCars = existingCars.some((c) => {
        const directRef = c.paymentDetails?.transactionRef?.trim().toLowerCase();
        const inNotes = c.sellerContact?.notes?.toLowerCase();
        return (directRef && directRef === cleanRef.toLowerCase()) || 
               (inNotes && inNotes.includes(cleanRef.toLowerCase()));
      });

      if (isAlreadyInRegistry || isAlreadyInCars) {
        setErrorMsg(lang === 'am'
          ? `ይህ የክፍያ ደረሰኝ ቁጥር (${cleanRef}) ከዚህ ቀደም ለሌላ መኪና ጥቅም ላይ ውሏል! አንድ የክፍያ ቁጥር ለሁለት መኪኖች መጠቀም በጥብቅ የተከለከለ ነው። እባክዎ ለዚህ መኪና አዲስ የ600 ብር ክፍያ ይፈጽሙ።`
          : `⚠️ Duplicate Transaction Reference (${cleanRef})! This payment reference has already been used for another vehicle listing. A transaction reference cannot be reused twice. Each listing requires its own distinct 600 ETB payment.`);
        return;
      }
    }

    const defaultPhotos = photos.length > 0 ? photos : [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ];

    const finalTitle = `${year} ${actualMake} ${model} (${condition === 'brand_new' ? 'Brand New' : 'Used'})`;

    // Save used transaction reference to prevent reuse
    if (!isAdminLoggedIn) {
      const usedRefs: string[] = JSON.parse(localStorage.getItem('charte_used_txn_refs') || '[]');
      usedRefs.push(listingTxnRef.trim().toLowerCase());
      localStorage.setItem('charte_used_txn_refs', JSON.stringify(usedRefs));
    }

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
        // Status: Admin listings go live immediately ('active'). Non-admin listings go to 'pending' verification!
        status: isAdminLoggedIn ? 'active' : 'pending',
        isFeatured: isFeaturedPromotion,
        sellerType: 'owner',
        sellerContact: {
          name: sellerName.trim(),
          phone: sellerPhone.trim(),
          altPhone: sellerAltPhone.trim() || undefined,
          email: sellerEmail.trim() || undefined,
          telegram: sellerTelegram.trim() || undefined,
          preferredContact,
          notes: !isAdminLoggedIn 
            ? `[PAID 600 ETB] Ref: ${listingTxnRef.trim()} via ${listingPaymentMethod.toUpperCase()}${receiptScreenshot ? (receiptFileType === 'pdf' ? ` (PDF Attached: ${receiptFileName})` : ' (Screenshot/Photo Attached)') : ''} | ${sellerNotes}` 
            : `[ADMIN FREE LISTING] | ${sellerNotes}`,
        },
        paymentDetails: !isAdminLoggedIn ? {
          method: listingPaymentMethod,
          transactionRef: listingTxnRef.trim(),
          amount: 600,
          paidAt: new Date().toISOString(),
          receiptScreenshot: receiptScreenshot || undefined,
          receiptFileType: receiptScreenshot ? receiptFileType : undefined,
          receiptFileName: receiptScreenshot ? receiptFileName : undefined,
          verifiedByAdmin: false,
        } : {
          method: 'admin_waived',
          amount: 0,
          paidAt: new Date().toISOString(),
          verifiedByAdmin: true,
        },
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
                {isAdminLoggedIn
                  ? (lang === 'am' ? 'አስተዳዳሪ (Admin) ነዎት - ያለ ክፍያ በቀጥታ መዘርዘር ይችላሉ' : 'Admin Mode: Instant Verified Free Listing')
                  : (lang === 'am' ? 'ያለ ክፍያ ማንም መኪና መዘርዘር አይችልም (አስተዳዳሪ ብቻ ነፃ መዘርዘር ይችላል)' : 'Listing requires 600 ETB verification fee • Only admin can list without pay')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Validation Error Alert */}
          {errorMsg && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 rounded-2xl flex items-start gap-3 shadow-md animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <div className="text-xs font-semibold leading-relaxed">
                {errorMsg}
              </div>
            </div>
          )}

          {/* ADMIN STATUS BANNER */}
          {isAdminLoggedIn ? (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                    {lang === 'am' ? 'የአስተዳዳሪ ፈቃድ (Admin Privileges Active)' : 'Administrator Access Active'}
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Free Listing
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {lang === 'am'
                    ? 'እንደ አስተዳዳሪ ስለገቡ ያለ ምንም ክፍያ መኪና በቀጥታ ማተም ይችላሉ።'
                    : 'You are authenticated as Admin. You have authorized clearance to publish car listings directly without payment.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>{lang === 'am' ? 'አስፈላጊ ማሳሰቢያ፡ ' : 'Marketplace Listing Rule: '}</strong>
                {lang === 'am'
                  ? 'ያለ ክፍያ ማንም ሰው መኪና መዘርዘር ወይም መሸጥ አይችልም። አስተዳዳሪ (Admin) ብቻ ነው ያለ ክፍያ መዘርዘር የሚችለው። መኪናዎን ለማተም የ600 ብር ማረጋገጫ ክፍያ ከዚህ በታች በቴሌብር ወይም በንግድ ባንክ መፈጸም ግዴታ ነው።'
                  : 'Without payment, no one can list their car to sell. Only verified platform administrators can list without pay. A 600 ETB listing verification fee is mandatory before publication.'}
              </div>
            </div>
          )}

          {/* SECTION 1: LISTING TYPE & CONDITION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {lang === 'am' ? 'የዝርዝር አይነት (Listing Type)' : 'Listing Intent'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('sale')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    type === 'sale'
                      ? 'bg-[#003399] border-[#003399] text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{lang === 'am' ? 'ለሽያጭ (For Sale)' : 'For Sale'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('rent')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    type === 'rent'
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-black shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{lang === 'am' ? 'ለኪራይ (For Rent)' : 'For Rent'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {lang === 'am' ? 'የመኪናው ሁኔታ (Condition)' : 'Vehicle Condition'}
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="brand_new">{lang === 'am' ? 'አዲስ 0 ኪሎሜትር (Brand New 0km)' : 'Brand New (0 km)'}</option>
                <option value="like_new">{lang === 'am' ? 'በጣም ንጹህ (Like New)' : 'Like New (Mint Condition)'}</option>
                <option value="used">{lang === 'am' ? 'ያገለገለ (Used)' : 'Used / Pre-Owned'}</option>
                <option value="duty_free">{lang === 'am' ? 'ቀረጥ ነጻ (Duty Free)' : 'Duty Free Eligible'}</option>
              </select>
            </div>
          </div>

          {/* SECTION 2: MAKE, MODEL & YEAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Make / Brand
              </label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
              >
                {POPULAR_CAR_MAKES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {make === 'Other' && (
                <input
                  type="text"
                  value={customMake}
                  onChange={(e) => setCustomMake(e.target.value)}
                  placeholder="Type Brand (e.g. Geely)"
                  className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Model Name
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Land Cruiser V8, Byd Song Plus"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Manufacture Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={1980}
                max={2026}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          {/* SECTION 3: SPECS (Transmission, Fuel, Plate, Body, Color) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              >
                <option value="petrol">Petrol / Benzine</option>
                <option value="electric">100% Electric (EV)</option>
                <option value="hybrid">Hybrid</option>
                <option value="diesel">Diesel</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Body Type</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 capitalize"
              >
                {CAR_BODY_TYPES.map((bt) => (
                  <option key={bt.id} value={bt.id} className="capitalize">{bt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Plate Code</label>
              <select
                value={plateCode}
                onChange={(e) => setPlateCode(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              >
                {ETHIOPIAN_PLATE_CODES.map((pc) => (
                  <option key={pc.id} value={pc.id}>{pc.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 4: MILEAGE, PRICE & LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mileage (Kilometers)
              </label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {type === 'rent' ? 'Rental Price (ETB / Day)' : 'Price (ETB)'}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 3800000"
                required
                className="w-full bg-slate-50 border-2 border-blue-600/60 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                City / Location
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              >
                {ETHIOPIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Neighborhood & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Neighborhood / Sub-city
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Bole Medhanialem, Kazanchis, Piassa"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Exterior Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Pearl White, Silver, Black"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* SECTION 5: PHOTOS (MULTIPLE PHOTO UPLOADER) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Vehicle Photos (Up to 15 Photos)
            </label>
            
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-5 text-center transition bg-slate-50">
              <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Click to upload car images from your phone or device
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Include front, rear, sides, and interior dashboard photos.
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="mt-3 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={p} alt="uploaded" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 6: CONFIDENTIAL SELLER CONTACT (DIRECT CONNECTION) */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  {lang === 'am' ? 'የሻጭ/ባለቤት ትክክለኛ መረጃ (Seller Contact)' : 'Seller Direct Contact & Identity'}
                </h3>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                Direct Buyer Connection
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Full Name (ሻጭ ስም) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Dawit Kebede"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Primary Phone / WhatsApp (ስልክ ቁጥር) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="e.g. 0911223344 or 0715..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Alternative Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={sellerAltPhone}
                  onChange={(e) => setSellerAltPhone(e.target.value)}
                  placeholder="e.g. 0922334455"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Telegram Username (Optional)
                </label>
                <input
                  type="text"
                  value={sellerTelegram}
                  onChange={(e) => setSellerTelegram(e.target.value)}
                  placeholder="e.g. @dawit_cars"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION 7: MANDATORY PAYMENT VERIFICATION FOR NON-ADMINS */}
          {!isAdminLoggedIn ? (
            <div className="bg-[#07132B] border-2 border-amber-400 rounded-2xl p-4 sm:p-5 space-y-4 text-white shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                      <span>{lang === 'am' ? 'የመኪና መዘርዘሪያ ክፍያ (600 ብር) - ግዴታ' : 'Mandatory Listing Verification: 600 ETB'}</span>
                      <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        Required
                      </span>
                    </h4>
                    <p className="text-[11px] text-amber-200/90 mt-0.5">
                      {lang === 'am'
                        ? 'ያለ ክፍያ ማንም ሰው መኪና መዘርዘር አይችልም (አስተዳዳሪ ብቻ ነው ያለ ክፍያ መዘርዘር የሚችለው)።'
                        : 'Without payment, no one can list their car to sell. Only admin can list without pay.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Accounts Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Telebirr Card */}
                <div 
                  onClick={() => setListingPaymentMethod('telebirr')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    listingPaymentMethod === 'telebirr'
                      ? 'bg-[#0072CE]/20 border-[#0072CE] ring-2 ring-[#0072CE]/40'
                      : 'bg-slate-900 border-slate-700 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-sky-400">1. Telebirr Official</span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold">600 ETB</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-white flex items-center justify-between">
                    <span>0715737393</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('0715737393', 'telebirr');
                      }}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center gap-1 transition"
                    >
                      {copiedAccount === 'telebirr' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAccount === 'telebirr' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Account: Charte Cars / Amanuel K.</span>
                </div>

                {/* CBE Card */}
                <div 
                  onClick={() => setListingPaymentMethod('cbe')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    listingPaymentMethod === 'cbe'
                      ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/40'
                      : 'bg-slate-900 border-slate-700 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-purple-300">2. CBE (ንግድ ባንክ)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">600 ETB</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-white flex items-center justify-between">
                    <span>1000582914029</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('1000582914029', 'cbe');
                      }}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center gap-1 transition"
                    >
                      {copiedAccount === 'cbe' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAccount === 'cbe' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Account: Charte Cars & Marketplace</span>
                </div>
              </div>

              {/* Transaction Reference Input (MANDATORY) */}
              <div className="pt-2 border-t border-slate-700/80">
                <label className="text-xs font-bold text-white block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? 'የክፍያ ደረሰኝ ቁጥር (Transaction Reference ID) - ግዴታ' : 'Enter Payment Receipt / Transaction Reference (REQUIRED)'}</span>
                  </span>
                  <span className="text-[10px] text-red-400 font-bold">* Required</span>
                </label>
                <input
                  type="text"
                  value={listingTxnRef}
                  onChange={(e) => setListingTxnRef(e.target.value)}
                  placeholder={lang === 'am' ? 'ምሳሌ፡ FT2608... ወይም የቴሌብር ማረጋገጫ ቁጥር' : 'e.g. FT260845920... or Telebirr Txn Number'}
                  required
                  className="w-full bg-slate-950 border-2 border-amber-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-300"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {lang === 'am'
                    ? 'ክፍያውን ካጠናቀቁ በኋላ የሚደርስዎትን የደረሰኝ ቁጥር ያስገቡ። አስተዳዳሪ ፈትሾ ወዲያውኑ ያጸድቃል።'
                    : 'Enter the transaction reference code provided by Telebirr or CBE after sending 600 ETB.'}
                </p>
              </div>

              {/* Payment Receipt / PDF / Screenshot / Photo Upload */}
              <div className="pt-3 border-t border-slate-700/80">
                <label className="text-xs font-bold text-white block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sky-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'am' 
                        ? 'የደረሰኝ PDF / ፎቶ / ስክሪንሽት (በጣም ይመረጣል)' 
                        : 'Upload Payment Proof: PDF Receipt, Photo, or Screenshot'}
                    </span>
                  </span>
                  <span className="text-[10px] text-sky-400 font-medium bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800/60">
                    PDF / Photo / Screenshot
                  </span>
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  {lang === 'am'
                    ? 'የቴሌብር ወይም የንግድ ባንክ (CBE) የክፍያ ማረጋገጫ ፒዲኤፍ (PDF)፣ ስክሪንሽት (Screenshot) ወይም ፎቶ ያያይዙ።'
                    : 'Attach official CBE or Telebirr customer receipt PDF, mobile app screenshot, or camera photo.'}
                </p>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*,application/pdf,.pdf"
                    onChange={handleReceiptUpload}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-300 hover:file:bg-sky-500/30 cursor-pointer border border-slate-700/80 rounded-xl p-1 bg-slate-950/50"
                  />

                  {receiptScreenshot && (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between">
                      {receiptFileType === 'pdf' ? (
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-red-600/90 text-white flex flex-col items-center justify-center font-black text-[10px] shrink-0 shadow-sm">
                            <FileText className="w-4 h-4" />
                            <span>PDF</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                              {receiptFileName || 'Official_Bank_Receipt.pdf'}
                            </p>
                            <p className="text-[10px] text-emerald-400 font-medium">
                              ✓ Bank/Telebirr PDF Receipt Attached
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-emerald-400 shrink-0 bg-slate-950">
                            <img src={receiptScreenshot} alt="Receipt Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                              {receiptFileName || 'Payment_Screenshot.png'}
                            </p>
                            <p className="text-[10px] text-emerald-400 font-medium">
                              ✓ Payment Screenshot / Photo Attached
                            </p>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setReceiptScreenshot(null);
                          setReceiptFileName('');
                        }}
                        className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-800/40 transition shrink-0 ml-2"
                        title="Remove attached receipt"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Admin Free Notice */
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">
                  {lang === 'am' ? 'የአስተዳዳሪ ነጻ መዘርዘሪያ ክፍት ነው (Admin Free Listing Allowed)' : 'Admin Bypass Active: Listing Fee Waived'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">0.00 ETB (Free)</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer ${
                isAdminLoggedIn 
                  ? 'bg-emerald-600 hover:bg-emerald-500' 
                  : 'bg-[#003399] hover:bg-blue-800'
              }`}
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'am' ? 'እንደ አስተዳዳሪ አትም (Admin Publish Free)' : 'Publish Vehicle (Admin Free)'}</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === 'am' ? 'ክፍያውን አረጋግጥና መኪናውን አትም (Submit with 600 ETB Payment)' : 'Submit Vehicle Listing (600 ETB Verified)'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
