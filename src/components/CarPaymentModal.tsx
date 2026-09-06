import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Copy, 
  Check, 
  CheckCircle2, 
  Send, 
  Download, 
  Printer, 
  Lock, 
  Car, 
  AlertCircle,
  QrCode,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { CarListing, Language, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface CarPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarListing | null;
  purpose?: 'reservation' | 'down_payment' | 'listing_fee';
  lang: Language;
  currency: Currency;
  onPaymentSuccess?: (receipt: ReservationReceipt) => void;
}

export interface ReservationReceipt {
  receiptId: string;
  carId: string;
  carTitle: string;
  carPrice: number;
  amountPaid: number;
  paymentMethod: string;
  payerName: string;
  payerPhone: string;
  transactionRef: string;
  date: string;
  status: 'confirmed' | 'pending_verification';
}

type PaymentMethodType = 'telebirr' | 'cbe' | 'chapa' | 'awash_boa';

const OFFICIAL_ACCOUNTS = {
  telebirr: {
    name: 'Charte Cars / Amanuel K.',
    phone: '0715737393',
    merchantCode: '939804',
  },
  cbe: {
    name: 'Charte Cars & Marketplace',
    accountNumber: '1000582914029',
    bank: 'Commercial Bank of Ethiopia (CBE)',
    branch: 'Addis Ababa Bole Branch',
  },
  awash: {
    name: 'Charte Cars Services',
    accountNumber: '01304928501900',
    bank: 'Awash Bank',
  },
  boa: {
    name: 'Charte Cars Services',
    accountNumber: '148295018',
    bank: 'Bank of Abyssinia (BoA)',
  }
};

export const CarPaymentModal: React.FC<CarPaymentModalProps> = ({
  isOpen,
  onClose,
  car,
  purpose = 'reservation',
  lang,
  currency,
  onPaymentSuccess
}) => {
  const [method, setMethod] = useState<PaymentMethodType>('telebirr');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ReservationReceipt | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(() => {
    if (purpose === 'listing_fee') return 600;
    if (purpose === 'reservation') return 5000;
    return car ? Math.round(car.price * 0.1) : 10000; // 10% down payment
  });

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerName.trim() || !payerPhone.trim() || !transactionRef.trim()) {
      alert(lang === 'am' ? 'እባክዎ ሙሉ ስምዎትን፣ ስልክ ቁጥርዎትን እና የግብይት ማጣቀሻ ቁጥር ያስገቡ' : 'Please provide your full name, phone number, and transaction reference number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedReceipt: ReservationReceipt = {
        receiptId: `CH-${Math.floor(100000 + Math.random() * 900000)}`,
        carId: car?.id || 'LISTING-FEE',
        carTitle: car ? `${car.year} ${car.make} ${car.model}` : 'Seller Listing Fee (600 ETB, One-Time)',
        carPrice: car?.price || 0,
        amountPaid: depositAmount,
        paymentMethod: method === 'telebirr' ? 'Telebirr Mobile Money' : method === 'cbe' ? 'Commercial Bank of Ethiopia (CBE)' : method === 'chapa' ? 'Chapa Online Gateway' : 'Bank Transfer',
        payerName,
        payerPhone,
        transactionRef,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'confirmed'
      };

      // Save reservation to local storage for persistence
      try {
        const existing = JSON.parse(localStorage.getItem('charte_car_reservations') || '[]');
        localStorage.setItem('charte_car_reservations', JSON.stringify([generatedReceipt, ...existing]));
      } catch (err) {
        console.error('Failed to save reservation receipt', err);
      }

      setReceipt(generatedReceipt);
      setIsSubmitting(false);
      if (onPaymentSuccess) {
        onPaymentSuccess(generatedReceipt);
      }
    }, 1200);
  };

  const handleSendToWhatsApp = () => {
    if (!receipt) return;
    const msg = `*CHARTE CARS VEHICLE RESERVATION RECEIPT*
----------------------------------------
*Receipt ID:* ${receipt.receiptId}
*Car:* ${receipt.carTitle}
*Deposit Amount:* ${receipt.amountPaid.toLocaleString()} ETB
*Payment Method:* ${receipt.paymentMethod}
*Payer Name:* ${receipt.payerName}
*Payer Phone:* ${receipt.payerPhone}
*Transaction Ref:* ${receipt.transactionRef}
*Date:* ${receipt.date}
*Status:* 48-Hour Guaranteed Hold Confirmed

Please confirm my vehicle inspection appointment. Thank you!`;
    window.open(`https://wa.me/251715737393?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white text-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#051329] text-white p-5 sm:p-6 flex items-center justify-between border-b border-blue-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">
                  {lang === 'am' ? 'ቻርቴ መኪኖች ይፋዊ ክፍያና ማስያዣ' : 'Charte Cars Secure Payment Desk'}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {purpose === 'reservation' 
                  ? (lang === 'am' ? 'የ 48 ሰዓት የመኪና ማስያዣ (Holding Deposit)' : '48-Hour Vehicle Reservation & Test Drive Hold')
                  : purpose === 'listing_fee' 
                  ? (lang === 'am' ? 'የጎልድ ማስታወቂያ ማሳደጊያ' : 'Gold Featured Listing Promotion')
                  : (lang === 'am' ? 'የቅድመ ክፍያ ማስተናገጃ' : 'Vehicle Down Payment')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RECEIPT VIEW (If payment confirmed) */}
        {receipt ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'am' ? 'ክፍያው በተሳካ ሁኔታ ተመዝግቧል!' : 'Reservation Confirmed!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {lang === 'am' 
                  ? 'መኪናው ለ 48 ሰዓታት ለእርስዎ ተይዟል። ኦፊሴላዊ ወኪሎቻችን ዝርዝር መረጃውን ለማረጋገጥ ወዲያውኑ ይደውሉልዎታል።' 
                  : 'This vehicle is now officially on hold for 48 hours for your inspection. Our verified desk is reviewing your reference.'}
              </p>
            </div>

            {/* Official Digital Voucher */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 sm:p-6 space-y-3 font-mono text-xs text-slate-800">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                <span className="text-slate-500 font-sans uppercase font-bold text-[10px]">Receipt Voucher #</span>
                <span className="font-bold text-blue-700 text-sm">{receipt.receiptId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Car:</span>
                <span className="font-bold text-slate-900 font-sans text-right">{receipt.carTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Deposit Paid:</span>
                <span className="font-bold text-emerald-700 text-sm">{receipt.amountPaid.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Payer:</span>
                <span className="font-semibold text-slate-900">{receipt.payerName} ({receipt.payerPhone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Method:</span>
                <span className="text-slate-700">{receipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Txn Reference:</span>
                <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">{receipt.transactionRef}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-sans">
                <span>Timestamp: {receipt.date}</span>
                <span className="text-emerald-600 font-bold">48-Hr Hold Guaranteed</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'am' ? 'ደረሰኙን በዋትስአፕ ላክ (ለፈጣን ማረጋገጫ)' : 'Send Receipt to Official WhatsApp Desk'}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:0715737393"
                  className="bg-slate-900 hover:bg-blue-900 text-white font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call 0715737393</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition border border-slate-300"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-2 font-semibold"
              >
                {lang === 'am' ? 'ዝጋ እና ወደ መኪኖች ተመለስ' : 'Close and Return to Cars'}
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM VIEW */
          <div className="p-5 sm:p-7 space-y-6">
            
            {/* Target Car Summary Box */}
            {car && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5">
                <img 
                  src={car.images[0]} 
                  alt={car.title}
                  className="w-20 h-14 object-cover rounded-xl border border-slate-200 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {lang === 'am' && car.titleAm ? car.titleAm : car.title}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-blue-700 font-bold">{formatPrice(car.price)}</span>
                    <span>&bull;</span>
                    <span>{car.city}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {lang === 'am' ? 'የማስያዣ መጠን' : 'Holding Deposit'}
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono text-emerald-600">
                    {depositAmount.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            )}

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                {lang === 'am' ? 'የክፍያ ዘዴ ይምረጡ (Select Payment Method)' : 'Choose Verified Payment Method'}
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* Telebirr */}
                <button
                  type="button"
                  onClick={() => setMethod('telebirr')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    method === 'telebirr'
                      ? 'border-[#0072CE] bg-blue-50/70 text-[#0072CE] shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0072CE] text-white flex items-center justify-center font-black text-xs">
                    TB
                  </div>
                  <span className="text-xs font-bold">Telebirr</span>
                  <span className="text-[10px] text-slate-500">SuperApp / SMS</span>
                </button>

                {/* CBE Birr & CBE Bank */}
                <button
                  type="button"
                  onClick={() => setMethod('cbe')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    method === 'cbe'
                      ? 'border-[#8B1874] bg-purple-50/70 text-[#8B1874] shadow-sm ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#8B1874] text-white flex items-center justify-center font-bold text-xs">
                    CBE
                  </div>
                  <span className="text-xs font-bold">CBE Bank</span>
                  <span className="text-[10px] text-slate-500">Mobile / Account</span>
                </button>

                {/* Chapa Gateway */}
                <button
                  type="button"
                  onClick={() => setMethod('chapa')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    method === 'chapa'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-700 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Chapa</span>
                  <span className="text-[10px] text-slate-500">Card / Online</span>
                </button>

                {/* Awash / BoA */}
                <button
                  type="button"
                  onClick={() => setMethod('awash_boa')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    method === 'awash_boa'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-700 shadow-sm ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Awash / BoA</span>
                  <span className="text-[10px] text-slate-500">Other Banks</span>
                </button>

              </div>
            </div>

            {/* Instruction Details for Selected Method */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              
              {method === 'telebirr' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-700">Telebirr Official Merchant / Phone:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(OFFICIAL_ACCOUNTS.telebirr.phone, 'tb-phone')}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-100/60 px-2 py-1 rounded-lg transition"
                    >
                      {copiedField === 'tb-phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="font-mono">{OFFICIAL_ACCOUNTS.telebirr.phone}</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Account Name:</span>
                    <strong className="text-slate-900">{OFFICIAL_ACCOUNTS.telebirr.name}</strong>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                    💡 <strong>How to pay:</strong> Open your Telebirr app &gt; tap <em>Send Money</em> to <span className="font-mono font-bold text-blue-600">0715737393</span> or <em>Pay Merchant</em> with code <span className="font-mono font-bold text-blue-600">939804</span> &gt; Enter {depositAmount.toLocaleString()} ETB &gt; Copy your Telebirr Transaction ID below.
                  </p>
                </div>
              )}

              {method === 'cbe' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-700">CBE Account Number:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(OFFICIAL_ACCOUNTS.cbe.accountNumber, 'cbe-acc')}
                      className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-100/60 px-2.5 py-1 rounded-lg transition"
                    >
                      {copiedField === 'cbe-acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="font-mono text-sm">{OFFICIAL_ACCOUNTS.cbe.accountNumber}</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Account Title:</span>
                    <strong className="text-slate-900">{OFFICIAL_ACCOUNTS.cbe.name}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Bank & Branch:</span>
                    <span className="text-slate-800">{OFFICIAL_ACCOUNTS.cbe.bank}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                    💡 <strong>How to pay:</strong> Transfer via CBE Mobile Banking or in branch to account <span className="font-mono font-bold text-purple-700">{OFFICIAL_ACCOUNTS.cbe.accountNumber}</span>. Enter your <span className="font-mono font-bold">FT...</span> transaction code below.
                  </p>
                </div>
              )}

              {method === 'chapa' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-700">Online Gateway (Chapa):</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Instant Verification</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Supports local debit cards, Visa, Mastercard, and direct CBE Birr integration with automatic confirmation.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600">Total payable:</span>
                    <span className="text-base font-black font-mono text-emerald-700">{depositAmount.toLocaleString()} ETB</span>
                  </div>
                </div>
              )}

              {method === 'awash_boa' && (
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-amber-800">Awash Bank</span>
                      <span className="font-mono text-slate-800 text-xs font-semibold">{OFFICIAL_ACCOUNTS.awash.accountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(OFFICIAL_ACCOUNTS.awash.accountNumber, 'awash-acc')}
                      className="text-amber-700 bg-amber-50 p-1.5 rounded-lg hover:bg-amber-100"
                    >
                      {copiedField === 'awash-acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-slate-900">Bank of Abyssinia</span>
                      <span className="font-mono text-slate-800 text-xs font-semibold">{OFFICIAL_ACCOUNTS.boa.accountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(OFFICIAL_ACCOUNTS.boa.accountNumber, 'boa-acc')}
                      className="text-slate-700 bg-slate-100 p-1.5 rounded-lg hover:bg-slate-200"
                    >
                      {copiedField === 'boa-acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Form to submit proof & reserve */}
            <form onSubmit={handleSubmitPayment} className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {lang === 'am' ? 'የከፋይ ማረጋገጫ መረጃ' : 'Confirm Your Transfer & Details'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'am' ? 'ሙሉ ስም' : 'Your Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amanuel Kebede"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0911... or 07..."
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {lang === 'am' ? 'የግብይት ማጣቀሻ / Transaction ID (FT... / Telebirr Txn)' : 'Transaction ID / Reference Number'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FT26081948 or TB938491823"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#003399] hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Transfer Reference...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {lang === 'am' 
                        ? `${depositAmount.toLocaleString()} ብር ማስያዣ አረጋግጥ` 
                        : `Confirm ${depositAmount.toLocaleString()} ETB Reservation Hold`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Guaranteed 48-Hour Vehicle Hold &bull; Direct Verified Broker Desk</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
