import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Zap, 
  RotateCcw, 
  Building,
  DollarSign,
  Eye,
  LogOut,
  Edit3,
  Phone,
  Send,
  User,
  CheckCircle2,
  AlertTriangle,
  Video,
  Play,
  Pause,
  Key,
  Mail,
  Search,
  Plus
} from 'lucide-react';
import { PropertyListing, ListingStatus, Language, PropertyCategory, ListingType } from '../types';
import { getTranslation } from '../data/translations';
import { formatPrice } from '../utils/formatters';
import { CONTACT_INFO, ETHIOPIAN_CITIES } from '../data/mockListings';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: PropertyListing[];
  onUpdateStatus: (id: string, status: ListingStatus) => void;
  onUpdateListing: (listing: PropertyListing) => void;
  onDeleteListing: (id: string) => void;
  onRestoreDefaults: () => void;
  lang: Language;
}

const AUTHORIZED_ADMIN_EMAILS = [
  'chartehomes@gmail.com',
  'chartehomes7@gmail.com',
  'emmanuelkirubel@gmail.com'
];

const VALID_PASSCODES = ['charte7', 'charte77', 'charte2026', 'admin77', 'chartehomes'];

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  listings,
  onUpdateStatus,
  onUpdateListing,
  onDeleteListing,
  onRestoreDefaults,
  lang,
}) => {
  const t = getTranslation(lang);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('charte_admin_auth') === 'true';
  });
  const [selectedEmail, setSelectedEmail] = useState<string>(AUTHORIZED_ADMIN_EMAILS[0]);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Admin Search & Tabs
  const [activeTab, setActiveTab] = useState<'listings' | 'video'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<'all' | 'seller_submissions'>('all');
  
  // Modals inside Admin
  const [editingListing, setEditingListing] = useState<PropertyListing | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingSellerId, setViewingSellerId] = useState<string | null>(null);

  // Video Background Configuration State
  const [videoUrl, setVideoUrl] = useState<string>(() => {
    return localStorage.getItem('charte_homes_hero_video') || '';
  });
  const [videoSavedMsg, setVideoSavedMsg] = useState(false);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (VALID_PASSCODES.includes(cleanPass)) {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('charte_admin_auth', 'true');
      localStorage.setItem('charte_admin_email', selectedEmail);
    } else {
      setAuthError('Invalid passcode. Authorized administrators: use charte7 or charte77.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('charte_admin_auth');
    setPasscode('');
    setAuthError('');
  };

  // Video Background Save
  const handleSaveVideo = (urlToSave: string) => {
    localStorage.setItem('charte_homes_hero_video', urlToSave);
    setVideoUrl(urlToSave);
    setVideoSavedMsg(true);
    setTimeout(() => setVideoSavedMsg(false), 2000);
    // Dispatch storage event so HeroSection catches the change live
    window.dispatchEvent(new Event('storage'));
  };

  // Handle Delete Confirmation
  const confirmDelete = () => {
    if (deletingId) {
      onDeleteListing(deletingId);
      setDeletingId(null);
    }
  };

  // Filter listings inside admin
  const filteredAdminListings = listings.filter((item) => {
    if (adminCategoryFilter === 'seller_submissions') {
      const hasSeller = Boolean(item.sellerContact?.name || item.sellerContact?.phone);
      if (!hasSeller) return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.neighborhood.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      Boolean(item.sellerContact?.name?.toLowerCase().includes(q)) ||
      Boolean(item.sellerContact?.phone?.toLowerCase().includes(q)) ||
      Boolean(item.sellerContact?.telegram?.toLowerCase().includes(q)) ||
      Boolean(item.sellerContact?.email?.toLowerCase().includes(q))
    );
  });

  const sellerSubmissionsCount = listings.filter(
    (l) => Boolean(l.sellerContact?.name || l.sellerContact?.phone)
  ).length;

  const totalValue = listings.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const activeCount = listings.filter((l) => l.status === 'active' || !l.status).length;
  const urgentCount = listings.filter((l) => l.status === 'urgent').length;
  const soldCount = listings.filter((l) => l.status === 'sold').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-[#091428] border border-blue-900/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/40 bg-[#060F20]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 
                className="text-lg font-serif font-bold text-white tracking-tight flex items-center gap-2"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Charte Homes Admin Center
                <span className="text-[11px] font-sans font-semibold bg-blue-950 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded-full">
                  Official Broker Desk
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                {isAuthenticated ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Logged in as: <strong className="text-white">{selectedEmail}</strong></span>
                  </>
                ) : (
                  <span>Restricted Access: Authorized Admins Only</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs bg-slate-800 hover:bg-red-900/40 hover:text-red-300 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Admin Login Screen */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-600/10">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-1 text-center">
              Administrator Login
            </h3>
            <p className="text-xs text-slate-400 text-center mb-6">
              Sign in with your registered administrator email and passcode to edit or delete properties and view private seller records.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Admin Account
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={selectedEmail}
                    onChange={(e) => setSelectedEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {AUTHORIZED_ADMIN_EMAILS.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Security Passcode
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter admin passcode (e.g. charte7)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>

              {authError && (
                <div className="bg-red-950/60 border border-red-800 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 text-xs uppercase tracking-wider transition-all"
              >
                Sign In to Admin Portal
              </button>

              <div className="pt-3 border-t border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-500">
                  Authorized Admin Contacts: <strong>chartehomes@gmail.com</strong>, <strong>chartehomes7@gmail.com</strong>, <strong>emmanuelkirubel@gmail.com</strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Telegram Desk: <strong>@charte7</strong> / <strong>@charte77</strong>
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Content */
          <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Nav Tabs inside Admin */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'listings'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Manage Listings ({listings.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'video'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Background Video Settings</span>
                </button>
              </div>

              <button
                onClick={onRestoreDefaults}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-800"
                title="Reset sample listings"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            </div>

            {/* TAB 1: LISTINGS MANAGEMENT */}
            {activeTab === 'listings' && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Total Listings</div>
                    <div className="text-2xl font-bold font-mono text-white mt-1">{listings.length}</div>
                  </div>
                  <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Active Properties</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{activeCount}</div>
                  </div>
                  <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Urgent Deals</div>
                    <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{urgentCount}</div>
                  </div>
                  <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Sold / Leased</div>
                    <div className="text-2xl font-bold font-mono text-blue-400 mt-1">{soldCount}</div>
                  </div>
                </div>

                {/* Privacy Badge Notice */}
                <div className="bg-[#051124] border border-blue-900/60 p-3.5 rounded-xl flex items-center gap-3 text-xs text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white">Public Privacy Rule Active:</strong> Seller contact information is kept <strong>strictly private</strong> in this Admin Portal. The public website only displays the house specs, photos, and location, routing prospective buyers exclusively to Charte Homes official agents (<span className="text-blue-300">@charte7</span>, <span className="text-blue-300">@charte77</span>, and phones <span className="text-blue-300">0715737393</span> / <span className="text-blue-300">0939804748</span>).
                  </div>
                </div>

                {/* Listings Category Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setAdminCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                        adminCategoryFilter === 'all'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>All Properties</span>
                      <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                        {listings.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdminCategoryFilter('seller_submissions')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                        adminCategoryFilter === 'seller_submissions'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Owner / Seller Submissions</span>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono">
                        {sellerSubmissionsCount}
                      </span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Showing <strong className="text-white font-mono">{filteredAdminListings.length}</strong> of {listings.length} listings
                  </span>
                </div>

                {/* Search Bar for Listings */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, location, seller name, phone, or ID..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Properties List */}
                <div className="space-y-3">
                  {filteredAdminListings.length === 0 ? (
                    <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                      {adminCategoryFilter === 'seller_submissions'
                        ? 'No properties with owner contact details found matching your search.'
                        : 'No listings match your search query.'}
                    </div>
                  ) : (
                    filteredAdminListings.map((item) => {
                      const isOwnerOpen = viewingSellerId === item.id;
                      const hasSellerInfo = Boolean(item.sellerContact?.name || item.sellerContact?.phone || item.sellerContact?.telegram);

                      return (
                        <div 
                          key={item.id}
                          className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.photos[0]}
                                alt={item.title}
                                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                    item.type === 'rent' ? 'bg-amber-900/50 text-amber-300' : 'bg-blue-900/50 text-blue-300'
                                  }`}>
                                    {item.type === 'rent' ? 'Rent' : 'Sale'}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    {item.city} &middot; {item.neighborhood}
                                  </span>
                                  {item.hasCarta && (
                                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded font-bold">
                                      ካርታ Carta
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-md mt-0.5">
                                  {item.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold">
                                  <span>{formatPrice(item.price)}</span>
                                  <span className="text-slate-500 font-sans">&bull;</span>
                                  <span className="text-slate-400 font-sans text-[11px]">{item.bedrooms} bd &bull; {item.bathrooms} ba &bull; {item.area} m²</span>
                                </div>

                                {/* Private Seller Contact Preview Badge (Admin-Only) */}
                                {hasSellerInfo ? (
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 text-[11px]">
                                      <Lock className="w-3 h-3 text-emerald-400" />
                                      <span>Owner: <strong className="text-white">{item.sellerContact?.name || 'Registered'}</strong></span>
                                    </div>
                                    {item.sellerContact?.phone && (
                                      <span className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                        📞 {item.sellerContact.phone}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                                    <span>Standard Charte Listing</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start sm:self-center">
                              {/* Status Toggles */}
                              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                                <button
                                  onClick={() => onUpdateStatus(item.id, 'active')}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    item.status === 'active' || !item.status
                                      ? 'bg-emerald-600 text-white'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                  title="Set active"
                                >
                                  Active
                                </button>
                                <button
                                  onClick={() => onUpdateStatus(item.id, 'urgent')}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    item.status === 'urgent'
                                      ? 'bg-amber-600 text-white'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                  title="Set urgent"
                                >
                                  Urgent
                                </button>
                                <button
                                  onClick={() => onUpdateStatus(item.id, 'sold')}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    item.status === 'sold'
                                      ? 'bg-blue-600 text-white'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                  title="Set sold"
                                >
                                  Sold
                                </button>
                              </div>

                              {/* View Owner Details Button */}
                              <button
                                onClick={() => setViewingSellerId(isOwnerOpen ? null : item.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                                  isOwnerOpen
                                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                                    : hasSellerInfo
                                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/60'
                                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                                }`}
                                title="View private seller contact"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Owner Info</span>
                              </button>

                              {/* Edit Listing Button */}
                              <button
                                onClick={() => setEditingListing(item)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 flex items-center gap-1.5 transition-colors"
                                title="Edit Listing Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              {/* Delete Listing Button */}
                              <button
                                onClick={() => setDeletingId(item.id)}
                                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:bg-red-600/30 hover:text-red-400 border border-slate-800 hover:border-red-800 transition-colors"
                                title="Delete listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Collapsible Private Seller Information Drawer */}
                          {isOwnerOpen && (
                            <div className="bg-[#050E1F] border-2 border-emerald-500/40 rounded-xl p-4 text-xs space-y-3 mt-2 shadow-inner">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 border-b border-blue-900/60 pb-2.5 gap-2">
                                <span className="font-bold text-emerald-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                                  <Lock className="w-4 h-4 text-emerald-400" />
                                  Private Seller / Owner Dossier (Confidential to Admin Only)
                                </span>
                                <div className="flex items-center gap-2">
                                  {item.sellerContact?.preferredContact && (
                                    <span className="bg-blue-900/60 border border-blue-700/60 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                      Prefers: {item.sellerContact.preferredContact}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    Ref ID: #{item.id}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                                {/* Name */}
                                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">Seller / Owner Name:</span>
                                  <span className="text-white font-bold text-xs">
                                    {item.sellerContact?.name || 'Registered Owner'}
                                  </span>
                                </div>

                                {/* Primary Phone */}
                                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">Primary Phone / WhatsApp:</span>
                                  {item.sellerContact?.phone ? (
                                    <div className="flex items-center justify-between gap-1 mt-0.5">
                                      <a 
                                        href={`tel:${item.sellerContact.phone}`} 
                                        className="text-blue-400 hover:underline font-mono font-bold text-xs"
                                      >
                                        {item.sellerContact.phone}
                                      </a>
                                      <a
                                        href={`https://wa.me/${item.sellerContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.sellerContact.name || 'Owner'}, this is Charte Homes Admin regarding your property: "${item.title}".`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded transition-colors"
                                      >
                                        WhatsApp
                                      </a>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 font-mono text-xs">0715737393 (Direct desk)</span>
                                  )}
                                </div>

                                {/* Alternative Phone */}
                                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">Alternative Phone:</span>
                                  {item.sellerContact?.altPhone ? (
                                    <a 
                                      href={`tel:${item.sellerContact.altPhone}`} 
                                      className="text-blue-400 hover:underline font-mono font-bold text-xs mt-0.5 block"
                                    >
                                      {item.sellerContact.altPhone}
                                    </a>
                                  ) : (
                                    <span className="text-slate-500 text-xs italic">Not provided</span>
                                  )}
                                </div>

                                {/* Telegram / Email */}
                                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">Telegram / Email:</span>
                                  <div className="space-y-0.5 mt-0.5">
                                    {item.sellerContact?.telegram ? (
                                      <div>
                                        <a 
                                          href={`https://t.me/${item.sellerContact.telegram.replace('@', '')}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sky-400 hover:underline font-medium text-xs"
                                        >
                                          {item.sellerContact.telegram.startsWith('@') ? item.sellerContact.telegram : `@${item.sellerContact.telegram}`}
                                        </a>
                                      </div>
                                    ) : null}
                                    {item.sellerContact?.email ? (
                                      <div>
                                        <a 
                                          href={`mailto:${item.sellerContact.email}`}
                                          className="text-amber-400 hover:underline text-[11px] truncate block"
                                        >
                                          {item.sellerContact.email}
                                        </a>
                                      </div>
                                    ) : null}
                                    {!item.sellerContact?.telegram && !item.sellerContact?.email && (
                                      <span className="text-slate-500 text-xs italic">Not provided</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Admin Notes */}
                              {item.sellerContact?.notes && (
                                <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-slate-300 text-[11px]">
                                  <strong className="text-slate-200 uppercase text-[10px] tracking-wider mr-1.5">Admin & Viewing Notes:</strong>
                                  {item.sellerContact.notes}
                                </div>
                              )}

                              {/* Direct Admin Action Buttons */}
                              {item.sellerContact?.phone && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <a
                                    href={`https://wa.me/${item.sellerContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.sellerContact.name || 'Owner'}, this is Charte Homes Admin regarding your property listing "${item.title}". We have interested buyers and would like to coordinate verification and viewing.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow transition-colors"
                                  >
                                    <span>💬 Message Seller on WhatsApp</span>
                                  </a>
                                  <a
                                    href={`tel:${item.sellerContact.phone}`}
                                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow transition-colors"
                                  >
                                    <span>📞 Call Seller Directly</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* TAB 2: BACKGROUND VIDEO SETTINGS */}
            {activeTab === 'video' && (
              <div className="space-y-6">
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2.5 text-white font-serif font-bold text-base">
                    <Video className="w-5 h-5 text-blue-400" />
                    <span>Website Hero Background Video</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Charte Homes features a modern architectural video background in the hero banner. You can set any direct MP4 or WebM video link, or choose from our pre-tested luxury city skyline videos.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Video Stream URL (.mp4 or .webm)
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. https://.../night-skyline.webm or .mp4"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {videoSavedMsg && (
                    <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Background video updated successfully! Live preview updated.</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      onClick={() => handleSaveVideo(videoUrl)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/30"
                    >
                      Save Video URL
                    </button>

                    <button
                      onClick={() => {
                        const defaultManhattan = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/89/Aerial_views_of_Downtown_Manhattan%2C_New_York_City%2C_USA_at_night_including_Battery_Park%2C_Freedom_Tower%2C_Wall_Street%2C_The_Oculus%2C_West_Side_Highway_and_Hudson_River.webm/Aerial_views_of_Downtown_Manhattan%2C_New_York_City%2C_USA_at_night_including_Battery_Park%2C_Freedom_Tower%2C_Wall_Street%2C_The_Oculus%2C_West_Side_Highway_and_Hudson_River.webm.480p.vp9.webm';
                        handleSaveVideo(defaultManhattan);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl transition-colors border border-slate-700"
                    >
                      Use Night City Skyline (Default)
                    </button>

                    <button
                      onClick={() => {
                        handleSaveVideo('');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium px-4 py-2.5 rounded-xl transition-colors border border-slate-800"
                    >
                      Reset / Clear Video
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODAL 1: EDIT PROPERTY MODAL */}
        {editingListing && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-2xl bg-[#09152C] border border-blue-800/60 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 overflow-y-auto max-h-[90vh] space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">
                    Edit Property: {editingListing.title}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingListing(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Title */}
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">
                    Property Title
                  </label>
                  <input
                    type="text"
                    value={editingListing.title}
                    onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Price & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      value={editingListing.price}
                      onChange={(e) => setEditingListing({ ...editingListing, price: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">
                      Listing Type
                    </label>
                    <select
                      value={editingListing.type}
                      onChange={(e) => setEditingListing({ ...editingListing, type: e.target.value as ListingType })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                </div>

                {/* City & Neighborhood */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">
                      City
                    </label>
                    <select
                      value={editingListing.city}
                      onChange={(e) => setEditingListing({ ...editingListing, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      {ETHIOPIAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">
                      Neighborhood
                    </label>
                    <input
                      type="text"
                      value={editingListing.neighborhood}
                      onChange={(e) => setEditingListing({ ...editingListing, neighborhood: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Specs: Beds, Baths, Area */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={editingListing.bedrooms}
                      onChange={(e) => setEditingListing({ ...editingListing, bedrooms: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={editingListing.bathrooms}
                      onChange={(e) => setEditingListing({ ...editingListing, bathrooms: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">
                      Area (m²)
                    </label>
                    <input
                      type="number"
                      value={editingListing.area}
                      onChange={(e) => setEditingListing({ ...editingListing, area: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* Legal & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">
                      Listing Status
                    </label>
                    <select
                      value={editingListing.status || 'active'}
                      onChange={(e) => setEditingListing({ ...editingListing, status: e.target.value as ListingStatus })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="urgent">Urgent</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingListing.hasCarta}
                        onChange={(e) => setEditingListing({ ...editingListing, hasCarta: e.target.checked })}
                        className="rounded text-blue-600 bg-slate-800 border-slate-700"
                      />
                      <span className="font-semibold text-emerald-400">ካርታ Title Deed Verified</span>
                    </label>
                  </div>
                </div>

                {/* Private Seller Info Section */}
                <div className="bg-[#050D1C] border border-emerald-900/60 p-3.5 rounded-xl space-y-2.5">
                  <div className="text-emerald-400 font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private Seller Info (Admin Only - Never Shown to Public)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Confidential</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold mb-1">Seller Name</label>
                      <input
                        type="text"
                        value={editingListing.sellerContact?.name || ''}
                        onChange={(e) => setEditingListing({
                          ...editingListing,
                          sellerContact: { ...editingListing.sellerContact, name: e.target.value }
                        })}
                        placeholder="e.g. Dawit Kebede"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold mb-1">Primary Phone</label>
                      <input
                        type="text"
                        value={editingListing.sellerContact?.phone || ''}
                        onChange={(e) => setEditingListing({
                          ...editingListing,
                          sellerContact: { ...editingListing.sellerContact, phone: e.target.value }
                        })}
                        placeholder="e.g. 0911223344"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold mb-1">Alternative Phone</label>
                      <input
                        type="text"
                        value={editingListing.sellerContact?.altPhone || ''}
                        onChange={(e) => setEditingListing({
                          ...editingListing,
                          sellerContact: { ...editingListing.sellerContact, altPhone: e.target.value }
                        })}
                        placeholder="e.g. 0922334455"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold mb-1">Telegram Username</label>
                      <input
                        type="text"
                        value={editingListing.sellerContact?.telegram || ''}
                        onChange={(e) => setEditingListing({
                          ...editingListing,
                          sellerContact: { ...editingListing.sellerContact, telegram: e.target.value }
                        })}
                        placeholder="e.g. @dawit_home"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editingListing.sellerContact?.email || ''}
                        onChange={(e) => setEditingListing({
                          ...editingListing,
                          sellerContact: { ...editingListing.sellerContact, email: e.target.value }
                        })}
                        placeholder="e.g. seller@gmail.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold mb-1">Preferred Contact</label>
                      <select
                        value={editingListing.sellerContact?.preferredContact || 'phone'}
                        onChange={(e) => setEditingListing({
                          ...editingListing,
                          sellerContact: { 
                            ...editingListing.sellerContact, 
                            preferredContact: e.target.value as 'phone' | 'whatsapp' | 'telegram' | 'any' 
                          }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="phone">Phone Call</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="telegram">Telegram</option>
                        <option value="any">Any Mode</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] font-semibold mb-1">Admin / Visiting Notes</label>
                    <input
                      type="text"
                      value={editingListing.sellerContact?.notes || ''}
                      onChange={(e) => setEditingListing({
                        ...editingListing,
                        sellerContact: { ...editingListing.sellerContact, notes: e.target.value }
                      })}
                      placeholder="e.g. Carta checked in land registry, owner available Sundays"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingListing.description}
                    onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateListing(editingListing);
                    setEditingListing(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-colors"
                >
                  Save Property Changes
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL 2: DELETE CONFIRMATION MODAL */}
        {deletingId && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0D182E] border border-red-800/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <h4 className="text-base font-bold text-white text-center">
                Delete This Property Listing?
              </h4>
              <p className="text-xs text-slate-300 text-center leading-relaxed">
                This will permanently remove the listing from the Charte Homes website. This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
