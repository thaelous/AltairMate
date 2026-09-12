import React from 'react';

interface AltairIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const AltairIcon: React.FC<AltairIconProps> = ({
  className = '',
  size = 28,
  glow = false,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {glow && (
        <div
          className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-sm pointer-events-none animate-pulse"
          style={{ width: size + 8, height: size + 8 }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm select-none"
      >
        <defs>
          <radialGradient id="altairCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#c7f9ff" />
            <stop offset="70%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>
          <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit / Constellation ring */}
        <circle cx="50" cy="50" r="44" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.4" />
        <circle cx="50" cy="50" r="34" stroke="#a5f3fc" strokeWidth="1" opacity="0.25" />

        {/* 8-pointed Radiant Star (Altair, alpha Aquilae) */}
        {/* Primary vertical and horizontal rays */}
        <polygon
          points="50,4 54,42 96,50 54,58 50,96 46,58 4,50 46,42"
          fill="url(#altairCore)"
          filter="url(#starGlow)"
        />

        {/* Diagonal secondary rays */}
        <polygon
          points="50,22 53,44 78,50 53,56 50,78 47,56 22,50 47,44"
          fill="#ffffff"
          opacity="0.85"
          transform="rotate(45 50 50)"
        />

        {/* Aquila Triad companion stars (Tarazed and Alshain on sides) */}
        <circle cx="28" cy="38" r="3.5" fill="#fef08a" opacity="0.9" />
        <line x1="28" y1="38" x2="50" y2="50" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

        <circle cx="72" cy="62" r="3" fill="#fef08a" opacity="0.9" />
        <line x1="50" y1="50" x2="72" y2="62" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

        {/* Central brilliant spark */}
        <circle cx="50" cy="50" r="5" fill="#ffffff" />
      </svg>
    </div>
  );
};
