import React from 'react';
import { ArrowRight, PlusCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface AboutCharteCarsSectionProps {
  lang: Language;
  onOpenListCar: () => void;
  onOpenAboutModal: () => void;
}

export const AboutCharteCarsSection: React.FC<AboutCharteCarsSectionProps> = ({
  lang,
  onOpenListCar,
  onOpenAboutModal,
}) => {
  return (
    <section id="about-charte-cars" className="bg-[#04163C] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-blue-900/60">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
            {lang === 'am' ? 'ስለ ቻርቴ መኪኖች' : 'ABOUT CHARTE CARS'}
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {lang === 'am'
              ? "ቻርቴ መኪኖች ደላላ እና ተጨማሪ ኮሚሽን ሳይኖር ገዢዎችን እና ሻጮችን በቀጥታ የሚያገናኝ የኢትዮጵያ ቀጥተኛ የመኪና መገበያያ መድረክ ነው። ምንም የተደበቀ ክፍያ ወይም መካከለኛ የዋጋ ጭማሪ የለም። ሻጮች መኪናቸውን በቀጥታ ይዘረዝራሉ፣ ገዢዎች ደግሞ ከእውነተኛው ባለቤት ጋር ይነጋገራሉ።"
              : "Charte Cars is Ethiopia's direct car marketplace, built to connect buyers and sellers without agents standing in between. There are no commissions, no hidden charges, and no middleman marking up the price. Sellers list their own car directly, and buyers deal with the real owner."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card 1: Buyers */}
          <div className="bg-[#082259]/80 border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-3">
            <h3 className="text-sm sm:text-base font-bold tracking-wider uppercase text-sky-400">
              {lang === 'am' ? 'ለገዢዎች — 100% ነፃ' : 'FOR BUYERS — 100% FREE'}
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {lang === 'am'
                ? 'ሁሉንም ዝርዝሮች ይመልከቱ፣ ሙሉ ዋጋዎችን፣ ፎቶዎችን እና መግለጫዎችን ያስሱ፤ ማንኛውንም ሻጭ በስልክ፣ ዋትስአፕ ወይም ቴሌግራም በቀጥታ ያግኙ። አካውንት፣ ክፍያ ወይም ገደብ የለም።'
                : 'Browse every listing, see full prices, photos, and descriptions, and contact any seller directly by phone, WhatsApp, or Telegram. No account, no payment, no limits.'}
            </p>
          </div>

          {/* Card 2: Sellers (600 ETB) */}
          <div className="bg-[#082259]/80 border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-3">
            <h3 className="text-sm sm:text-base font-bold tracking-wider uppercase text-sky-400">
              <span>{lang === 'am' ? 'ለሻጮች — ' : 'FOR SELLERS — '}</span>
              <span className="text-amber-400 font-black">
                {lang === 'am' ? '600 ብር፣ የአንድ ጊዜ' : '600 ETB, ONE TIME'}
              </span>
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {lang === 'am'
                ? 'ይመዝገቡ፣ የአንድ ጊዜ 600 ብር ክፍያ ብቻ ይክፈሉ፣ መኪናዎን እስከ 15 ፎቶዎች እና ሙሉ መግለጫ ጋር ይዘርዝሩ። ዋጋዎን ወይም ፎቶዎችዎን በማንኛውም ጊዜ ያሻሽሉ፤ ሲፈልጉ መኪናዎን የተሸጠ ወይም አስቸኳይ ብለው ምልክት ያድርጉ።'
                : 'Register, pay a single 600 ETB fee, and list your car with up to 15 photos and a full description. Edit your price or photos anytime, and mark your car as Sold or Urgent whenever you need.'}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenListCar}
            className="px-8 py-3.5 rounded-2xl bg-[#0051E8] hover:bg-[#0044C7] text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'am' ? 'መኪናዎን ይዘርዝሩ (600 ብር)' : 'List Your Car (600 ETB, One-Time)'}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
