/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ChalkboardDisplay } from './components/ChalkboardDisplay';
import { Keypad } from './components/Keypad';
import { PedagogyModal } from './components/PedagogyModal';
import { SplashScreen } from './components/SplashScreen';
import { calculateAndBreakdown, CalculationBreakdown, MathOperation } from './utils/mathBreakdown';
import { isSoundEnabled, toggleSound, playChalkTap } from './utils/audio';

export default function App() {
  const [firstNum, setFirstNum] = useState<string>('');
  const [activeOp, setActiveOp] = useState<'+' | '-' | '×' | '÷' | null>(null);
  const [secondNum, setSecondNum] = useState<string>('');
  const [breakdown, setBreakdown] = useState<CalculationBreakdown | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [showPedagogy, setShowPedagogy] = useState<boolean>(false);
  const [chalkColor, setChalkColor] = useState<'white' | 'yellow' | 'cyan' | 'pink'>('white');
  const [isKeypadMinimized, setIsKeypadMinimized] = useState<boolean>(false);

  // Compute the current equation text displayed at the top of the blackboard
  const equationText = useMemo(() => {
    if (!firstNum && !activeOp && !secondNum) return '0';
    let text = firstNum || '0';
    if (activeOp) {
      text += ` ${activeOp} `;
      if (secondNum) {
        text += secondNum;
      }
    }
    return text;
  }, [firstNum, activeOp, secondNum]);

  // Handle digit input (0-9)
  const handleDigit = (digit: string) => {
    // If a breakdown was already showing, starting typing a new number starts fresh
    if (breakdown) {
      setBreakdown(null);
      setFirstNum(digit);
      setActiveOp(null);
      setSecondNum('');
      return;
    }

    if (activeOp === null) {
      // Typing first number (limit length to prevent overflowing)
      if (firstNum.length >= 6) return;
      if (firstNum === '0' && digit === '0') return;
      if (firstNum === '0' && digit !== '0') {
        setFirstNum(digit);
      } else {
        setFirstNum((prev) => prev + digit);
      }
    } else {
      // Typing second number
      if (secondNum.length >= 6) return;
      if (secondNum === '0' && digit === '0') return;
      if (secondNum === '0' && digit !== '0') {
        setSecondNum(digit);
      } else {
        setSecondNum((prev) => prev + digit);
      }
    }
  };

  // Handle operation (+ / - / × / ÷)
  const handleOperation = (op: '+' | '-' | '×' | '÷') => {
    if (breakdown) {
      // Continue chaining with previous result as firstNum
      const prevResult = breakdown.result;
      setBreakdown(null);
      setFirstNum(prevResult >= 0 ? String(prevResult) : '0');
      setActiveOp(op);
      setSecondNum('');
      return;
    }

    if (!firstNum) {
      setFirstNum('0');
    }
    setActiveOp(op);
  };

  // Handle equals (=) -> compute pedagogical breakdown and minimize keypad
  const handleEquals = () => {
    const a = parseInt(firstNum || '0', 10);
    const b = parseInt(secondNum || '0', 10);
    const op = activeOp || '+';

    const resultBreakdown = calculateAndBreakdown(a, op, b);
    setBreakdown(resultBreakdown);
    // Minimize keypad so the blackboard expands and the full breakdown is easily visible
    setIsKeypadMinimized(true);
  };

  // Handle backspace (⌫ / Regresar)
  const handleBackspace = () => {
    if (breakdown) {
      setBreakdown(null);
      return;
    }

    if (secondNum.length > 0) {
      setSecondNum((prev) => prev.slice(0, -1));
    } else if (activeOp !== null) {
      setActiveOp(null);
    } else if (firstNum.length > 0) {
      setFirstNum((prev) => prev.slice(0, -1));
    }
  };

  // Handle clear (C / Borrar)
  const handleClear = () => {
    setFirstNum('');
    setActiveOp(null);
    setSecondNum('');
    setBreakdown(null);
    setIsKeypadMinimized(false);
  };

  // Handle example presets
  const handlePreset = (a: number, op: '+' | '-' | '×' | '÷', b: number) => {
    setFirstNum(String(a));
    setActiveOp(op);
    setSecondNum(String(b));
    const resultBreakdown = calculateAndBreakdown(a, op, b);
    setBreakdown(resultBreakdown);
    setIsKeypadMinimized(true);
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleOpenKeypad = () => {
    playChalkTap(1.1);
    setIsKeypadMinimized(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen max-w-4xl mx-auto bg-[#131c26] text-stone-100 overflow-hidden select-none font-ui">
      {/* Top Header with Altair Branding */}
      <Header
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        onOpenHelp={() => setShowPedagogy(true)}
        onClearAll={handleClear}
      />

      {/* Main Split Layout: Expandable Blackboard and Collapsible Keypad */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* UPPER / EXPANDED SECTION: Green Chalkboard Display */}
        <section
          className={`w-full transition-all duration-300 ease-in-out flex flex-col min-h-0 ${
            isKeypadMinimized ? 'flex-1 h-full' : 'h-[38%] sm:h-[44%] shrink-0'
          }`}
        >
          <ChalkboardDisplay
            equationText={equationText}
            activeOperation={activeOp}
            breakdown={breakdown}
            isCalculating={false}
            onClear={handleClear}
            chalkColor={chalkColor}
            onChangeChalkColor={setChalkColor}
          />
        </section>

        {/* BOTTOM SECTION: Full Keypad OR Minimized Bar with Teclado (Left) and Nueva Operación (Right) */}
        {isKeypadMinimized ? (
          <div className="h-16 sm:h-18 w-full bg-[#0e1620] border-t border-[#1e344e] border-b-[16px] sm:border-b-[20px] border-[#2c1d12] px-4 sm:px-6 flex items-center justify-between relative shrink-0 shadow-2xl">
            {/* Left Side: Teclado Button (No icon, same size and shape) */}
            <button
              onClick={handleOpenKeypad}
              title="Abrir teclado de la calculadora"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 active:scale-95 text-white border border-cyan-400/40 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center justify-center"
            >
              Teclado
            </button>

            {/* Center: Subtle Indicator */}
            <span className="hidden sm:inline text-[11px] font-semibold text-cyan-300/50 uppercase tracking-wider text-center">
              Pizarra Ampliada
            </span>

            {/* Right Side: Nueva Operación Button (Same size and shape) */}
            <button
              onClick={handleClear}
              title="Nueva operación / Borrar pizarra"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#16273b] hover:bg-[#203652] active:scale-95 text-cyan-100 hover:text-white border border-cyan-500/30 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center justify-center"
            >
              Nueva Operación
            </button>
          </div>
        ) : (
          <section className="h-[62%] sm:h-[56%] flex-1 w-full bg-[#181a1f] border-t border-[#1e344e] shadow-2xl flex flex-col min-h-0 transition-all duration-300 ease-in-out">
            <Keypad
              onDigit={handleDigit}
              onOperation={handleOperation}
              onEquals={handleEquals}
              onBackspace={handleBackspace}
              onClear={handleClear}
              activeOperation={activeOp}
              onPreset={handlePreset}
            />
          </section>
        )}
      </main>

      {/* Pedagogical Explanation Modal */}
      <PedagogyModal
        isOpen={showPedagogy}
        onClose={() => setShowPedagogy(false)}
      />

      {/* Startup Altair Constellation Splash Screen */}
      <SplashScreen />
    </div>
  );
}
