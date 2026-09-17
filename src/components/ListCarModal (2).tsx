import React, { useState, useEffect } from 'react';
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
import { CHARTE_PAYMENT_ACCOUNTS } from '../data/paymentAccounts';
import { LISTING_FEE_ETB } from '../config/pricing';

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
  const [listingPaymentMethod, setListingPaymentMethod] = useState<string>('telebirr');
  const [accountCategoryFilter, setAccountCategoryFilter] = useState<'all' | 'mobile_money' | 'bank'>('all');
  const [listingTxnRef, setListingTxnRef] = useState('');
  const [receiptScreenshot, setReceiptScreenshot] = useState<string | null>(null);
  const [receiptFileType, setReceiptFileType] = useState<'pdf' | 'image'>('image');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Optional Featured Promotion Upgrade
  const [isFeaturedPromotion, setIsFeaturedPromotion] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  // Post-submit confirmation screen state — shown instead of just closing
  // the modal, so the seller gets clear, persistent confirmation that
  // their payment went through and knows NOT to resubmit/pay again.
  const [submitState, setSubmitState] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionStatus, setLastSubmissionStatus] = useState<'active' | 'pending'>('pending');

  // Reset back to the form each time the modal is freshly opened, so a
  // past success screen doesn't linger the next time someone lists a car.
  useEffect(() => {
    if (isOpen) {
      setSubmitState('form');
    }
  }, [isOpen]);

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

  // Maximum photos kept per listing. Every photo is stored as a base64
  // string inside localStorage, which the browser caps at roughly 5MB per
  // site. Raw phone photos are 3-6MB EACH, so a handful of sellers used to
  // be enough to fill the quota — after which new submissions silently
  // failed to save ("stuck"). We now downscale every photo before storing.
  const MAX_PHOTOS = 10;

  /**
   * Downscale + re-encode an image to a small JPEG data URL (~80-200KB
   * instead of 3-6MB). This is the main fix for listings getting stuck
   * once several people have listed cars on the same device/browser.
   */
  const compressImage = (file: File, maxDim = 1280, quality = 0.7): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read-failed'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('decode-failed'));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const scale = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('canvas-unavailable'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxAllowed = MAX_PHOTOS - photos.length;
    if (maxAllowed <= 0) {
      setErrorMsg(lang === 'am'
        ? `ከ${MAX_PHOTOS} በላይ ፎቶ ማስገባት አይቻልም።`
        : `You can upload a maximum of ${MAX_PHOTOS} photos.`);
      e.target.value = '';
      return;
    }

    const toProcess: File[] = Array.from(files).slice(0, maxAllowed) as File[];

    for (const file of toProcess) {
      try {
        const compressed = await compressImage(file);
        setPhotos((prev) => [...prev, compressed].slice(0, MAX_PHOTOS));
      } catch (err) {
        console.error('Photo compression failed, falling back to raw file', err);
        // Fall back to the original file only if it is small enough to be
        // safely stored; otherwise skip it rather than breaking the save.
        if (file.size <= 1.5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setPhotos((prev) => [...prev, event.target!.result as string].slice(0, MAX_PHOTOS));
            }
          };
          reader.readAsDataURL(file);
        } else {
          setErrorMsg(lang === 'am'
            ? 'አንድ ፎቶ በጣም ትልቅ ስለሆነ አልተካተተም። እባክዎ ያነሰ ፎቶ ይምረጡ።'
            : 'One photo was too large to process and was skipped. Please choose a smaller photo.');
        }
      }
    }

    e.target.value = '';
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

    // Guard against huge files: everything gets base64-encoded and later
    // saved into localStorage alongside every other listing. A single
    // multi-MB PDF/photo can blow past the browser's storage quota and
    // (previously) crash the whole app on submit. Cap uploads at 4MB so
    // that never happens; ask for a lighter file instead.
    const MAX_RECEIPT_BYTES = 4 * 1024 * 1024;
    if (file.size > MAX_RECEIPT_BYTES) {
      setErrorMsg(
        lang === 'am'
          ? 'የፋይሉ መጠን በጣም ትልቅ ነው (ከ4MB በላይ)። እባክዎ ያነሰ መጠን ያለው ፎቶ/ስክሪንሽት/ፒዲኤፍ ይስቀሉ።'
          : 'That file is too large (over 4MB). Please upload a smaller photo, screenshot, or PDF.'
      );
      e.target.value = '';
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setReceiptFileType(isPdf ? 'pdf' : 'image');
    setReceiptFileName(file.name);

    // Screenshots are also downscaled before storage — same quota reason as
    // the car photos above.
    if (!isPdf) {
      compressImage(file, 1100, 0.65)
        .then((compressed) => {
          setReceiptScreenshot(compressed);
          setErrorMsg('');
        })
        .catch(() => {
          const fallback = new FileReader();
          fallback.onload = (event) => {
            if (event.target?.result) {
              setReceiptScreenshot(event.target.result as string);
              setErrorMsg('');
            }
          };
          fallback.readAsDataURL(file);
        });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReceiptScreenshot(event.target.result as string);
        setErrorMsg('');
      }
    };
    reader.onerror = () => {
      setErrorMsg(
        lang === 'am'
          ? 'ፋይሉን ማንበብ አልተቻለም። እባክዎ እንደገና ይሞክሩ ወይም ሌላ ፋይል ይምረጡ።'
          : 'Could not read that file. Please try again or choose a different file.'
      );
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

    // STRICT PAYMENT ENFORCEMENT & ANTI-REUSE SAFEGUARD
    // -----------------------------------------------------------------
    // "No one can list their car to sell without paying; only admin can
    // list without pay."
    //
    // Sellers may prove payment with a typed transaction reference, an
    // uploaded receipt (PDF/photo/screenshot), or both. We only reject the
    // submission when BOTH are missing.
    //
    // BUG FIX — "transaction already used" on retry:
    // Previously the reference was written into a local `charte_used_txn_refs`
    // registry BEFORE the listing was actually saved, and that registry was
    // then treated as proof of reuse. So if the save failed for any reason
    // (storage quota, crash, closed tab), the reference was already burned:
    // the seller retried, got "this reference has already been used", and no
    // listing existed anywhere for admin to approve.
    //
    // A reference is now considered used ONLY when a real listing carrying
    // that reference exists. If the listing never landed, the seller can
    // simply try again with the same reference — which is the correct
    // behaviour, because they really did only pay once.
    if (!isAdminLoggedIn) {
      const cleanRef = listingTxnRef.trim();
      const hasRef = cleanRef.length >= 5;
      const hasReceiptFile = !!receiptScreenshot;

      if (!hasRef && !hasReceiptFile) {
        setErrorMsg(lang === 'am'
          ? `ክፍያ ሳይፈጽሙ መኪናዎን መዘርዘር አይችሉም! እባክዎ የ${LISTING_FEE_ETB} ብር ክፍያ ፈጽመው የግብይት ቁጥር ያስገቡ ወይም የክፍያ ደረሰኝ (ፒዲኤፍ/ፎቶ/ስክሪንሽት) ያያይዙ (አንዱ ብቻ በቂ ነው)።`
          : `Payment is strictly required! No one can list their car without paying the ${LISTING_FEE_ETB} ETB listing fee. Please either enter your transaction reference number OR attach a payment receipt (PDF, photo, or screenshot) — one of the two is enough.`);
        return;
      }

      // Duplicate check against REAL listings only (never against the local
      // "used refs" log, which can contain references from submissions that
      // failed to save).
      if (hasRef) {
        const needle = cleanRef.toLowerCase();
        const isAlreadyInCars = existingCars.some((c) => {
          const directRef = c.paymentDetails?.transactionRef?.trim().toLowerCase();
          const inNotes = c.sellerContact?.notes?.toLowerCase();
          return (directRef && directRef === needle) ||
                 (inNotes && inNotes.includes(needle));
        });

        if (isAlreadyInCars) {
          setErrorMsg(lang === 'am'
            ? `ይህ የክፍያ ደረሰኝ ቁጥር (${cleanRef}) አስቀድሞ ለሌላ ዝርዝር ጥቅም ላይ ውሏል። መኪናዎ ገብቷል፤ አሁን የአስተዳዳሪ ማረጋገጫ እየጠበቀ ነው — እባክዎ እንደገና አይክፈሉ! ካላዩት በ0710783877 / 0970181259 ይደውሉ።`
            : `⚠️ This payment reference (${cleanRef}) is already attached to an existing listing. Your car was submitted and is awaiting admin verification — please don't pay again. If you don't see it, contact Charte support at 0710783877 / 0970181259.`);
          return;
        }
      }
    }

    const defaultPhotos = photos.length > 0 ? photos : [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ];

    const finalTitle = `${year} ${actualMake} ${model} (${condition === 'brand_new' ? 'Brand New' : 'Used'})`;

    const submitHandler = onSubmit || onAddCar;
    if (!submitHandler) {
      setErrorMsg(lang === 'am'
        ? 'ዝርዝሩን ማስገባት አልተቻለም። እባክዎ ገጹን አድሱና እንደገና ይሞክሩ።'
        : 'Could not submit the listing right now. Please refresh the page and try again.');
      return;
    }

    const payload = {
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
      status: (isAdminLoggedIn ? 'active' : 'pending') as 'active' | 'pending',
      isFeatured: isFeaturedPromotion,
      sellerType: 'owner' as const,
      sellerContact: {
        name: sellerName.trim(),
        phone: sellerPhone.trim(),
        altPhone: sellerAltPhone.trim() || undefined,
        email: sellerEmail.trim() || undefined,
        telegram: sellerTelegram.trim() || undefined,
        preferredContact,
        notes: !isAdminLoggedIn
          ? `[PAID ${LISTING_FEE_ETB} ETB] ${listingTxnRef.trim() ? `Ref: ${listingTxnRef.trim()} ` : ''}via ${listingPaymentMethod.toUpperCase()}${receiptScreenshot ? (receiptFileType === 'pdf' ? ` (PDF Attached: ${receiptFileName})` : ' (Screenshot/Photo Attached)') : ''} | ${sellerNotes}`
          : `[ADMIN FREE LISTING] | ${sellerNotes}`,
      },
      paymentDetails: !isAdminLoggedIn ? {
        method: listingPaymentMethod,
        transactionRef: listingTxnRef.trim() || undefined,
        amount: LISTING_FEE_ETB,
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
    };

    // Submitting is wrapped so a failure NEVER leaves the seller in limbo:
    // either the listing goes through and we show the success screen, or we
    // show a real error and the seller can retry with the same payment
    // reference (nothing has been marked "used" at this point).
    setIsSubmitting(true);
    try {
      submitHandler(payload);
    } catch (err) {
      console.error('Listing submission failed', err);
      setIsSubmitting(false);
      setErrorMsg(lang === 'am'
        ? 'ዝርዝሩን ማስቀመጥ አልተቻለም። ክፍያዎ አልጠፋም — የግብይት ቁጥርዎን ሳይቀይሩ እንደገና «አስገባ» ይጫኑ። ችግሩ ከቀጠለ ጥቂት ፎቶዎችን ያስወግዱና ይሞክሩ ወይም በ0710783877 ይደውሉ።'
        : 'We could not save your listing. Your payment is not lost — press Submit again with the same transaction reference. If it keeps failing, remove a few photos and retry, or call 0710783877.');
      return;
    }
    setIsSubmitting(false);

    // Audit log of references that produced a real listing. This is a LOG
    // ONLY — it is never used to block a resubmission, because a failed
    // save must not burn a seller's payment reference.
    if (!isAdminLoggedIn && listingTxnRef.trim().length >= 5) {
      try {
        const usedRefs: string[] = JSON.parse(localStorage.getItem('charte_used_txn_refs') || '[]');
        usedRefs.push(listingTxnRef.trim().toLowerCase());
        // Keep the log small so it can never contribute to a storage overflow.
        localStorage.setItem('charte_used_txn_refs', JSON.stringify(usedRefs.slice(-500)));
      } catch (err) {
        console.error('Failed to record used transaction reference', err);
      }
    }

    // Show an in-modal confirmation instead of silently closing — this is
    // what tells the seller their payment/submission actually went
    // through, so they don't assume it failed and pay a second time.
    setLastSubmissionStatus(isAdminLoggedIn ? 'active' : 'pending');
    setSubmitState('success');

    // Clear the payment fields so a second listing in the same session
    // can't accidentally reuse this same payment reference.
    setListingTxnRef('');
    setReceiptScreenshot(null);
    setReceiptFileName('');
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
                  : (lang === 'am' ? 'ያለ ክፍያ ማንም መኪና መዘርዘር አይችልም (አስተዳዳሪ ብቻ ነፃ መዘርዘር ይችላል)' : `Listing requires ${LISTING_FEE_ETB} ETB verification fee • Only admin can list without pay`)}
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

        {submitState === 'success' ? (
          /* -------------------------------------------------------
             Post-submission confirmation. Shown instead of just
             closing the modal, so the seller has clear, persistent
             proof their payment/submission went through and knows
             not to pay or resubmit again while waiting on admin
             review.
          ------------------------------------------------------- */
          <div className="p-6 sm:p-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {lastSubmissionStatus === 'active'
                ? (lang === 'am' ? 'መኪናዎ ወዲያውኑ ታትሟል!' : 'Your car is live!')
                : (lang === 'am' ? 'ክፍያዎ እና ዝርዝርዎ ደርሶናል!' : 'Payment & listing received!')}
            </h3>

            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              {lastSubmissionStatus === 'active'
                ? (lang === 'am'
                    ? 'መኪናዎ አሁኑኑ በገበያው ላይ ታይቷል። ማንም ገዢ አሁን ማየት ይችላል።'
                    : 'Your vehicle has been published and is visible on the marketplace right now.')
                : (lang === 'am'
                    ? `መኪናዎ እና የ${LISTING_FEE_ETB} ብር ክፍያዎ ገብተዋል። አስተዳዳሪያችን ክፍያውን አረጋግጦ እንደጨረሰ መኪናዎ በራስ-ሰር በገበያው ላይ ይታተማል — ብዙውን ጊዜ በጥቂት ሰዓታት ውስጥ። ክፍያውን እንደገና መፈጸም ወይም ቅጹን እንደገና መሙላት አያስፈልግም።`
                    : `Your car details and ${LISTING_FEE_ETB} ETB payment reference are in. Our admin team verifies the payment and your listing goes live automatically once approved — usually within a few hours. You do not need to pay again or resubmit this form.`)}
            </p>

            {lastSubmissionStatus === 'pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 text-xs text-blue-900 max-w-md">
                {lang === 'am' ? (
                  <>ጥያቄ ካለዎት ወይም ከጥቂት ሰዓታት በኋላ መኪናዎን ካላዩ፣ ይደውሉልን፡ <strong className="font-mono">0710783877</strong> ወይም <strong className="font-mono">0970181259</strong>።</>
                ) : (
                  <>Questions, or don't see your car after a few hours? Call us at <strong className="font-mono">0710783877</strong> or <strong className="font-mono">0970181259</strong>.</>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full sm:w-auto px-8 py-3 rounded-xl bg-[#003399] hover:bg-blue-800 text-white font-bold text-sm shadow-lg transition-all"
            >
              {lang === 'am' ? 'ዝጋ' : 'Done'}
            </button>
          </div>
        ) : (
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
                  ? `ያለ ክፍያ ማንም ሰው መኪና መዘርዘር ወይም መሸጥ አይችልም። አስተዳዳሪ (Admin) ብቻ ነው ያለ ክፍያ መዘርዘር የሚችለው። መኪናዎን ለማተም የ${LISTING_FEE_ETB} ብር ማረጋገጫ ክፍያ ከዚህ በታች በቴሌብር ወይም በንግድ ባንክ መፈጸም ግዴታ ነው።`
                  : `Without payment, no one can list their car to sell. Only verified platform administrators can list without pay. A ${LISTING_FEE_ETB} ETB listing verification fee is mandatory before publication.`}
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
              <input
                type="text"
                list="city-suggestions"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Addis Ababa, Hawassa, or type your own"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
              <datalist id="city-suggestions">
                {ETHIOPIAN_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
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
                      <span>{lang === 'am' ? `የመኪና መዘርዘሪያ ክፍያ (${LISTING_FEE_ETB} ብር) - ግዴታ` : `Mandatory Listing Verification: ${LISTING_FEE_ETB} ETB`}</span>
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

              {/* Payment Accounts Selection with Tabs & Direct Paste */}
              <div className="space-y-2.5 pt-1">
                {/* Account Category Filter Tabs */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setAccountCategoryFilter('all')}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                        accountCategoryFilter === 'all' 
                          ? 'bg-[#003399] text-white' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang === 'am' ? 'ሁሉም (8 አካውንቶች)' : 'All 8 Accounts'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountCategoryFilter('mobile_money')}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                        accountCategoryFilter === 'mobile_money' 
                          ? 'bg-[#003399] text-white' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang === 'am' ? 'ሞባይል ገንዘብ (ቴሌብር & ኤም-ፔሳ)' : 'Telebirr & M-Pesa'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountCategoryFilter('bank')}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                        accountCategoryFilter === 'bank' 
                          ? 'bg-[#003399] text-white' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang === 'am' ? 'ባንኮች (ንግድ ባንክ፣ አቢሲኒያ...)' : 'Commercial Banks'}
                    </button>
                  </div>

                  <span className="text-[10px] text-amber-300 font-medium">
                    {lang === 'am' ? '📋 "Copy" ንክተው ወደ ባንክ አፖ ይለጥፉ (Paste)' : '📋 Click "Copy to Paste" & paste into your app'}
                  </span>
                </div>

                {/* Grid of All 8 Payment Accounts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {CHARTE_PAYMENT_ACCOUNTS
                    .filter((acc) => accountCategoryFilter === 'all' || acc.category === accountCategoryFilter)
                    .map((acc) => {
                      const isSelected = listingPaymentMethod === acc.id;
                      const isCopied = copiedAccount === acc.id;

                      return (
                        <div
                          key={acc.id}
                          onClick={() => setListingPaymentMethod(acc.id)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30'
                              : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded text-white ${acc.badgeColor}`}>
                                {acc.id.toUpperCase()}
                              </span>
                              <span className="font-bold text-xs text-white truncate max-w-[140px]">
                                {lang === 'am' ? acc.nameAm : acc.name}
                              </span>
                            </div>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                              {LISTING_FEE_ETB} ETB
                            </span>
                          </div>

                          <div className="font-mono text-sm font-bold text-white flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="tracking-wider text-amber-200">{acc.accountNumber}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setListingPaymentMethod(acc.id);
                                handleCopy(acc.accountNumber, acc.id);
                              }}
                              className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition ${
                                isCopied 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                              }`}
                              title="Click to copy account number to paste"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? 'Copied!' : 'Copy to Paste'}</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                            <span className="truncate">{acc.accountName}</span>
                            {isSelected && (
                              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Choice notice: either the reference number, the receipt file, or both */}
              <div className="pt-2 border-t border-slate-700/80">
                <p className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 rounded-lg px-3 py-2 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'ከሁለቱ አንዱ በቂ ነው፡ የግብይት ቁጥር ብቻ ያስገቡ፣ የደረሰኝ ፒዲኤፍ/ፎቶ/ስክሪንሽት ብቻ ያያይዙ፣ ወይም ሁለቱንም ያድርጉ።'
                      : 'Either one is enough: type your transaction reference number, attach a receipt PDF/photo/screenshot, or do both.'}
                  </span>
                </p>
              </div>

              {/* Transaction Reference Input (one of two acceptable proofs) */}
              <div className="pt-2">
                <label className="text-xs font-bold text-white block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? 'የክፍያ ደረሰኝ ቁጥር (Transaction Reference ID)' : 'Payment Transaction Reference'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {lang === 'am' ? '(አማራጭ ካያያዙ ደረሰኝ)' : '(optional if you attach a receipt below)'}
                  </span>
                </label>
                <input
                  type="text"
                  value={listingTxnRef}
                  onChange={(e) => setListingTxnRef(e.target.value)}
                  placeholder={lang === 'am' ? 'ምሳሌ፡ FT2608... ወይም የቴሌብር ማረጋገጫ ቁጥር' : 'e.g. FT260845920... or Telebirr Txn Number'}
                  className="w-full bg-slate-950 border-2 border-amber-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-300"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {lang === 'am'
                    ? 'ክፍያውን ካጠናቀቁ በኋላ የሚደርስዎትን የደረሰኝ ቁጥር ያስገቡ። አስተዳዳሪ ፈትሾ ወዲያውኑ ያጸድቃል።'
                    : `Enter the transaction reference code provided by Telebirr or CBE after sending ${LISTING_FEE_ETB} ETB.`}
                </p>
              </div>

              {/* Payment Receipt / PDF / Screenshot / Photo Upload (the other acceptable proof) */}
              <div className="pt-3 border-t border-slate-700/80">
                <label className="text-xs font-bold text-white block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sky-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'am' 
                        ? 'የደረሰኝ PDF / ፎቶ / ስክሪንሽት' 
                        : 'Upload Payment Proof: PDF Receipt, Photo, or Screenshot'}
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {lang === 'am' ? '(አማራጭ ካስገቡ የግብይት ቁጥር)' : '(optional if you entered a reference above)'}
                  </span>
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  {lang === 'am'
                    ? 'የቴሌብር ወይም የንግድ ባንክ (CBE) የክፍያ ማረጋገጫ ፒዲኤፍ (PDF)፣ ስክሪንሽት (Screenshot) ወይም ፎቶ ያያይዙ። (ከፍተኛ 4MB)'
                    : 'Attach official CBE or Telebirr customer receipt PDF, mobile app screenshot, or camera photo. (Max 4MB)'}
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
              disabled={isSubmitting}
              className={`w-full text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                isSubmitting ? 'opacity-60 cursor-wait' : 'cursor-pointer'
              } ${
                isAdminLoggedIn 
                  ? 'bg-emerald-600 hover:bg-emerald-500' 
                  : 'bg-[#003399] hover:bg-blue-800'
              }`}
            >
              {isSubmitting ? (
                <span>{lang === 'am' ? 'እየተላከ ነው...' : 'Submitting...'}</span>
              ) : isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'am' ? 'እንደ አስተዳዳሪ አትም (Admin Publish Free)' : 'Publish Vehicle (Admin Free)'}</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === 'am' ? `ክፍያውን አረጋግጥና መኪናውን አትም (Submit with ${LISTING_FEE_ETB} ETB Payment)` : `Submit Vehicle Listing (${LISTING_FEE_ETB} ETB Verified)`}</span>
                </>
              )}
            </button>
          </div>

        </form>
        )}

      </div>
    </div>
  );
};
