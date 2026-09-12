import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40, showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md select-none"
      >
        {/* Outer Circular Ring */}
        <circle cx="250" cy="250" r="240" fill="#153e75" stroke="#ffffff" strokeWidth="12" />
        <circle cx="250" cy="250" r="215" stroke="#ffffff" strokeWidth="5" strokeDasharray="none" />

        {/* Top Arc Text: LAS MATES */}
        <path
          id="topTextPath"
          d="M 80 250 A 170 170 0 0 1 420 250"
          fill="none"
        />
        <text
          fill="#ffffff"
          fontSize="48"
          fontWeight="900"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          letterSpacing="6"
        >
          <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
            LAS MATES
          </textPath>
        </text>

        {/* Stars on sides */}
        <polygon
          points="80,240 85,252 98,252 87,260 91,272 80,264 69,272 73,260 62,252 75,252"
          fill="#ffffff"
        />
        <polygon
          points="420,240 425,252 438,252 427,260 431,272 420,264 409,272 413,260 402,252 415,252"
          fill="#ffffff"
        />

        {/* Bottom Arc Text: DE ALDEBARÁN */}
        <path
          id="bottomTextPath"
          d="M 75 250 A 175 175 0 0 0 425 250"
          fill="none"
        />
        <text
          fill="#ffffff"
          fontSize="36"
          fontWeight="900"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          letterSpacing="4"
        >
          <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
            DE ALDEBARÁN
          </textPath>
        </text>

        {/* Center Character Puppet */}
        <g id="puppet-character">
          {/* Ears */}
          <ellipse cx="160" cy="275" rx="18" ry="24" fill="#f8c39b" stroke="#3d2112" strokeWidth="5" />
          <ellipse cx="340" cy="275" rx="18" ry="24" fill="#f8c39b" stroke="#3d2112" strokeWidth="5" />

          {/* Head Shape */}
          <ellipse cx="250" cy="285" rx="100" ry="92" fill="#f8c39b" stroke="#3d2112" strokeWidth="6" />

          {/* Hair Back & Sides */}
          <path
            d="M 145 250 C 130 200, 180 135, 250 135 C 320 135, 370 200, 355 250 C 350 220, 335 190, 310 180 C 330 205, 330 225, 315 240 C 310 200, 280 170, 250 170 C 220 170, 190 200, 185 240 C 170 225, 170 205, 190 180 C 165 190, 150 220, 145 250 Z"
            fill="#8e5832"
            stroke="#452410"
            strokeWidth="5"
          />

          {/* Spiky Hair Bangs */}
          <path
            d="M 155 230 Q 185 180 220 205 Q 235 175 260 200 Q 285 175 315 205 Q 335 190 345 230 Q 315 220 290 228 Q 260 215 235 228 Q 195 215 155 230 Z"
            fill="#a66a3e"
            stroke="#452410"
            strokeWidth="4"
          />

          {/* Eyebrows */}
          <path
            d="M 195 225 Q 220 210 235 220"
            stroke="#5c3418"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 305 225 Q 280 210 265 220"
            stroke="#5c3418"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Eye */}
          <ellipse cx="220" cy="245" rx="26" ry="32" fill="#ffffff" stroke="#2b1a0e" strokeWidth="4" />
          <ellipse cx="224" cy="247" rx="16" ry="20" fill="#2d7a46" />
          <ellipse cx="224" cy="247" rx="9" ry="12" fill="#122417" />
          <circle cx="228" cy="242" r="5" fill="#ffffff" />
          {/* Eyelid droop / expression */}
          <path d="M 194 235 Q 220 225 246 235" stroke="#3d2112" strokeWidth="4" fill="#f8c39b" />

          {/* Right Eye */}
          <ellipse cx="280" cy="245" rx="26" ry="32" fill="#ffffff" stroke="#2b1a0e" strokeWidth="4" />
          <ellipse cx="276" cy="247" rx="16" ry="20" fill="#2d7a46" />
          <ellipse cx="276" cy="247" rx="9" ry="12" fill="#122417" />
          <circle cx="272" cy="242" r="5" fill="#ffffff" />
          {/* Eyelid droop */}
          <path d="M 254 235 Q 280 225 306 235" stroke="#3d2112" strokeWidth="4" fill="#f8c39b" />

          {/* Big Round Button Nose */}
          <ellipse cx="250" cy="275" rx="24" ry="20" fill="#e99e74" stroke="#452410" strokeWidth="4.5" />
          {/* Nose highlight */}
          <ellipse cx="245" cy="270" rx="8" ry="5" fill="#fbd0b4" />

          {/* Freckles */}
          <circle cx="195" cy="275" r="2.5" fill="#ab6338" />
          <circle cx="205" cy="282" r="2.5" fill="#ab6338" />
          <circle cx="192" cy="288" r="2.5" fill="#ab6338" />
          <circle cx="295" cy="282" r="2.5" fill="#ab6338" />
          <circle cx="305" cy="275" r="2.5" fill="#ab6338" />
          <circle cx="308" cy="288" r="2.5" fill="#ab6338" />

          {/* Puppet Smile Mouth */}
          <path
            d="M 185 305 Q 250 345 315 305 Q 250 318 185 305 Z"
            fill="#9e2a2b"
            stroke="#3d2112"
            strokeWidth="5"
          />
          {/* Tongue inside mouth */}
          <path
            d="M 220 316 Q 250 305 280 316 Q 250 338 220 316 Z"
            fill="#d65a6a"
          />
          <path
            d="M 175 302 Q 185 305 188 312"
            stroke="#3d2112"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 325 302 Q 315 305 312 312"
            stroke="#3d2112"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {showText && (
        <span className="font-ui font-bold text-white tracking-wide uppercase text-sm sm:text-base">
          Las Mates de Aldebarán
        </span>
      )}
    </div>
  );
};
