/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car,
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles,
  PlusCircle,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Download,
  Smartphone
} from 'lucide-react';
import { 
  CarListing,
  CarFilterState,
  Language, 
  Currency, 
  ListingType, 
  ListingStatus 
} from './types';
import { INITIAL_CARS } from './data/mockCars';

// Charte Cars Components
import { DownloadAppBanner } from './components/DownloadAppBanner';
import { Navbar } from './components/Navbar';
import { CarHeroSection } from './components/CarHeroSection';
import { CarListingCard } from './components/CarListingCard';
import { CarDetailModal } from './components/CarDetailModal';
import { ListCarModal } from './components/ListCarModal';
import { CarAdminPortalModal } from './components/CarAdminPortalModal';
import { CarFavoritesModal } from './components/CarFavoritesModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { CarPaymentModal, ReservationReceipt } from './components/CarPaymentModal';
import { AboutCharteCarsModal } from './components/AboutCharteCarsModal';
import { AboutCharteCarsSection } from './components/AboutCharteCarsSection';
import { Footer } from './components/Footer';

const STORAGE_KEY_CARS = 'charte_cars_listings_v1';
const STORAGE_KEY_CAR_FAVS = 'charte_cars_favs_v1';
const STORAGE_KEY_LANG = 'charte_cars_lang_v1';
const STORAGE_KEY_CURRENCY = 'charte_cars_currency_v1';

export default function App() {
  // 1. Language and Currency State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEY_LANG) as Language) || 'en';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem(STORAGE_KEY_CURRENCY) as Currency) || 'ETB';
  });

  // 2. Charte Cars Inventory State
  const [cars, setCars] = useState<CarListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CARS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved cars', e);
      }
    }
    return INITIAL_CARS;
  });

  // 3. Saved / Favorited Cars
  const [carFavorites, setCarFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CAR_FAVS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved car favorites', e);
      }
    }
    return [];
  });

  // 4. Car Filter State
  const [carFilters, setCarFilters] = useState<CarFilterState>({
    searchQuery: '',
    make: '',
    bodyType: '',
    transmission: '',
    fuelType: '',
    condition: '',
    plateCode: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    city: '',
    type: 'all',
  });

  // 5. Modals State
  const [selectedCar, setSelectedCar] = useState<CarListing | null>(null);
  const [isListCarModalOpen, setIsListCarModalOpen] = useState(false);
  const [isCarAdminModalOpen, setIsCarAdminModalOpen] = useState(false);
  const [isCarFavoritesModalOpen, setIsCarFavoritesModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  
  // Payment & Reservation Desk State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetCar, setPaymentTargetCar] = useState<CarListing | null>(null);
  const [paymentPurpose, setPaymentPurpose] = useState<'reservation' | 'down_payment' | 'listing_fee'>('reservation');

  const handleOpenPayment = (
    car: CarListing | null, 
    purpose: 'reservation' | 'down_payment' | 'listing_fee' = 'reservation'
  ) => {
    setPaymentTargetCar(car);
    setPaymentPurpose(purpose);
    setIsPaymentModalOpen(true);
  };

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CARS, JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CAR_FAVS, JSON.stringify(carFavorites));
  }, [carFavorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
  }, [currency]);

  // Register service worker for offline / PWA support
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }
  }, []);

  // Filter handlers
  const handleCarFilterChange = (patch: Partial<CarFilterState>) => {
    setCarFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleResetCarFilters = () => {
    setCarFilters({
      searchQuery: '',
      make: '',
      bodyType: '',
      transmission: '',
      fuelType: '',
      condition: '',
      plateCode: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      city: '',
      type: 'all',
    });
  };

  // Car actions
  const toggleCarFavorite = (id: string) => {
    setCarFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCar = (newCar: CarListing) => {
    setCars((prev) => [newCar, ...prev]);
  };

  const handleUpdateCarStatus = (id: string, status: ListingStatus) => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    if (selectedCar && selectedCar.id === id) {
      setSelectedCar((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleUpdateCar = (updatedCar: CarListing) => {
    setCars((prev) =>
      prev.map((c) => (c.id === updatedCar.id ? updatedCar : c))
    );
    if (selectedCar && selectedCar.id === updatedCar.id) {
      setSelectedCar(updatedCar);
    }
  };

  const handleDeleteCar = (id: string) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
    setCarFavorites((prev) => prev.filter((favId) => favId !== id));
    if (selectedCar && selectedCar.id === id) {
      setSelectedCar(null);
    }
  };

  // Filtered Cars Memo
  const filteredCars = useMemo(() => {
    return cars.filter((item) => {
      // Type: all, sale, rent
      if (carFilters.type !== 'all' && item.type !== carFilters.type) {
        return false;
      }
      // Make
      if (carFilters.make && item.make.toLowerCase() !== carFilters.make.toLowerCase()) {
        return false;
      }
      // Body type
      if (carFilters.bodyType && item.bodyType !== carFilters.bodyType) {
        return false;
      }
      // Transmission
      if (carFilters.transmission && item.transmission !== carFilters.transmission) {
        return false;
      }
      // Fuel type
      if (carFilters.fuelType && item.fuelType !== carFilters.fuelType) {
        return false;
      }
      // Condition
      if (carFilters.condition && item.condition !== carFilters.condition) {
        return false;
      }
      // Plate Code
      if (carFilters.plateCode && item.plateCode !== carFilters.plateCode) {
        return false;
      }
      // City
      if (carFilters.city && item.city.toLowerCase() !== carFilters.city.toLowerCase()) {
        return false;
      }
      // Price range
      if (carFilters.minPrice && item.price < Number(carFilters.minPrice)) {
        return false;
      }
      if (carFilters.maxPrice && item.price > Number(carFilters.maxPrice)) {
        return false;
      }
      // Search query
      if (carFilters.searchQuery.trim()) {
        const q = carFilters.searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchTitleAm = item.titleAm?.toLowerCase().includes(q);
        const matchMake = item.make.toLowerCase().includes(q);
        const matchModel = item.model.toLowerCase().includes(q);
        const matchCity = item.city.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchTitle && !matchTitleAm && !matchMake && !matchModel && !matchCity && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [cars, carFilters]);

  // Saved car objects
  const favoriteCarObjects = useMemo(() => {
    return cars.filter((c) => carFavorites.includes(c.id));
  }, [cars, carFavorites]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Prominent Top Download Banner */}
      <DownloadAppBanner
        onOpenDownload={() => setIsDownloadModalOpen(true)}
        lang={lang}
      />

      {/* 2. Top Navigation Bar with Download Option */}
      <Navbar
        currentType={carFilters.type}
        onSelectType={(type) => handleCarFilterChange({ type })}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'am' : 'en'))}
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'ETB' ? 'USD' : 'ETB'))}
        favoritesCount={carFavorites.length}
        onOpenFavorites={() => setIsCarFavoritesModalOpen(true)}
        onOpenListCar={() => setIsListCarModalOpen(true)}
        onOpenAdmin={() => setIsCarAdminModalOpen(true)}
        onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
        onOpenPaymentDesk={() => handleOpenPayment(null, 'listing_fee')}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* 3. Hero Section for Charte Cars (FIND A CAR YOU CAN ACTUALLY SEE YOURSELF IN.) */}
      <CarHeroSection
        filters={carFilters}
        onFilterChange={handleCarFilterChange}
        onResetFilters={handleResetCarFilters}
        lang={lang}
        totalCarsCount={filteredCars.length}
      />

      {/* 4. Main Automobile Inventory Content Area (Clean White Background Matching Screenshot 1) */}
      <div className="bg-[#F8FAFC] flex-1 py-10 border-t border-slate-200">
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          {/* LATEST LISTINGS Header Section (Matching Screenshot 1 with vertical blue bar) */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-5 mb-8 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-7 bg-[#0037A3] rounded-sm" />
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {lang === 'am' ? 'የቅርብ ጊዜ ዝርዝሮች (LATEST LISTINGS)' : 'LATEST LISTINGS'}
                </h2>
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1.5 pl-4.5">
                {carFilters.type === 'rent'
                  ? (lang === 'am' ? 'ለኪራይ የቀረቡ ተሽከርካሪዎች' : 'Verified cars available for daily or monthly rental')
                  : carFilters.type === 'sale'
                  ? (lang === 'am' ? 'ለሽያጭ የቀረቡ ተሽከርካሪዎች' : 'Verified cars available for direct sale')
                  : (lang === 'am' ? 'በአዲስ አበባና በመላው ኢትዮጵያ ለሽያጭና ለኪራይ የቀረቡ መኪኖች' : 'Browse all verified cars for sale and rent across Ethiopia')}
              </p>
            </div>

            {/* Quick Filter Badges & Count */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-300 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleCarFilterChange({ type: 'all' })}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    carFilters.type === 'all'
                      ? 'bg-[#0037A3] text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'am' ? 'ሁሉም' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCarFilterChange({ type: 'sale' })}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    carFilters.type === 'sale'
                      ? 'bg-[#0037A3] text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'am' ? 'ሽያጭ' : 'Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCarFilterChange({ type: 'rent' })}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    carFilters.type === 'rent'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'am' ? 'ኪራይ' : 'Rent'}
                </button>
              </div>

              <span className="font-mono text-slate-500">
                <strong className="text-slate-900 font-bold">{filteredCars.length}</strong> {lang === 'am' ? 'መኪኖች' : 'cars'}
              </span>
            </div>
          </div>

          {/* Car Listings Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarListingCard
                  key={car.id}
                  car={car}
                  lang={lang}
                  currency={currency}
                  isFavorite={carFavorites.includes(car.id)}
                  onToggleFavorite={toggleCarFavorite}
                  onSelect={setSelectedCar}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {lang === 'am' ? 'በዚህ መስፈርት የተገኘ መኪና የለም' : 'No vehicles match your search'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                {lang === 'am' 
                  ? 'እባክዎ የተመረጡትን ማጣሪያዎች ይቀይሩ ወይም ሁሉንም መኪኖች ለማየት ማጣሪያውን ያጽዱ።' 
                  : 'Try adjusting your filters or search term to see more available cars.'}
              </p>
              <button
                onClick={handleResetCarFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'am' ? 'ማጣሪያውን አጽዳ' : 'Reset All Filters'}</span>
              </button>
            </div>
          )}

        </main>
      </div>

      {/* 5. Floating Quick Download App Button (Mobile & Desktop) */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setIsDownloadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full font-bold shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 transition-all transform hover:scale-105 active:scale-95 text-xs cursor-pointer"
          title="Download Charte Cars App"
        >
          <Download className="w-4 h-4 animate-bounce shrink-0" />
          <span className="font-bold">
            {lang === 'am' ? 'አፕሊኬሽኑን አውርድ' : 'Download App'}
          </span>
        </button>
      </div>

      {/* 6. About Charte Cars Informational Section */}
      <AboutCharteCarsSection
        lang={lang}
        onOpenListCar={() => setIsListCarModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
      />

      {/* 7. Footer */}
      <Footer
        lang={lang}
        onOpenAdmin={() => setIsCarAdminModalOpen(true)}
        onOpenListCar={() => setIsListCarModalOpen(true)}
        onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
        onSelectType={(type) => handleCarFilterChange({ type })}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* ------------------------------------------------------------- */}
      {/* MODALS */}
      {/* ------------------------------------------------------------- */}

      {/* Vehicle Detail View Modal */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          lang={lang}
          currency={currency}
          isFavorite={carFavorites.includes(selectedCar.id)}
          onToggleFavorite={toggleCarFavorite}
        />
      )}

      {/* List a Car Modal (CONFIDENTIAL SELLER CONTACT DETAILS) */}
      <ListCarModal
        isOpen={isListCarModalOpen}
        onClose={() => setIsListCarModalOpen(false)}
        onAddCar={handleAddCar}
        lang={lang}
      />

      {/* Admin Portal Modal (Passcode Protected with Private Seller Contact Dossiers) */}
      <CarAdminPortalModal
        isOpen={isCarAdminModalOpen}
        onClose={() => setIsCarAdminModalOpen(false)}
        cars={cars}
        onUpdateStatus={handleUpdateCarStatus}
        onUpdateCar={handleUpdateCar}
        onDeleteCar={handleDeleteCar}
        lang={lang}
        currency={currency}
      />

      {/* Car Favorites Modal */}
      <CarFavoritesModal
        isOpen={isCarFavoritesModalOpen}
        onClose={() => setIsCarFavoritesModalOpen(false)}
        favorites={favoriteCarObjects}
        onRemoveFavorite={toggleCarFavorite}
        onSelectCar={setSelectedCar}
        lang={lang}
        currency={currency}
      />

      {/* PROMINENT DOWNLOAD & INSTALL APP MODAL */}
      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        lang={lang}
      />

      {/* About Charte Cars Modal */}
      <AboutCharteCarsModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        lang={lang}
        onOpenListCar={() => {
          setIsAboutModalOpen(false);
          setIsListCarModalOpen(true);
        }}
      />

      {/* Car Payment & Seller Desk Modal */}
      <CarPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        car={paymentTargetCar}
        purpose={paymentPurpose}
        lang={lang}
      />

    </div>
  );
}
