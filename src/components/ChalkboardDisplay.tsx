import React, { useEffect, useState, useRef } from 'react';
import { CalculationBreakdown, MathOperation } from '../utils/mathBreakdown';
import { playChalkStroke, playSuccessChime, playEraserSound } from '../utils/audio';
import { RotateCcw, FastForward, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChalkboardDisplayProps {
  equationText: string;
  activeOperation: MathOperation | null;
  breakdown: CalculationBreakdown | null;
  isCalculating: boolean;
  onClear: () => void;
  chalkColor: 'white' | 'yellow' | 'cyan' | 'pink';
  onChangeChalkColor: (color: 'white' | 'yellow' | 'cyan' | 'pink') => void;
}

export const ChalkboardDisplay: React.FC<ChalkboardDisplayProps> = ({
  equationText,
  activeOperation,
  breakdown,
  onClear,
  chalkColor,
  onChangeChalkColor,
}) => {
  const [visibleStepCount, setVisibleStepCount] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  // When breakdown changes, initiate smooth handwriting step-by-step animation
  useEffect(() => {
    if (!breakdown || breakdown.steps.length === 0) {
      setVisibleStepCount(0);
      setIsAutoPlaying(false);
      return;
    }

    setVisibleStepCount(0);
    setIsAutoPlaying(true);

    let currentStep = 0;
    const totalSteps = breakdown.steps.length;

    const stepInterval = setInterval(() => {
      currentStep++;
      setVisibleStepCount(currentStep);
      playChalkStroke();

      if (currentStep >= totalSteps) {
        clearInterval(stepInterval);
        setIsAutoPlaying(false);
        playSuccessChime();

        confetti({
          particleCount: 30,
          spread: 55,
          origin: { y: 0.35 },
          colors: ['#38bdf8', '#fef08a', '#a5f3fc', '#fbcfe8', '#86efac', '#ffffff'],
          ticks: 90,
          gravity: 1.2,
          scalar: 0.75,
        });
      }
    }, 600);

    return () => {
      clearInterval(stepInterval);
    };
  }, [breakdown]);

  useEffect(() => {
    if (stepsContainerRef.current) {
      stepsContainerRef.current.scrollTo({
        top: stepsContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [visibleStepCount]);

  const handleReplay = () => {
    if (!breakdown) return;
    setVisibleStepCount(0);
    setIsAutoPlaying(true);

    let currentStep = 0;
    const totalSteps = breakdown.steps.length;

    const stepInterval = setInterval(() => {
      currentStep++;
      setVisibleStepCount(currentStep);
      playChalkStroke();

      if (currentStep >= totalSteps) {
        clearInterval(stepInterval);
        setIsAutoPlaying(false);
        playSuccessChime();
      }
    }, 550);
  };

  const handleShowAll = () => {
    if (!breakdown) return;
    setVisibleStepCount(breakdown.steps.length);
    setIsAutoPlaying(false);
    playChalkStroke();
  };

  const handleNextStep = () => {
    if (!breakdown || visibleStepCount >= breakdown.steps.length) return;
    setVisibleStepCount((prev) => prev + 1);
    playChalkStroke();
  };

  const getOperationHeadline = () => {
    if (!breakdown) {
      if (activeOperation === '+') return 'SUMANDO · INGRESA SEGUNDO NÚMERO';
      if (activeOperation === '-') return 'RESTANDO · INGRESA SEGUNDO NÚMERO';
      if (activeOperation === '×' || activeOperation === '*') return 'MULTIPLICANDO · INGRESA FACTOR';
      if (activeOperation === '÷' || activeOperation === '/') return 'DIVIDIENDO · INGRESA DIVISOR';
      return 'INGRESA NÚMEROS Y OPERACIÓN';
    }

    if (breakdown.operation === '+') return 'SUMA POR VALOR POSICIONAL';
    if (breakdown.operation === '-') return 'RESTA MEDIANTE SALTOS';
    if (breakdown.operation === '×' || breakdown.operation === '*') return 'MULTIPLICACIÓN DISTRIBUTIVA';
    if (breakdown.operation === '÷' || breakdown.operation === '/') return 'DIVISIÓN POR PARTES AMIGABLES';
    return 'DESGLOSE PASO A PASO';
  };

  const getResultTitle = () => {
    if (!breakdown) return 'RESULTADO';
    if (breakdown.operation === '+') return 'TOTAL DE LA SUMA';
    if (breakdown.operation === '-') return 'DIFERENCIA FINAL';
    if (breakdown.operation === '×' || breakdown.operation === '*') return 'PRODUCTO FINAL';
    if (breakdown.operation === '÷' || breakdown.operation === '/') return 'COCIENTE OBTENIDO';
    return 'RESULTADO FINAL';
  };

  const getStepAccentColor = (stepAccent?: string) => {
    switch (stepAccent) {
      case 'yellow': return 'text-yellow-200';
      case 'cyan': return 'text-cyan-200';
      case 'pink': return 'text-pink-200';
      case 'emerald': return 'text-emerald-300';
      default: return 'text-yellow-100';
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-3 select-none">
      {/* Chalkboard Slate with Authentic Wood Frame */}
      <div
        className={`relative flex-1 w-full rounded-xl chalk-board wood-frame overflow-hidden flex flex-col ${
          isErasing ? 'erasing-effect' : ''
        }`}
      >
        {/* Subtle noise layer */}
        <div className="absolute inset-0 chalk-board-noise pointer-events-none" />

        {/* Top bar inside the chalkboard */}
        <div className="relative z-10 px-3 sm:px-4 py-1.5 flex items-center justify-between border-b border-white/15 bg-black/30 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="font-ui text-[11px] sm:text-xs font-semibold tracking-wider text-cyan-300 uppercase truncate">
              {breakdown ? breakdown.methodName : 'Pizarra de Desglose Mental'}
            </span>
          </div>

          {breakdown && (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={handleReplay}
                disabled={isAutoPlaying}
                title="Repetir animación paso a paso"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-900/80 hover:bg-stone-800 active:scale-95 text-[11px] sm:text-xs font-ui font-medium text-amber-200 border border-white/15 transition-all disabled:opacity-40"
              >
                <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Repetir</span>
              </button>

              {visibleStepCount < breakdown.steps.length && (
                <>
                  <button
                    onClick={handleNextStep}
                    title="Ver siguiente paso"
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-[11px] sm:text-xs font-ui font-medium text-white border border-emerald-500/50 transition-all"
                  >
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Paso</span>
                  </button>
                  <button
                    onClick={handleShowAll}
                    title="Mostrar todos los pasos"
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-900/80 hover:bg-stone-800 active:scale-95 text-[11px] sm:text-xs font-ui font-medium text-cyan-200 border border-white/15 transition-all"
                  >
                    <FastForward className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Todo</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Main Blackboard Canvas */}
        <div className="relative z-10 flex-1 flex flex-col md:flex-row p-2.5 sm:p-4 overflow-hidden gap-3 sm:gap-4 min-h-0">
          {/* Main Equation Panel (Compact left column to maximize space for steps) */}
          <div className="w-full md:w-1/3 lg:w-[28%] flex flex-col justify-center items-center pb-2 md:pb-0 md:pr-3 md:border-r border-b md:border-b-0 border-white/15 shrink-0">
            <div className="chalk-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center tracking-wide text-white drop-shadow-md break-words max-w-full px-2">
              {equationText || '0'}
            </div>
            <div className="h-0.5 w-20 sm:w-28 bg-white/40 my-2 rounded" />
            <div className="font-ui text-[10px] sm:text-xs font-bold text-cyan-200 tracking-wider uppercase text-center flex items-center gap-1.5 justify-center px-1">
              <Sparkles className="w-3 h-3 text-cyan-300 shrink-0" />
              <span className="break-words text-center leading-snug">{getOperationHeadline()}</span>
            </div>
          </div>

          {/* Process Decomposition Panel (Expanded full width) */}
          <div
            ref={stepsContainerRef}
            className="flex-1 w-full min-w-0 overflow-y-auto chalk-scrollbar md:pl-2 flex flex-col justify-start space-y-2.5 min-h-0"
          >
            {breakdown ? (
              <div className="space-y-2.5 py-1 w-full">
                {breakdown.steps.slice(0, visibleStepCount).map((step, idx) => {
                  const isLast = idx === breakdown.steps.length - 1;

                  if (isLast) {
                    return (
                      <div
                        key={step.id}
                        className="animate-chalk-in pt-3 border-t-2 border-white/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/50 p-3 sm:p-4 rounded-xl shadow-lg border border-yellow-400/20 w-full"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-ui text-xs sm:text-sm font-bold text-amber-200 tracking-wide uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                            <span>{getResultTitle()}</span>
                          </div>
                          <div className="text-xs sm:text-sm text-stone-200 font-ui font-medium mt-1 leading-relaxed break-words">
                            {step.explanation}
                          </div>
                        </div>

                        <div className="chalk-text text-xl sm:text-2xl md:text-3xl font-extrabold text-yellow-200 bg-black/80 px-4 py-2 rounded-xl border-2 border-yellow-300/50 shadow-xl flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span>
                            {breakdown.remainder !== undefined && breakdown.remainder > 0
                              ? `= ${breakdown.result} (r: ${breakdown.remainder})`
                              : `= ${breakdown.result}`}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={step.id}
                      className="animate-chalk-in flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 shadow-sm w-full"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="font-ui font-bold text-[10px] sm:text-xs text-emerald-300 tracking-wide uppercase shrink-0 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                            {step.badge ? step.badge : `PASO ${idx + 1}`}
                          </span>
                          <span className="font-ui text-xs sm:text-sm text-stone-100 font-medium break-words leading-relaxed">
                            {step.explanation}
                          </span>
                        </div>
                      </div>

                      <div className={`chalk-text text-base sm:text-lg md:text-xl font-bold tracking-wider shrink-0 self-end sm:self-center break-normal text-right ${getStepAccentColor(step.accent)}`}>
                        {step.chalkText}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-3 text-stone-200">
                <p className="text-xs sm:text-sm text-white font-semibold font-ui">
                  Altair desglosa cada operación en pasos claros para el cálculo mental:
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-ui max-w-lg w-full">
                  <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-emerald-300 font-medium text-left">
                    <span className="font-bold text-white block">Suma (+)</span>
                    50 + 30 = 80, 4 + 6 = 10 ➔ 90
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-amber-300 font-medium text-left">
                    <span className="font-bold text-white block">Resta (−)</span>
                    157 + 3 = 160 ➔ Saltos hasta 350
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-purple-300 font-medium text-left">
                    <span className="font-bold text-white block">Multiplicación (×)</span>
                    48 × 6 = (40 × 6) + (8 × 6) ➔ 288
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-sky-300 font-medium text-left">
                    <span className="font-bold text-white block">División (÷)</span>
                    144 ÷ 6 = (120 ÷ 6) + (24 ÷ 6) ➔ 24
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Tray inside Frame */}
        <div className="relative z-10 h-6 bg-[#261a10] flex items-center justify-between px-3 border-t border-[#3d2918]">
          <div className="flex items-center gap-1.5">
            <span className="font-editorial text-[10px] text-amber-200/60 uppercase tracking-widest">Tiza:</span>
            <button
              onClick={() => {
                playChalkStroke();
                onChangeChalkColor('white');
              }}
              title="Tiza Blanca"
              className={`w-4 h-2 rounded-xs bg-white transition-transform ${
                chalkColor === 'white' ? 'scale-125 ring-1 ring-cyan-400' : 'opacity-60'
              }`}
            />
            <button
              onClick={() => {
                playChalkStroke();
                onChangeChalkColor('yellow');
              }}
              title="Tiza Amarilla"
              className={`w-4 h-2 rounded-xs bg-yellow-200 transition-transform ${
                chalkColor === 'yellow' ? 'scale-125 ring-1 ring-cyan-400' : 'opacity-60'
              }`}
            />
            <button
              onClick={() => {
                playChalkStroke();
                onChangeChalkColor('cyan');
              }}
              title="Tiza Celeste"
              className={`w-4 h-2 rounded-xs bg-cyan-200 transition-transform ${
                chalkColor === 'cyan' ? 'scale-125 ring-1 ring-cyan-400' : 'opacity-60'
              }`}
            />
            <button
              onClick={() => {
                playChalkStroke();
                onChangeChalkColor('pink');
              }}
              title="Tiza Rosada"
              className={`w-4 h-2 rounded-xs bg-pink-200 transition-transform ${
                chalkColor === 'pink' ? 'scale-125 ring-1 ring-cyan-400' : 'opacity-60'
              }`}
            />
          </div>

          <button
            onClick={() => {
              setIsErasing(true);
              playEraserSound();
              setTimeout(() => {
                onClear();
                setIsErasing(false);
              }, 250);
            }}
            className="flex items-center gap-1 text-stone-400 hover:text-stone-200 text-[10px] font-editorial tracking-wider uppercase transition-colors"
          >
            <div className="w-3 h-1.5 bg-stone-600 rounded-xs" />
            <span>Borrador</span>
          </button>
        </div>
      </div>
    </div>
  );
};
