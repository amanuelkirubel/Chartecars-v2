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
    sm: { icon: 22, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 28, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 36, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 48, text: 'text-2xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size];

  // The distinctive CH monogram mark on its own — no card, no circle backing
  const Monogram = (
    <img
      src="/charte-logo.png"
      alt={brand === 'cars' ? 'Charte Cars' : 'Charte Homes'}
      className="shrink-0 object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
      style={{
        width: `${icon}px`,
        height: `${icon}px`,
      }}
      onError={(e) => {
        (e.target as HTMLElement).style.display = 'none';
      }}
    />
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
