import React from 'react';
import { X, CheckCircle2, Car, Shield, Sparkles, Phone, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface AboutCharteCarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenListCar: () => void;
  lang: Language;
}

export const AboutCharteCarsModal: React.FC<AboutCharteCarsModalProps> = ({
  isOpen,
  onClose,
  onOpenListCar,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="about-charte-cars-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#04163C] border border-blue-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-blue-950/80 border border-blue-700/50 text-slate-300 hover:text-white hover:bg-blue-900 flex items-center justify-center transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white text-center uppercase tracking-tight mb-4">
          {lang === 'am' ? 'ስለ ቻርቴ መኪኖች' : 'ABOUT CHARTE CARS'}
        </h2>

        {/* Lead Intro Description */}
        <p className="text-slate-200 text-xs sm:text-sm text-center leading-relaxed max-w-md mx-auto mb-6">
          {lang === 'am'
            ? "ቻርቴ መኪኖች ደላላ እና ተጨማሪ ኮሚሽን ሳይኖር ገዢዎችን እና ሻጮችን በቀጥታ የሚያገናኝ የኢትዮጵያ ቀጥተኛ የመኪና መገበያያ መድረክ ነው። ምንም የተደበቀ ክፍያ ወይም መካከለኛ የዋጋ ጭማሪ የለም። ሻጮች መኪናቸውን በቀጥታ ይዘረዝራሉ፣ ገዢዎች ደግሞ ከእውነተኛው ባለቤት ጋር ይነጋገራሉ።"
            : "Charte Cars is Ethiopia's direct car marketplace, built to connect buyers and sellers without agents standing in between. There are no commissions, no hidden charges, and no middleman marking up the price. Sellers list their own car directly, and buyers deal with the real owner."}
        </p>

        {/* Card 1: FOR BUYERS — 100% FREE */}
        <div className="bg-[#082259]/80 border border-blue-500/30 rounded-2xl p-5 mb-4 shadow-lg">
          <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-sky-400 mb-2 flex items-center justify-between">
            <span>
              {lang === 'am' ? 'ለገዢዎች — 100% ነፃ' : 'FOR BUYERS — 100% FREE'}
            </span>
          </h3>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {lang === 'am'
              ? 'ሁሉንም ዝርዝሮች ይመልከቱ፣ ሙሉ ዋጋዎችን፣ ፎቶዎችን እና መግለጫዎችን ያስሱ፤ ማንኛውንም ሻጭ በስልክ፣ ዋትስአፕ ወይም ቴሌግራም በቀጥታ ያግኙ። አካውንት፣ ክፍያ ወይም ገደብ የለም።'
              : 'Browse every listing, see full prices, photos, and descriptions, and contact any seller directly by phone, WhatsApp, or Telegram. No account, no payment, no limits.'}
          </p>
        </div>

        {/* Card 2: FOR SELLERS — 600 ETB, ONE TIME (Updated from 500 to 600) */}
        <div className="bg-[#082259]/80 border border-blue-500/30 rounded-2xl p-5 mb-6 shadow-lg">
          <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 flex items-center justify-between">
            <span className="text-sky-400">
              {lang === 'am' ? 'ለሻጮች — ' : 'FOR SELLERS — '}
              <span className="text-amber-400 font-black">
                {lang === 'am' ? '600 ብር፣ የአንድ ጊዜ' : '600 ETB, ONE TIME'}
              </span>
            </span>
          </h3>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {lang === 'am'
              ? 'ይመዝገቡ፣ የአንድ ጊዜ 600 ብር ክፍያ ብቻ ይክፈሉ፣ መኪናዎን እስከ 15 ፎቶዎች እና ሙሉ መግለጫ ጋር ይዘርዝሩ። ዋጋዎን ወይም ፎቶዎችዎን በማንኛውም ጊዜ ያሻሽሉ፤ ሲፈልጉ መኪናዎን የተሸጠ ወይም አስቸኳይ ብለው ምልክት ያድርጉ።'
              : 'Register, pay a single 600 ETB fee, and list your car with up to 15 photos and a full description. Edit your price or photos anytime, and mark your car as Sold or Urgent whenever you need.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenListCar();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0051E8] hover:bg-[#0044C7] text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            <span>{lang === 'am' ? 'መኪናዎን አሁኑኑ ይዘርዝሩ (600 ብር)' : 'List Your Car Now (600 ETB)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-center text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            {lang === 'am' ? 'ተሽከርካሪዎችን ማሰስ ቀጥል' : 'Continue Browsing Listings'}
          </button>
        </div>

      </div>
    </div>
  );
};
