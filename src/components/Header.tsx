import React from 'react';
import { Volume2, VolumeX, BookOpen, Trash2 } from 'lucide-react';
import { playEraserSound, playChalkTap } from '../utils/audio';
import { AltairIcon } from './AltairIcon';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onClearAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  onClearAll,
}) => {
  return (
    <header className="h-14 w-full bg-[#0b131f] border-b border-[#1e344e] px-3 sm:px-5 flex items-center justify-between shadow-md z-20 shrink-0 select-none font-ui">
      {/* Brand Title with Altair Star */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <AltairIcon size={26} glow />
        <h1 className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap drop-shadow-sm flex items-center gap-1.5">
          <span className="text-cyan-300">Altair.</span>
          <span className="text-slate-100">Matemáticas Rápidas.</span>
        </h1>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            playChalkTap(1.2);
            onOpenHelp();
          }}
          title="¿Cómo funciona el desglose mental?"
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#122033] hover:bg-[#1a2f4c] active:scale-95 text-cyan-100 border border-[#234568] text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Guía Pedagógica</span>
        </button>

        <button
          onClick={() => {
            playChalkTap(0.9);
            onToggleSound();
          }}
          title={soundEnabled ? 'Silenciar sonidos de tiza' : 'Activar sonidos de tiza'}
          className={`p-1.5 rounded-md border transition-all active:scale-95 ${
            soundEnabled
              ? 'bg-[#15344f] border-cyan-500/40 text-cyan-300 hover:bg-[#1b4366]'
              : 'bg-[#122033] border-[#234568] text-slate-400 hover:bg-[#1a2f4c]'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => {
            playEraserSound();
            onClearAll();
          }}
          title="Borrar pizarra por completo"
          className="p-1.5 rounded-md bg-[#122033] hover:bg-red-950/60 hover:text-red-300 hover:border-red-800/60 active:scale-95 text-slate-300 border border-[#234568] transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
