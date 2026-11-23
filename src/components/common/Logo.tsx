import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'gold';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Architectural Geometric Monogram Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-lg ${
          isLight ? 'bg-white/10 text-white border border-white/20' : 'bg-brand-900 text-accent-gold shadow-sm'
        } transition-transform duration-200`}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-3/5 h-3/5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer drafting frame */}
          <rect x="4" y="4" width="32" height="32" rx="4" className={isLight ? 'stroke-white/80' : 'stroke-accent-gold'} />
          {/* Architectural intersecting layout lines */}
          <path d="M4 16H22V36" className={isLight ? 'stroke-white/90' : 'stroke-accent-goldLight'} />
          <path d="M22 24H36" className={isLight ? 'stroke-white/70' : 'stroke-amber-300'} />
          <path d="M12 4V16" className={isLight ? 'stroke-white/60' : 'stroke-accent-gold'} />
          {/* Compass dot */}
          <circle cx="22" cy="16" r="1.8" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif tracking-wider font-bold uppercase ${textSizes[size]} ${
              isLight ? 'text-white' : 'text-brand-900'
            }`}
          >
            Blue Craft
          </span>
          <span
            className={`font-sans tracking-widest text-[0.65em] font-medium uppercase px-1 py-0.5 rounded ${
              isLight ? 'bg-white/15 text-white/90' : 'bg-stone-200/80 text-brand-800'
            }`}
          >
            Studio
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[9px] tracking-widest uppercase font-medium ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Interior Design & Turnkey
          </span>
        )}
      </div>
    </div>
  );
};
