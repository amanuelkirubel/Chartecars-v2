import React, { useState } from 'react';
import { 
  Car,
  Heart, 
  PlusCircle, 
  Menu, 
  X, 
  Globe2,
  DollarSign,
  Download,
  Smartphone,
  ShieldCheck,
  User,
  LogOut,
  CreditCard,
  Search
} from 'lucide-react';
import { CharteLogo } from './CharteLogo';
import { Language, Currency, ListingType } from '../types';

interface NavbarProps {
  currentType: ListingType | 'all';
  onSelectType: (type: ListingType | 'all') => void;
  lang: Language;
  onToggleLang: () => void;
  currency: Currency;
  onToggleCurrency: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenListCar: () => void;
  onOpenAdmin: () => void;
  onOpenDownloadApp: () => void;
  onOpenSearch: () => void;
  onOpenPaymentDesk?: () => void;
  onOpenAbout?: () => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentType,
  onSelectType,
  lang,
  onToggleLang,
  currency,
  onToggleCurrency,
  favoritesCount,
  onOpenFavorites,
  onOpenListCar,
  onOpenAdmin,
  onOpenDownloadApp,
  onOpenSearch,
  onOpenPaymentDesk,
  onOpenAbout,
  isAdminLoggedIn = false,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg">
      
      {/* 1. Top Bar: Deep Navy Tier (Identical to Screenshot 1) */}
      <div className="bg-[#071739] text-white px-4 sm:px-8 py-3.5 border-b border-blue-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Badge (Matching screenshot 1 logo card) */}
          <div 
            className="cursor-pointer flex items-center gap-3 transition-transform hover:scale-[1.01]"
            onClick={() => onSelectType('all')}
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-[#0C2A6B] rounded-2xl border border-blue-500/40 p-2 shadow-lg flex flex-col items-center justify-center">
              <div className="w-11 h-11 overflow-hidden flex items-center justify-center">
                <img
                  src="/charte-logo.png"
                  alt="Charte Cars"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-serif font-semibold text-white tracking-wide mt-0.5 whitespace-nowrap">
                Charte Cars
              </span>
            </div>
          </div>

          {/* Right Top Links: MY LISTINGS, Logout / Login, Admin & Download */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold tracking-wide">
            
            {/* Currency selector */}
            <button
              onClick={onToggleCurrency}
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white transition font-mono"
              title="Toggle Currency"
            >
              <DollarSign className="w-3.5 h-3.5 text-blue-400" />
              <span>{currency}</span>
            </button>

            {/* Saved favorites */}
            <button
              onClick={onOpenFavorites}
              className="relative p-1 text-slate-300 hover:text-red-400 transition"
              title="Saved Cars"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* MY LISTINGS */}
            <button
              onClick={onOpenAdmin}
              className="text-white hover:text-blue-300 font-bold tracking-wider uppercase transition text-xs sm:text-sm"
            >
              {lang === 'am' ? 'የእኔ ዝርዝሮች (MY LISTINGS)' : 'MY LISTINGS'}
            </button>

            {/* Search Option Button (Replaced Pay / Deposit in this exact location) */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600/50 border border-blue-400/70 text-blue-100 hover:bg-blue-600 hover:text-white transition text-xs font-bold shadow active:scale-95 cursor-pointer"
              title="Search Vehicles & Filters"
            >
              <Search className="w-3.5 h-3.5 text-blue-300" />
              <span>{lang === 'am' ? 'መኪና ፈልግ (Search)' : 'Search'}</span>
            </button>

            {/* Download Option button in Top Navy Bar */}
            <button
              onClick={onOpenDownloadApp}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500 hover:text-white transition text-xs font-bold shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'አውርድ (App)' : 'Download App'}</span>
            </button>

            {/* Logout / Admin Login */}
            {isAdminLoggedIn ? (
              <button
                onClick={onLogout}
                className="text-red-300 hover:text-white bg-red-950/70 border border-red-700/60 hover:bg-red-800 px-2.5 py-1 rounded-xl transition flex items-center gap-1.5 text-xs font-bold active:scale-95 cursor-pointer shadow"
                title="Logout directly"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'ውጣ' : 'Logout'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="text-blue-200 hover:text-white bg-blue-950/70 border border-blue-700/60 hover:bg-blue-800 px-2.5 py-1 rounded-xl transition flex items-center gap-1.5 text-xs font-bold active:scale-95 cursor-pointer shadow"
                title="Admin Login"
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'ግባ' : 'Login'}</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Second Bar: Vibrant Royal Blue Tier (Identical to Screenshot 1) */}
      <div className="bg-[#0037A3] text-white px-4 sm:px-8 py-2.5 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Navigation: BUY, SELL, RENT, ABOUT */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold tracking-wider">
            <button
              onClick={() => onSelectType('sale')}
              className={`hover:text-blue-200 transition ${
                currentType === 'sale' ? 'text-white border-b-2 border-white pb-0.5' : 'text-blue-100'
              }`}
            >
              BUY
            </button>

            <button
              onClick={onOpenListCar}
              className="text-blue-100 hover:text-blue-200 transition"
            >
              SELL
            </button>

            <button
              onClick={() => onSelectType('rent')}
              className={`hover:text-blue-200 transition ${
                currentType === 'rent' ? 'text-white border-b-2 border-white pb-0.5' : 'text-blue-100'
              }`}
            >
              RENT
            </button>

            <button
              onClick={() => {
                if (onOpenAbout) {
                  onOpenAbout();
                } else {
                  onSelectType('all');
                }
              }}
              className="text-blue-100 hover:text-white transition uppercase font-bold"
            >
              ABOUT
            </button>
          </nav>

          {/* Right Actions: Language Toggle & "+ LIST A CAR" Button (Matching Screenshot 1) */}
          <div className="flex items-center gap-3 ml-auto">
            
            {/* Download Button in blue bar for mobile/desktop */}
            <button
              onClick={onOpenDownloadApp}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'አውርድ' : 'Download App'}</span>
            </button>

            {/* Language Box (Bordered rectangular button matching Screenshot 1) */}
            <button
              onClick={onToggleLang}
              className="px-3.5 py-1.5 rounded-lg border border-blue-300 text-white font-medium text-xs hover:bg-blue-800 transition"
            >
              {lang === 'en' ? 'አማርኛ' : 'English'}
            </button>

            {/* + LIST A CAR (Bright Blue Button matching Screenshot 1) */}
            <button
              onClick={onOpenListCar}
              className="px-4 py-2 rounded-lg bg-[#0051E8] hover:bg-[#0044C7] text-white text-xs sm:text-sm font-bold tracking-wider shadow flex items-center gap-1.5 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ LIST A CAR</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071739] text-white p-4 space-y-3 border-b border-blue-900 animate-in slide-in-from-top-2">
          
          {/* Download CTA inside mobile menu */}
          <div className="bg-emerald-950 border border-emerald-500/60 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold">Charte Cars App</p>
                <p className="text-[10px] text-emerald-300">Fast & Offline Mobile App</p>
              </div>
            </div>
            <button
              onClick={() => { onOpenDownloadApp(); setMobileMenuOpen(false); }}
              className="bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Install
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 text-center text-xs font-bold">
            <button 
              onClick={() => { onSelectType('sale'); setMobileMenuOpen(false); }}
              className="p-2 bg-[#0037A3] rounded-lg"
            >
              BUY
            </button>
            <button 
              onClick={() => { onOpenListCar(); setMobileMenuOpen(false); }}
              className="p-2 bg-[#0037A3] rounded-lg"
            >
              SELL
            </button>
            <button 
              onClick={() => { onSelectType('rent'); setMobileMenuOpen(false); }}
              className="p-2 bg-[#0037A3] rounded-lg"
            >
              RENT
            </button>
            <button 
              onClick={() => { 
                if (onOpenAbout) onOpenAbout();
                else onSelectType('all');
                setMobileMenuOpen(false); 
              }}
              className="p-2 bg-[#0037A3] rounded-lg text-amber-300 hover:text-white"
            >
              ABOUT
            </button>
          </div>

          <div className="pt-2 border-t border-blue-950 flex flex-col gap-2 text-xs">
            <button 
              onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
              className="w-full bg-blue-600 border border-blue-400/70 p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow cursor-pointer active:scale-95"
            >
              <Search className="w-4 h-4 text-blue-200" />
              <span>{lang === 'am' ? 'መኪና ፈልግ (Search Vehicles)' : 'Search Vehicles & Filters'}</span>
            </button>

            <div className="flex justify-between items-center pt-1">
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }} 
                    className="text-blue-300 hover:text-white font-bold text-xs"
                  >
                    MY LISTINGS (Admin)
                  </button>
                  <button 
                    onClick={() => { 
                      if (onLogout) onLogout(); 
                      setMobileMenuOpen(false); 
                    }} 
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? 'ውጣ (Logout)' : 'Logout'}</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }} 
                  className="text-blue-300 hover:text-white font-bold flex items-center gap-1 text-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{lang === 'am' ? 'አስተዳዳሪ ግባ (Login)' : 'Admin Login'}</span>
                </button>
              )}
              <button onClick={onToggleLang} className="border border-blue-400 px-3 py-1 rounded">
                {lang === 'en' ? 'አማርኛ' : 'English'}
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
