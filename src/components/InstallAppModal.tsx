import React, { useState, useEffect } from 'react';
import { Download, Share2, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Detect if already installed as standalone
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Capture browser install prompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalledSuccessfully(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
    setDeferredPrompt(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#09152C] border border-blue-900/60 rounded-3xl shadow-2xl p-6 sm:p-7 z-10 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Logo & Header */}
        <div className="flex items-center gap-3.5">
          <img
            src="/icon-192.png"
            alt="Charte Homes App Icon"
            className="w-14 h-14 rounded-2xl shadow-xl shadow-blue-600/20 border border-blue-500/30 object-cover"
          />
          <div>
            <h3 
              className="text-xl font-bold text-white font-serif"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Charte Homes App
            </h3>
            <p className="text-xs text-blue-300 font-medium">
              {lang === 'am' ? 'የሞባይል መተግበሪያ' : 'Install on Mobile & Desktop'}
            </p>
          </div>
        </div>

        {installedSuccessfully ? (
          <div className="bg-emerald-950/70 border border-emerald-800 text-emerald-300 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
            <div className="text-xs">
              <strong className="block text-sm text-white">Installed Successfully!</strong>
              Charte Homes is now ready on your home screen.
            </div>
          </div>
        ) : isStandalone ? (
          <div className="bg-blue-950/60 border border-blue-800 text-blue-200 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-blue-400" />
            <div className="text-xs">
              <strong className="block text-sm text-white">App is Installed!</strong>
              You are currently viewing Charte Homes in standalone app mode.
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-300 leading-relaxed">
              Install Charte Homes as a fast, offline-capable application on your Android phone, iPhone, tablet, or laptop. No download from Play Store or App Store required!
            </p>

            {/* Android / Desktop Chrome Button */}
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Download className="w-5 h-5" />
                <span>{lang === 'am' ? 'መተግበሪያውን ጫን' : 'Install Charte Homes Now'}</span>
              </button>
            ) : isIOS ? (
              /* iOS Safari Instructions */
              <div className="bg-[#050D1D] border border-blue-900/60 rounded-2xl p-4 text-xs text-slate-300 space-y-3">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>How to install on iPhone & iPad:</span>
                </div>
                <ol className="space-y-2 list-decimal list-inside text-[11px] text-slate-300">
                  <li>Tap the <Share2 className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> <strong>Share</strong> button at the bottom of Safari.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (ወደ መነሻ ገጽ አክል).</li>
                  <li>Tap <strong>"Add"</strong> in the top-right corner.</li>
                </ol>
              </div>
            ) : (
              /* Generic Chrome / Edge Instructions */
              <div className="bg-[#050D1D] border border-blue-900/60 rounded-2xl p-4 text-xs text-slate-300 space-y-2.5">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Quick Install Instructions:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In your browser menu (the 3 dots &#8942; at top right), tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> to pin Charte Homes directly to your phone or desktop.
                </p>
              </div>
            )}

            {/* Perks list */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Fast 1-click launch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Full-screen app view</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Offline caching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Lightweight (~50KB)</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
