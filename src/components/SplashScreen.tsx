import React, { useEffect, useState, useMemo } from 'react';
import { AltairIcon } from './AltairIcon';

interface SplashScreenProps {
  onFinish?: () => void;
}

interface FloatingElement {
  id: number;
  symbol: string;
  x: number; // percentage
  y: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  direction: number; // angle or translate vector
  color: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [fading, setFading] = useState<boolean>(false);

  // Generate a fixed set of floating math symbols & numbers (0-9, +, -, ×, ÷)
  const floatingItems: FloatingElement[] = useMemo(() => {
    const symbols = [
      '7', '+', '3', '×', '9', '÷', '4', '−', '8', '2', '5', '+',
      '6', '×', '1', '÷', '0', '−', '8', '×', '4', '+', '9', '÷',
    ];
    const colors = [
      '#93c5fd', '#67e8f9', '#fef08a', '#fbcfe8', '#a7f3d0', '#ffffff', '#cbd5e1', '#38bdf8',
    ];

    return symbols.map((sym, idx) => {
      const angle = (idx / symbols.length) * 2 * Math.PI;
      const radius = 22 + ((idx * 17) % 38);
      const x = 50 + Math.cos(angle) * radius + ((idx % 3) - 1) * 6;
      const y = 50 + Math.sin(angle) * (radius * 0.8) + ((idx % 2) - 0.5) * 8;

      return {
        id: idx,
        symbol: sym,
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
        size: 20 + (idx % 4) * 8,
        duration: 8 + (idx % 6) * 2.5,
        delay: (idx % 7) * 0.5,
        opacity: 0.25 + (idx % 5) * 0.12,
        direction: (idx % 2 === 0 ? 1 : -1) * (10 + (idx % 4) * 6),
        color: colors[idx % colors.length],
      };
    });
  }, []);

  useEffect(() => {
    // Show for 3.2s, then start smooth fade out
    const timer = setTimeout(() => {
      setFading(true);
    }, 3200);

    // Completely unmount after fade transition (900ms)
    const removeTimer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 4100);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 400);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden transition-all duration-900 ease-out ${
        fading
          ? 'opacity-0 pointer-events-none scale-105 blur-sm'
          : 'opacity-100 scale-100 blur-0'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 38%, #0f2352 0%, #091536 45%, #04091a 80%, #02040b 100%)',
      }}
    >
      {/* Background Starfield with twinkling particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-15 pointer-events-none" />

      {/* Deep Nebula Glow around Altair Center */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[90px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-blue-600/20 blur-[70px] pointer-events-none" />

      {/* SVG: Constelación del Águila (Aquila Constellation sin textos) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="altairGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#7dd3fc" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>
          <filter id="starBloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Constellation Lines (Aquila / El Águila) */}
        <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45">
          {/* Head & Neck: Tarazed (450, 270) - Altair (500, 320) - Alshain (550, 370) */}
          <line x1="450" y1="270" x2="500" y2="320" />
          <line x1="500" y1="320" x2="550" y2="370" />

          {/* Body spine to Delta Aquilae (490, 480) & Lambda Aquilae (470, 680) */}
          <line x1="500" y1="320" x2="490" y2="480" />
          <line x1="490" y1="480" x2="470" y2="680" />

          {/* Left Wing to Zeta Aquilae (270, 360) and Epsilon Aquilae (210, 400) */}
          <line x1="500" y1="320" x2="350" y2="330" />
          <line x1="350" y1="330" x2="270" y2="360" />
          <line x1="270" y1="360" x2="210" y2="400" />

          {/* Right Wing to Theta Aquilae (730, 460) and Eta Aquilae (640, 420) */}
          <line x1="500" y1="320" x2="640" y2="420" />
          <line x1="640" y1="420" x2="730" y2="460" />
          <line x1="490" y1="480" x2="640" y2="420" />
          <line x1="490" y1="480" x2="350" y2="330" />
        </g>

        {/* Constellation Stars */}
        {/* Tarazed */}
        <circle cx="450" cy="270" r="5.5" fill="#fef08a" opacity="0.9" />
        {/* Alshain */}
        <circle cx="550" cy="370" r="5" fill="#fef08a" opacity="0.9" />
        {/* Zeta Aquilae */}
        <circle cx="270" cy="360" r="4.5" fill="#e0f2fe" opacity="0.8" />
        {/* Epsilon Aquilae */}
        <circle cx="210" cy="400" r="4" fill="#e0f2fe" opacity="0.8" />
        {/* Delta Aquilae */}
        <circle cx="490" cy="480" r="5" fill="#e0f2fe" opacity="0.85" />
        {/* Theta Aquilae */}
        <circle cx="730" cy="460" r="4.5" fill="#e0f2fe" opacity="0.8" />
        {/* Lambda Aquilae */}
        <circle cx="470" cy="680" r="4.5" fill="#e0f2fe" opacity="0.8" />

        {/* Main Star: ALTAIR (alpha Aquilae) */}
        <circle cx="500" cy="320" r="45" fill="url(#altairGlow)" />
        {/* Star Spikes */}
        <line x1="500" y1="230" x2="500" y2="410" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" filter="url(#starBloom)" />
        <line x1="410" y1="320" x2="590" y2="320" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" filter="url(#starBloom)" />
        <line x1="445" y1="265" x2="555" y2="375" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.7" />
        <line x1="445" y1="375" x2="555" y2="265" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.7" />
        {/* Star Core */}
        <circle cx="500" cy="320" r="9" fill="#ffffff" filter="url(#starBloom)" />
        <circle cx="500" cy="320" r="5" fill="#ffffff" />
      </svg>

      {/* Floating Math Numbers & Signs drifting slowly in background */}
      {floatingItems.map((item) => (
        <div
          key={item.id}
          className="absolute font-chalk pointer-events-none select-none transition-transform"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            color: item.color,
            opacity: item.opacity,
            textShadow: `0 0 12px ${item.color}88, 0 0 2px #fff`,
            animation: `floatDrift ${item.duration}s ease-in-out ${item.delay}s infinite alternate`,
            transform: `translateY(${item.direction}px)`,
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Central Hero Branding: Altair / por Robert Pacheco / Matemáticas rápidas. */}
      <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        {/* Radiant Star Icon */}
        <div className="relative mb-5 drop-shadow-[0_0_35px_rgba(56,189,248,0.7)] animate-bounce-subtle">
          <AltairIcon size={90} glow />
        </div>

        {/* Title line 1: Altair. with author credit */}
        <div className="relative flex flex-col items-center">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black tracking-widest uppercase font-ui drop-shadow-[0_2px_20px_rgba(56,189,248,0.6)]">
            Altair.
          </h1>
          <span className="self-end mr-1 sm:mr-3 -mt-1 sm:-mt-2 text-cyan-200/90 italic font-editorial text-base sm:text-lg md:text-xl tracking-wider drop-shadow-[0_2px_8px_rgba(2,132,199,0.5)] transform -rotate-3 select-none">
            por Robert Pacheco
          </span>
        </div>

        {/* Title line 2: Matemáticas rápidas. */}
        <p className="mt-4 text-cyan-200 text-lg sm:text-xl md:text-2xl font-bold tracking-wider font-ui drop-shadow-[0_2px_10px_rgba(2,132,199,0.5)]">
          Matemáticas rápidas.
        </p>
      </div>
    </div>
  );
};
