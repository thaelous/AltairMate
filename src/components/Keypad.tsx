import React, { useEffect } from 'react';
import { Delete, Plus, Minus, Equal, X, Divide } from 'lucide-react';
import { playChalkTap } from '../utils/audio';
import { MathOperation } from '../utils/mathBreakdown';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperation: (op: '+' | '-' | '×' | '÷') => void;
  onEquals: () => void;
  onBackspace: () => void;
  onClear: () => void;
  activeOperation: '+' | '-' | '×' | '÷' | null;
  onPreset: (a: number, op: '+' | '-' | '×' | '÷', b: number) => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onOperation,
  onEquals,
  onBackspace,
  onClear,
  activeOperation,
  onPreset,
}) => {
  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        playChalkTap(1);
        onDigit(e.key);
      } else if (e.key === '+') {
        playChalkTap(1.2);
        onOperation('+');
      } else if (e.key === '-') {
        playChalkTap(1.2);
        onOperation('-');
      } else if (e.key === '*' || e.key.toLowerCase() === 'x') {
        playChalkTap(1.2);
        onOperation('×');
      } else if (e.key === '/') {
        playChalkTap(1.2);
        onOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        playChalkTap(1.5);
        onEquals();
      } else if (e.key === 'Backspace') {
        playChalkTap(0.9);
        onBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        playChalkTap(0.8);
        onClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDigit, onOperation, onEquals, onBackspace, onClear]);

  const handlePress = (callback: () => void, pitch = 1) => {
    playChalkTap(pitch);
    callback();
  };

  return (
    <div className="w-full h-full bg-[#181a1f] border-b-[16px] sm:border-b-[20px] border-[#2c1d12] shadow-[inset_0_4px_8px_rgba(0,0,0,0.5),0_-4px_12px_rgba(0,0,0,0.4)] px-3 sm:px-4 pt-2 sm:pt-3 pb-2 sm:pb-2.5 flex flex-col justify-between gap-2 select-none font-ui">
      {/* Main Calculator Grid: 4 columns x 5 rows */}
      <div className="flex-1 grid grid-cols-4 grid-rows-5 gap-1.5 sm:gap-2.5 min-h-0">
        {/* ROW 1: C, BORRAR (⌫), ÷, × */}
        <button
          onClick={() => handlePress(onClear, 0.8)}
          title="Borrar todo (C)"
          className="key-button bg-red-900/90 hover:bg-red-800 border-b-4 border-red-950 rounded-xl flex flex-col items-center justify-center text-white font-bold"
        >
          <span className="text-xl sm:text-2xl font-extrabold leading-none">C</span>
          <span className="text-[8px] sm:text-[9px] uppercase font-bold text-red-200 mt-0.5">TODO</span>
        </button>

        <button
          onClick={() => handlePress(onBackspace, 0.9)}
          title="Borrar último dígito"
          className="key-button bg-amber-800/90 hover:bg-amber-700 border-b-4 border-amber-950 rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-md"
        >
          <Delete className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-200">BORRAR</span>
        </button>

        <button
          onClick={() => handlePress(() => onOperation('÷'), 1.2)}
          title="Dividir (÷)"
          className={`key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold transition-all ${
            activeOperation === '÷'
              ? 'bg-sky-600 border-b-4 border-sky-950 ring-2 ring-sky-300'
              : 'bg-[#2b3542] hover:bg-[#384556]'
          }`}
        >
          <Divide className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
        </button>

        <button
          onClick={() => handlePress(() => onOperation('×'), 1.2)}
          title="Multiplicar (×)"
          className={`key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold transition-all ${
            activeOperation === '×'
              ? 'bg-purple-600 border-b-4 border-purple-950 ring-2 ring-purple-300'
              : 'bg-[#2b3542] hover:bg-[#384556]'
          }`}
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
        </button>

        {/* ROW 2: 7, 8, 9, - */}
        <button
          onClick={() => handlePress(() => onDigit('7'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          7
        </button>
        <button
          onClick={() => handlePress(() => onDigit('8'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          8
        </button>
        <button
          onClick={() => handlePress(() => onDigit('9'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          9
        </button>
        <button
          onClick={() => handlePress(() => onOperation('-'), 1.2)}
          title="Restar (-)"
          className={`key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold transition-all ${
            activeOperation === '-'
              ? 'bg-amber-600 border-b-4 border-amber-950 ring-2 ring-amber-300'
              : 'bg-[#2b3542] hover:bg-[#384556]'
          }`}
        >
          <Minus className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
        </button>

        {/* ROW 3: 4, 5, 6, + */}
        <button
          onClick={() => handlePress(() => onDigit('4'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          4
        </button>
        <button
          onClick={() => handlePress(() => onDigit('5'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          5
        </button>
        <button
          onClick={() => handlePress(() => onDigit('6'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          6
        </button>
        <button
          onClick={() => handlePress(() => onOperation('+'), 1.2)}
          title="Sumar (+)"
          className={`key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold transition-all ${
            activeOperation === '+'
              ? 'bg-emerald-600 border-b-4 border-emerald-950 ring-2 ring-emerald-300'
              : 'bg-[#2b3542] hover:bg-[#384556]'
          }`}
        >
          <Plus className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
        </button>

        {/* ROW 4: 1, 2, 3, 0 */}
        <button
          onClick={() => handlePress(() => onDigit('1'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          1
        </button>
        <button
          onClick={() => handlePress(() => onDigit('2'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          2
        </button>
        <button
          onClick={() => handlePress(() => onDigit('3'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          3
        </button>
        <button
          onClick={() => handlePress(() => onDigit('0'), 1.0)}
          className="key-button rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold hover:bg-[#333]"
        >
          0
        </button>

        {/* ROW 5: = DESGLOSAR (col-span-4 prominent bar) */}
        <button
          onClick={() => handlePress(onEquals, 1.4)}
          title="Desglosar paso a paso en la pizarra"
          className="key-button bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-950 col-span-4 rounded-xl flex items-center justify-center text-white gap-2 sm:gap-3 shadow-lg group active:scale-[0.98]"
        >
          <Equal className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3.5] text-emerald-100 group-hover:scale-110 transition-transform" />
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-white">
            Desglosar Operación
          </span>
        </button>
      </div>

      {/* Quick Example Presets Bar (Including +, -, ×, ÷) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar shrink-0 border-t border-white/10">
        <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0">
          Ejemplos:
        </span>
        <button
          onClick={() => handlePress(() => onPreset(54, '+', 36), 1.1)}
          className="px-2.5 py-0.5 rounded-md bg-[#252830] hover:bg-[#323642] active:scale-95 text-stone-200 border border-white/10 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
        >
          54 + 36
        </button>
        <button
          onClick={() => handlePress(() => onPreset(350, '-', 157), 1.1)}
          className="px-2.5 py-0.5 rounded-md bg-[#252830] hover:bg-[#323642] active:scale-95 text-stone-200 border border-white/10 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
        >
          350 − 157
        </button>
        <button
          onClick={() => handlePress(() => onPreset(48, '×', 6), 1.1)}
          className="px-2.5 py-0.5 rounded-md bg-[#252830] hover:bg-[#323642] active:scale-95 text-purple-200 border border-purple-500/30 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
        >
          48 × 6
        </button>
        <button
          onClick={() => handlePress(() => onPreset(24, '×', 15), 1.1)}
          className="px-2.5 py-0.5 rounded-md bg-[#252830] hover:bg-[#323642] active:scale-95 text-purple-200 border border-purple-500/30 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
        >
          24 × 15
        </button>
        <button
          onClick={() => handlePress(() => onPreset(144, '÷', 6), 1.1)}
          className="px-2.5 py-0.5 rounded-md bg-[#252830] hover:bg-[#323642] active:scale-95 text-sky-200 border border-sky-500/30 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
        >
          144 ÷ 6
        </button>
        <button
          onClick={() => handlePress(() => onPreset(485, '÷', 5), 1.1)}
          className="px-2.5 py-0.5 rounded-md bg-[#252830] hover:bg-[#323642] active:scale-95 text-sky-200 border border-sky-500/30 text-xs font-semibold whitespace-nowrap shrink-0 transition-all"
        >
          485 ÷ 5
        </button>
      </div>

      {/* Footer Branding */}
      <div className="flex justify-between items-center text-stone-400 text-[10px] sm:text-xs font-medium px-1 shrink-0">
        <span className="text-cyan-400/80">Altair · Cálculo Mental</span>
        <span>Paso a Paso</span>
      </div>
    </div>
  );
};
