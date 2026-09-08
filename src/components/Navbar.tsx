import React, { useState } from 'react';
import { 
  Heart, 
  PlusCircle, 
  Menu, 
  X, 
  Download,
  User,
  LogOut,
  Search,
  Phone,
  Send,
  Car as CarIcon
} from 'lucide-react';
import { Language, Currency, ListingType } from '../types';
import { CONTACT_INFO } from '../data/mockListings';

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
    <header className="sticky top-0 z-40 w-full shadow-md">

      {/* 1. Thin top strip: tagline, phone numbers, socials */}
      <div className="bg-[#071739] text-white px-4 sm:px-8 py-1.5 text-[11px] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {lang === 'am' ? 'ኢትዮጵያ፣ በመንኮራኩሮች ላይ' : 'Ethiopia, on wheels'}
            </span>
            <a href={`tel:${CONTACT_INFO.phone1}`} className="flex items-center gap-1 text-slate-300 hover:text-white font-mono">
              <Phone className="w-3 h-3" />
              {CONTACT_INFO.phone1Display}
            </a>
            <a href={`tel:${CONTACT_INFO.phone2}`} className="flex items-center gap-1 text-slate-300 hover:text-white font-mono">
              <Phone className="w-3 h-3" />
              {CONTACT_INFO.phone2Display}
            </a>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/charte7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-300 transition"
            >
              <Send className="w-3 h-3" />
              @charte7
            </a>
            <a
              href="https://t.me/charte77"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition"
            >
              @charte77
            </a>
            {isAdminLoggedIn ? (
              <button onClick={onLogout} className="flex items-center gap-1 hover:text-red-300 transition">
                <LogOut className="w-3 h-3" />
                {lang === 'am' ? 'ውጣ' : 'Logout'}
              </button>
            ) : (
              <button onClick={onOpenAdmin} className="flex items-center gap-1 hover:text-white transition">
                <User className="w-3 h-3" />
                {lang === 'am' ? 'ግባ' : 'Log in'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main bar: white background, logo + pill controls */}
      <div className="bg-white text-slate-900 px-4 sm:px-8 py-2.5 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Logo: circular mark + wordmark */}
          <div
            className="cursor-pointer flex items-center gap-2.5 shrink-0"
            onClick={() => onSelectType('all')}
          >
            <img
              src="/charte-logo.png"
              alt="Charte Cars"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0037A3]">
                CHARTE
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-slate-400">
                CARS
              </span>
            </div>
          </div>

          {/* Buy / Rent pill toggle */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-full p-1 shrink-0">
            <button
              onClick={() => onSelectType('sale')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition ${
                currentType === 'sale'
                  ? 'bg-[#0037A3] text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CarIcon className="w-3.5 h-3.5" />
              BUY
            </button>
            <button
              onClick={() => onSelectType('rent')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition ${
                currentType === 'rent'
                  ? 'bg-[#0037A3] text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              RENT
            </button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-[#0037A3] transition text-xs font-bold"
              title="Search Vehicles"
            >
              <Search className="w-3.5 h-3.5" />
              {lang === 'am' ? 'ፈልግ' : 'Search'}
            </button>

            {/* Favorites */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-full border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition"
              title="Saved Cars"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Download app pill */}
            <button
              onClick={onOpenDownloadApp}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              {lang === 'am' ? 'አውርድ' : 'Download App'}
            </button>

            {/* Language toggle pill */}
            <button
              onClick={onToggleLang}
              className="hidden sm:flex items-center justify-center px-3.5 py-1.5 rounded-full bg-[#0037A3] text-white text-xs font-bold"
            >
              {lang === 'en' ? 'EN' : 'አማ'}
            </button>

            {/* + SELL pill */}
            <button
              onClick={onOpenListCar}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              {lang === 'am' ? 'ሽጥ' : 'SELL'}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-slate-800 p-4 space-y-3 border-b border-slate-200 animate-in slide-in-from-top-2">

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
            <button
              onClick={() => { onSelectType('sale'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl border ${currentType === 'sale' ? 'bg-[#0037A3] text-white border-[#0037A3]' : 'border-slate-200 text-slate-600'}`}
            >
              BUY
            </button>
            <button
              onClick={() => { onSelectType('rent'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl border ${currentType === 'rent' ? 'bg-[#0037A3] text-white border-[#0037A3]' : 'border-slate-200 text-slate-600'}`}
            >
              RENT
            </button>
          </div>

          <button
            onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
            className="w-full border border-slate-200 p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-700"
          >
            <Search className="w-4 h-4" />
            {lang === 'am' ? 'መኪና ፈልግ (Search Vehicles)' : 'Search Vehicles & Filters'}
          </button>

          <button
            onClick={() => { onOpenDownloadApp(); setMobileMenuOpen(false); }}
            className="w-full border border-emerald-200 text-emerald-600 p-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {lang === 'am' ? 'አውርድ (App)' : 'Download App'}
          </button>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                  className="text-[#0037A3] font-bold text-xs"
                >
                  MY LISTINGS
                </button>
                <button
                  onClick={() => { if (onLogout) onLogout(); setMobileMenuOpen(false); }}
                  className="text-red-500 font-bold flex items-center gap-1 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {lang === 'am' ? 'ውጣ' : 'Logout'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="text-[#0037A3] font-bold flex items-center gap-1 text-xs"
              >
                <User className="w-3.5 h-3.5" />
                {lang === 'am' ? 'አስተዳዳሪ ግባ (Login)' : 'Admin Login'}
              </button>
            )}
            <button onClick={onToggleLang} className="bg-[#0037A3] text-white px-3 py-1 rounded-full text-xs font-bold">
              {lang === 'en' ? 'EN' : 'አማ'}
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
