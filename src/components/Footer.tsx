import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  ShieldCheck,
  Car,
  Download,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { CharteLogo } from './CharteLogo';
import { Language } from '../types';
import { CONTACT_INFO } from '../data/mockListings';

interface FooterProps {
  lang: Language;
  onOpenAdmin: () => void;
  onOpenListCar: () => void;
  onOpenDownloadApp: () => void;
  onSelectType: (type: 'all' | 'sale' | 'rent') => void;
  onOpenAbout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenAdmin,
  onOpenListCar,
  onOpenDownloadApp,
  onSelectType,
  onOpenAbout,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000E26] border-t border-blue-900/60 text-slate-400 text-xs">
      
      {/* Download App Hero Strip */}
      <div className="bg-gradient-to-r from-[#001438] via-[#002B7A] to-[#001438] py-5 px-4 border-b border-blue-800/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">
                {lang === 'am' ? 'የቻርቴ መኪኖች መተግበሪያን በስልክዎ ይጫኑ' : 'Get Charte Cars on Your Smartphone or PC'}
              </p>
              <p className="text-xs text-blue-200">
                {lang === 'am' ? 'ፈጣን የመኪና ፍለጋ፣ ኦፍላይን እይታ እና የቀጥታ ጥሪ ወደ ወኪሎች' : 'Ultra-fast vehicle search, offline browsing, and 1-tap WhatsApp agent inquiries.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDownloadApp}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition active:scale-95 cursor-pointer text-xs"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'am' ? 'አፕሊኬሽኑን አውርድ (Download App)' : 'Download / Install App'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <CharteLogo size="lg" showSubtitle={true} brand="cars" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {lang === 'am'
                ? 'ቻርቴ መኪኖች — በመላው ኢትዮጵያ አስተማማኝ ተሽከርካሪዎችን ለመግዛት፣ ለመሸጥ እና ለመከራየት የሚያስችል ይፋዊ መድረክ።'
                : 'Charte Cars — Ethiopia\'s premier automobile marketplace. Connecting buyers, verified car owners, and fleet renters with certified inspections.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 bg-[#001A4E] border border-blue-800/40 text-blue-300 px-3 py-1 rounded-lg text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Plate & Inspection</span>
              </span>
            </div>
          </div>

          {/* Quick Vehicle Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'am' ? 'ፈጣን ማውጫ' : 'Automobile Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onSelectType('sale')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  {lang === 'am' ? 'መኪና ይግዙ (Cars for Sale)' : 'Cars for Sale (Buy)'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectType('rent')}
                  className="hover:text-blue-300 transition-colors text-left"
                >
                  {lang === 'am' ? 'መኪና ይከራዩ (Rental Cars)' : 'Cars for Rent (Rentals)'}
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenListCar}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  + {lang === 'am' ? 'መኪናዎን ይዘርዝሩ / ይሽጡ' : 'List / Sell Your Car'}
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenDownloadApp}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'am' ? 'መተግበሪያውን አውርድ (Download App)' : 'Download Mobile App'}</span>
                </button>
              </li>
              {onOpenAbout && (
                <li>
                  <button
                    onClick={onOpenAbout}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    {lang === 'am' ? 'ስለ ቻርቴ መኪኖች (About Charte Cars)' : 'About Charte Cars (0% Middleman)'}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Popular Makes in Ethiopia */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'am' ? 'ተወዳጅ የመኪና አይነቶች' : 'Popular Vehicle Makes'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Toyota (Land Cruiser, Hilux, RAV4, Corolla)</li>
              <li>Hyundai (Tucson, Elantra, Santa Fe)</li>
              <li>Mercedes-Benz (C-Class, E-Class, G-Wagon)</li>
              <li>Suzuki (Dzire, Swift, Jimny)</li>
              <li>Electric Vehicles (EVs & Hybrids)</li>
            </ul>
          </div>

          {/* Direct Contact & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'am' ? 'ቀጥታ ግንኙነት' : 'Direct Agent Hotline'}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${CONTACT_INFO.phone1}`} className="hover:text-white font-mono">
                    {CONTACT_INFO.phone1Display}
                  </a>
                  <a href={`tel:${CONTACT_INFO.phone2}`} className="hover:text-white font-mono">
                    {CONTACT_INFO.phone2Display}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Send className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a 
                    href="https://t.me/charte7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white text-blue-400 font-medium"
                  >
                    Telegram: @charte7
                  </a>
                  <a 
                    href="https://t.me/charte77" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white text-blue-400 font-medium"
                  >
                    Telegram: @charte77
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white">
                  {CONTACT_INFO.email}
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-blue-400 hover:text-white font-medium underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'am' ? 'የአስተዳዳሪ ፖርታል (Admin Portal)' : 'Admin & Private Seller Portal'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {currentYear} Charte Cars Ethiopia. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Addis Ababa, Bole & Hawassa, Ethiopia</span>
            <span>·</span>
            <button onClick={onOpenDownloadApp} className="text-emerald-400 hover:underline">
              Download App
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
