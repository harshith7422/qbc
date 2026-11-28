import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'gold';
  showTagline?: boolean;
  tagline?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = true,
  tagline,
  className = '',
}) => {
  const iconSizes = {
    sm: 'h-8 w-auto',
    md: 'h-11 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Brand House & Lamp Logo Icon */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-xl ${
          isLight ? 'bg-white p-1.5 shadow-sm' : ''
        } transition-transform duration-200`}
      >
        <img
          src="/logo.png"
          alt="Blue Craft Logo"
          className={`${iconSizes[size]} object-contain`}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`font-serif tracking-wider font-bold uppercase ${textSizes[size]} ${
              isLight ? 'text-white' : 'text-brand-950'
            }`}
          >
            Blue Craft
          </span>
          <span
            className={`font-sans tracking-wider text-[0.6em] font-bold uppercase px-2 py-0.5 rounded-md ${
              isLight ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
            }`}
          >
            Design Studio
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[9px] tracking-widest uppercase font-semibold mt-0.5 ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            {tagline || 'Interior Design & Turnkey'}
          </span>
        )}
      </div>
    </div>
  );
};
