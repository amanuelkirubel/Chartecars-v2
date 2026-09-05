import React from 'react';

interface CharteLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  brand?: 'homes' | 'cars';
}

export const CharteLogo: React.FC<CharteLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtitle = false,
  brand = 'homes',
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 42, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 54, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-3xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size];

  // The distinctive CH monogram emblem: silver/white metallic monogram inside a ring
  const Monogram = (
    <div 
      className="relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-lg shadow-blue-950/40 border border-blue-400/20 bg-[#0B3B95]"
      style={{ 
        width: `${icon}px`, 
        height: `${icon}px`,
      }}
    >
      <img
        src="/charte-logo.png"
        alt={brand === 'cars' ? 'Charte Cars' : 'Charte Homes'}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{Monogram}</div>;
  }

  const brandName = brand === 'cars' ? 'Charte Cars' : 'Charte Homes';
  const subtitle = brand === 'cars' ? 'Automobile Marketplace · Ethiopia' : 'Ethiopian Real Estate';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {Monogram}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span 
            className={`font-serif italic font-semibold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] ${text}`}
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {brandName}
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-sans tracking-wider uppercase text-blue-200/70 font-medium ${sub}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
