import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface DownloadAppBannerProps {
  onOpenDownload: () => void;
  lang: Language;
}

export const DownloadAppBanner: React.FC<DownloadAppBannerProps> = ({
  onOpenDownload,
  lang,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Hide if already running inside installed standalone app
    const standalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
  }, []);

  if (dismissed || isStandalone) return null;

  return (
    <div className="bg-gradient-to-r from-[#001A4E] via-[#003399] to-[#001A4E] text-white py-2 px-4 border-b border-blue-400/30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        
        {/* Left message with icon */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-blue-500/30 border border-blue-300/40 flex items-center justify-center shrink-0">
            <Smartphone className="w-3.5 h-3.5 text-blue-200" />
          </div>
          <p className="truncate">
            <span className="font-bold text-white">Charte Cars App: </span>
            <span className="text-blue-100/90 hidden sm:inline">
              {lang === 'am' 
                ? 'በስልክዎ ወይም በኮምፒውተርዎ ላይ አውርደው በፍጥነት ይጠቀሙ!' 
                : 'Download on your mobile phone or desktop for instant speed and offline browsing!'}
            </span>
            <span className="text-blue-100 sm:hidden">
              {lang === 'am' ? 'መተግበሪያውን ያውርዱ' : 'Download the App'}
            </span>
          </p>
        </div>

        {/* Action button & dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenDownload}
            className="bg-white hover:bg-blue-50 text-[#001A4E] text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#003399]" />
            <span>{lang === 'am' ? 'አውርድ' : 'Download App'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-blue-200 hover:text-white rounded transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
