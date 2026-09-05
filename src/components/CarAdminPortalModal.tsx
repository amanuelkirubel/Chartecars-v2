import React, { useState } from 'react';
import { 
  X, 
  Car, 
  ShieldCheck, 
  Lock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  MessageSquare, 
  Send, 
  User, 
  Edit, 
  Trash2, 
  SlidersHorizontal, 
  ExternalLink, 
  Video, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import { CarListing, Language, ListingStatus } from '../types';

interface CarAdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: CarListing[];
  onUpdateCar: (updatedCar: CarListing) => void;
  onDeleteCar: (id: string) => void;
  lang: Language;
}

export const CarAdminPortalModal: React.FC<CarAdminPortalModalProps> = ({
  isOpen,
  onClose,
  cars,
  onUpdateCar,
  onDeleteCar,
  lang,
}) => {
  if (!isOpen) return null;

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active filter
  const [activeTab, setActiveTab] = useState<'all' | 'owner_submissions' | 'active' | 'urgent' | 'sold'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal inside admin
  const [editingCar, setEditingCar] = useState<CarListing | null>(null);

  // Video Settings
  const [heroVideoUrl, setHeroVideoUrl] = useState(() => {
    return localStorage.getItem('charte_cars_hero_video') || '';
  });
  const [videoSavedMsg, setVideoSavedMsg] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'charte2026' || passcode.trim() === '0715' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleStatusChange = (car: CarListing, newStatus: ListingStatus) => {
    onUpdateCar({
      ...car,
      status: newStatus
    });
  };

  const handleSaveVideo = () => {
    if (heroVideoUrl.trim()) {
      localStorage.setItem('charte_cars_hero_video', heroVideoUrl.trim());
    } else {
      localStorage.removeItem('charte_cars_hero_video');
    }
    window.dispatchEvent(new Event('storage'));
    setVideoSavedMsg(true);
    setTimeout(() => setVideoSavedMsg(false), 3000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar) {
      onUpdateCar(editingCar);
      setEditingCar(null);
    }
  };

  // Filtered cars
  const filteredCars = cars.filter((car) => {
    if (activeTab === 'owner_submissions' && car.sellerType !== 'owner') return false;
    if (activeTab === 'active' && car.status !== 'active') return false;
    if (activeTab === 'urgent' && car.status !== 'urgent') return false;
    if (activeTab === 'sold' && car.status !== 'sold') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = car.title.toLowerCase().includes(q);
      const matchMake = car.make.toLowerCase().includes(q);
      const matchModel = car.model.toLowerCase().includes(q);
      const matchCity = car.city.toLowerCase().includes(q);
      const matchSeller = car.sellerContact?.name?.toLowerCase().includes(q) || car.sellerContact?.phone?.includes(q);
      return matchTitle || matchMake || matchModel || matchCity || matchSeller;
    }
    return true;
  });

  const ownerSubmissionsCount = cars.filter((c) => c.sellerType === 'owner').length;
  const activeCount = cars.filter((c) => c.status === 'active').length;
  const soldCount = cars.filter((c) => c.status === 'sold').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#051329] text-white px-5 py-4 border-b border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Charte Cars Admin Portal</h2>
                <span className="bg-blue-950 text-blue-300 border border-blue-600/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  Verified Control
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Vehicle listing management, status updates & confidential seller contact access
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Barrier */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#003399] flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Admin Authentication Required</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the Charte administrative passcode to access confidential vehicle and seller records.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. charte2026 or 0715)"
                autoFocus
                className="w-full text-center tracking-widest text-sm bg-slate-50 border border-slate-300 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />

              {authError && (
                <div className="text-xs text-red-600 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid passcode. Please try again.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#003399] hover:bg-blue-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all"
              >
                Access Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
            
            {/* Top Stat Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Vehicles</span>
                <span className="text-2xl font-black font-mono text-slate-900">{cars.length}</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-2xl">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Direct Owner Submissions</span>
                <span className="text-2xl font-black font-mono text-emerald-900">{ownerSubmissionsCount}</span>
              </div>

              <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-2xl">
                <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">Active On Market</span>
                <span className="text-2xl font-black font-mono text-blue-900">{activeCount}</span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-2xl">
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">Sold Vehicles</span>
                <span className="text-2xl font-black font-mono text-amber-900">{soldCount}</span>
              </div>
            </div>

            {/* Video Customizer Collapsible */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white text-xs">Charte Cars Hero Video Background</span>
                </div>
                {videoSavedMsg && (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Video URL Saved!
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={heroVideoUrl}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                  placeholder="Paste direct MP4/WebM video URL for background..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSaveVideo}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Save Video
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#003399] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({cars.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('owner_submissions')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    activeTab === 'owner_submissions'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <span>Owner Submissions ({ownerSubmissionsCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('active')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    activeTab === 'active'
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Active
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sold')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    activeTab === 'sold'
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Sold
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by make, seller, phone..."
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 w-full sm:w-60"
                />
              </div>
            </div>

            {/* Car Listings Table / Cards */}
            <div className="space-y-3">
              {filteredCars.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Car className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p>No vehicles match your current filter.</p>
                </div>
              ) : (
                filteredCars.map((car) => {
                  const hasPrivateSeller = !!car.sellerContact?.name;
                  return (
                    <div 
                      key={car.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-3"
                    >
                      {/* Top Info Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={car.photos[0]} 
                            alt={car.title} 
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{car.title}</span>
                              <span className="text-[10px] font-mono text-slate-400">#{car.id}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span>{car.year} &bull; {car.make} {car.model}</span>
                              <span>&bull;</span>
                              <span className="font-semibold text-slate-700">{car.city} ({car.neighborhood})</span>
                              <span>&bull;</span>
                              <span className="font-mono font-bold text-[#003399]">{car.price.toLocaleString()} ETB</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Switcher & Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <select
                            value={car.status || 'active'}
                            onChange={(e) => handleStatusChange(car, e.target.value as ListingStatus)}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                              car.status === 'sold'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : car.status === 'urgent'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            <option value="active">Active (On Market)</option>
                            <option value="urgent">Urgent Deal</option>
                            <option value="sold">Sold</option>
                            <option value="pending">Pending</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => setEditingCar(car)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Edit Vehicle"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${car.title}?`)) {
                                onDeleteCar(car.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* CONFIDENTIAL SELLER DOSSIER (Admin-Only) */}
                      {hasPrivateSeller && (
                        <div className="bg-emerald-950/20 border border-emerald-700/40 rounded-xl p-3 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                              <Lock className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Private Owner / Seller Dossier</span>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                              Confidential
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Owner Name:</span>
                              <strong className="text-slate-900">{car.sellerContact?.name}</strong>
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[10px]">Phone Number:</span>
                              <strong className="text-slate-900 font-mono">{car.sellerContact?.phone}</strong>
                              {car.sellerContact?.altPhone && (
                                <span className="text-slate-500 font-mono text-[11px] block">Alt: {car.sellerContact.altPhone}</span>
                              )}
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[10px]">Telegram / Email:</span>
                              <span>{car.sellerContact?.telegram || 'N/A'} &bull; {car.sellerContact?.email || 'N/A'}</span>
                            </div>
                          </div>

                          {car.sellerContact?.notes && (
                            <div className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-200">
                              <strong>Inspection / Availability Note:</strong> {car.sellerContact.notes}
                            </div>
                          )}

                          {/* Instant Admin Contact Actions */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {car.sellerContact?.phone && (
                              <>
                                <a
                                  href={`https://wa.me/251${car.sellerContact.phone.replace(/^0/, '')}?text=${encodeURIComponent(`Hello ${car.sellerContact.name || 'Owner'}, this is Charte Cars admin regarding your ${car.year} ${car.make} ${car.model} listed on our platform.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Message Seller on WhatsApp</span>
                                </a>

                                <a
                                  href={`tel:${car.sellerContact.phone}`}
                                  className="bg-[#003399] hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-mono"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Call {car.sellerContact.phone}</span>
                                </a>
                              </>
                            )}

                            {car.sellerContact?.telegram && (
                              <a
                                href={`https://t.me/${car.sellerContact.telegram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                              >
                                <Send className="w-3 h-3" />
                                <span>Telegram</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* Edit Car Sub-Modal */}
        {editingCar && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm">Edit Vehicle: {editingCar.title}</h3>
                <button type="button" onClick={() => setEditingCar(null)}>
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Title</label>
                  <input
                    type="text"
                    value={editingCar.title}
                    onChange={(e) => setEditingCar({ ...editingCar, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Price (ETB)</label>
                    <input
                      type="number"
                      value={editingCar.price}
                      onChange={(e) => setEditingCar({ ...editingCar, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mileage (km)</label>
                    <input
                      type="number"
                      value={editingCar.mileage}
                      onChange={(e) => setEditingCar({ ...editingCar, mileage: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={editingCar.city}
                      onChange={(e) => setEditingCar({ ...editingCar, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Neighborhood</label>
                    <input
                      type="text"
                      value={editingCar.neighborhood}
                      onChange={(e) => setEditingCar({ ...editingCar, neighborhood: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingCar(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#003399] text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
