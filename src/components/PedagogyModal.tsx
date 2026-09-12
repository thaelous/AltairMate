import React from 'react';
import { X, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { playEraserSound } from '../utils/audio';
import { AltairIcon } from './AltairIcon';

interface PedagogyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PedagogyModal: React.FC<PedagogyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-chalk-in select-none">
      <div className="relative w-full max-w-xl rounded-xl bg-[#121c29] border-2 border-[#1e344e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3 bg-[#0a121e] border-b border-[#1e344e] flex items-center justify-between font-ui">
          <div className="flex items-center gap-2.5">
            <AltairIcon size={26} glow />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <span className="text-cyan-300">Altair:</span>
              <span>Guía de Cálculo Mental</span>
            </h2>
          </div>
          <button
            onClick={() => {
              playEraserSound();
              onClose();
            }}
            className="p-1 rounded-md bg-[#16273b] hover:bg-[#203652] text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-stone-200 font-ui text-xs sm:text-sm chalk-scrollbar">
          {/* Introducción */}
          <div className="p-3.5 rounded-lg bg-black/40 border border-[#1e344e] text-cyan-100 flex items-center gap-3">
            <AltairIcon size={38} glow />
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span className="font-bold text-xs sm:text-sm text-cyan-300 uppercase tracking-wide">
                  Estrategias Visuales de Desglose
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-medium">
                Altair desglosa las operaciones en pasos simples para desarrollar la intuición matemática y la rapidez en el cálculo mental.
              </p>
            </div>
          </div>

          {/* 1. Método de Suma */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                Suma (+)
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Descomposición por Valor Posicional
              </h3>
            </div>
            <p className="text-xs text-stone-300 font-medium">
              Sumamos primero las centenas y decenas, luego las unidades y unimos los resultados:
            </p>
            <div className="p-2.5 rounded-lg chalk-board border border-white/15 space-y-1 text-xs font-chalk">
              <div className="text-yellow-200 font-bold font-ui text-[11px] uppercase tracking-wider">Ejemplo: 54 + 36</div>
              <div className="text-white">1. Decenas: 50 + 30 = 80</div>
              <div className="text-white">2. Unidades: 4 + 6 = 10</div>
              <div className="text-white">3. Unimos: 80 + 10 = 90</div>
              <div className="text-emerald-300 font-bold pt-0.5 border-t border-white/20">➔ 54 + 36 = 90</div>
            </div>
          </div>

          {/* 2. Método de Resta */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-700/60 text-amber-300 font-bold text-xs uppercase tracking-wider">
                Resta (−)
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Método del Salto / Complemento
              </h3>
            </div>
            <p className="text-xs text-stone-300 font-medium">
              Iniciamos en el número menor y damos saltos amigables hasta llegar al número meta:
            </p>
            <div className="p-2.5 rounded-lg chalk-board border border-white/15 space-y-1 text-xs font-chalk">
              <div className="text-yellow-200 font-bold font-ui text-[11px] uppercase tracking-wider">Ejemplo: 350 − 157</div>
              <div className="text-white">1. A la decena: 157 + 3 = 160 (+3)</div>
              <div className="text-white">2. A la centena: 160 + 40 = 200 (+40)</div>
              <div className="text-white">3. Al objetivo: 200 + 150 = 350 (+150)</div>
              <div className="text-white">4. Suma de saltos: 150 + 40 + 3 = 193</div>
              <div className="text-emerald-300 font-bold pt-0.5 border-t border-white/20">➔ 350 − 157 = 193</div>
            </div>
          </div>

          {/* 3. Método de Multiplicación */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-300 font-bold text-xs uppercase tracking-wider">
                Multiplicación (×)
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Descomposición Distributiva
              </h3>
            </div>
            <p className="text-xs text-stone-300 font-medium">
              Descomponemos en decenas y unidades, multiplicamos cada parte y sumamos los productos parciales:
            </p>
            <div className="p-2.5 rounded-lg chalk-board border border-white/15 space-y-1 text-xs font-chalk">
              <div className="text-yellow-200 font-bold font-ui text-[11px] uppercase tracking-wider">Ejemplo: 48 × 6</div>
              <div className="text-white">1. Descomponemos: 48 = 40 + 8</div>
              <div className="text-white">2. Decenas: 40 × 6 = 240</div>
              <div className="text-white">3. Unidades: 8 × 6 = 48</div>
              <div className="text-white">4. Sumamos parciales: 240 + 48 = 288</div>
              <div className="text-emerald-300 font-bold pt-0.5 border-t border-white/20">➔ 48 × 6 = 288</div>
            </div>
          </div>

          {/* 4. Método de División */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-700/60 text-sky-300 font-bold text-xs uppercase tracking-wider">
                División (÷)
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Cocientes Parciales y Partes Amigables
              </h3>
            </div>
            <p className="text-xs text-stone-300 font-medium">
              Extraemos múltiplos cómodos del divisor (por 10, 20, 100) y sumamos los cocientes:
            </p>
            <div className="p-2.5 rounded-lg chalk-board border border-white/15 space-y-1 text-xs font-chalk">
              <div className="text-yellow-200 font-bold font-ui text-[11px] uppercase tracking-wider">Ejemplo: 144 ÷ 6</div>
              <div className="text-white">1. Parte cómoda: 120 ÷ 6 = 20 (Quedan 24)</div>
              <div className="text-white">2. Resto: 24 ÷ 6 = 4</div>
              <div className="text-white">3. Sumamos cocientes: 20 + 4 = 24</div>
              <div className="text-emerald-300 font-bold pt-0.5 border-t border-white/20">➔ 144 ÷ 6 = 24</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a121e] border-t border-[#1e344e] text-center font-ui">
          <button
            onClick={() => {
              playEraserSound();
              onClose();
            }}
            className="w-full py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 active:scale-95 text-white font-bold tracking-wider uppercase text-xs sm:text-sm transition-all shadow-md"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};
