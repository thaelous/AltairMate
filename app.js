/**
 * Altair - Matemáticas Rápidas
 * Motor JavaScript Estándar (Vanilla Web / Sin dependencias externas)
 */

(function () {
  'use strict';

  // ==========================================
  // 1. Audio Engine (Web Audio API)
  // ==========================================
  let audioCtx = null;
  let soundEnabled = true;

  function getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playChalkTap(pitch) {
    pitch = pitch || 1;
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      const bufferSize = ctx.sampleRate * 0.03;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 2400;
      noiseFilter.Q.value = 3;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.06);
      noise.stop(now + 0.04);
    } catch (e) {
      // Ignore audio error if not permitted yet
    }
  }

  function playChalkStroke() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.12 + Math.random() * 0.08;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800 + Math.random() * 600, now);
      filter.Q.value = 2.5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration + 0.02);
    } catch (e) {}
  }

  function playEraserSound() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.28;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(300, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration + 0.02);
    } catch (e) {}
  }

  function playSuccessChime() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.09, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.55);
      });
    } catch (e) {}
  }

  // ==========================================
  // 2. Pure Canvas Confetti Burst
  // ==========================================
  function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#38bdf8', '#fef08a', '#a5f3fc', '#fbcfe8', '#86efac', '#ffffff'];
    const particles = [];
    const count = 45;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width * 0.5,
        y: canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 8 - 4,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        opacity: 1,
        life: 1,
      });
    }

    let animationFrame;
    const startTime = Date.now();

    function renderConfetti() {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.rotation += p.rotationSpeed;
        p.life -= 0.015;

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive && elapsed < 2200) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    renderConfetti();
  }

  // ==========================================
  // 3. Mathematical Pedagogical Breakdown
  // ==========================================
  function breakdownAddition(a, b) {
    const result = a + b;
    const steps = [];

    if (a === 0 && b === 0) {
      steps.push({
        chalkText: '0 + 0 = 0',
        explanation: 'El cero no agrega ninguna cantidad',
        category: 'final',
        accent: 'yellow',
        badge: 'Resultado',
      });
      return {
        num1: a,
        num2: b,
        operation: '+',
        result: result,
        steps: steps,
        methodName: 'Descomposición Posicional',
      };
    }

    if (a < 10 && b < 10) {
      if (a + b >= 10 && a > 0 && b > 0) {
        const compToTen = 10 - a;
        const remainder = b - compToTen;
        if (compToTen > 0 && remainder >= 0) {
          steps.push({
            chalkText: a + ' + ' + compToTen + ' = 10',
            explanation: 'Completamos ' + a + ' a la decena (+' + compToTen + ')',
            category: 'partial',
            accent: 'cyan',
            badge: 'Paso 1',
          });
          if (remainder > 0) {
            steps.push({
              chalkText: '10 + ' + remainder + ' = ' + result,
              explanation: 'Sumamos lo que sobra (+' + remainder + ')',
              category: 'partial',
              accent: 'yellow',
              badge: 'Paso 2',
            });
          }
        }
      }
      steps.push({
        chalkText: a + ' + ' + b + ' = ' + result,
        explanation: '¡Resultado final obtenido!',
        category: 'final',
        accent: 'emerald',
        badge: 'Total',
      });
      return {
        num1: a,
        num2: b,
        operation: '+',
        result: result,
        steps: steps,
        methodName: 'Descomposición y Amigos del 10',
      };
    }

    const maxVal = Math.max(a, b);
    const places = [];
    if (maxVal >= 1000) places.push({ name: 'Millares', multiplier: 1000 });
    if (maxVal >= 100) places.push({ name: 'Centenas', multiplier: 100 });
    if (maxVal >= 10) places.push({ name: 'Decenas', multiplier: 10 });
    places.push({ name: 'Unidades', multiplier: 1 });

    const partials = [];
    places.forEach((p, idx) => {
      let partA = 0;
      let partB = 0;
      if (p.multiplier === 1) {
        partA = a % 10;
        partB = b % 10;
      } else {
        partA = Math.floor((a % (p.multiplier * 10)) / p.multiplier) * p.multiplier;
        partB = Math.floor((b % (p.multiplier * 10)) / p.multiplier) * p.multiplier;
      }

      if (partA > 0 || partB > 0 || places.length === 1) {
        const sumPart = partA + partB;
        partials.push(sumPart);
        steps.push({
          chalkText: partA + ' + ' + partB + ' = ' + sumPart,
          explanation: 'Sumamos las ' + p.name.toLowerCase(),
          category: 'decomposition',
          accent: idx === 0 ? 'cyan' : idx === 1 ? 'yellow' : 'pink',
          badge: p.name,
        });
      }
    });

    if (partials.length > 1) {
      if (partials.length === 2) {
        steps.push({
          chalkText: partials[0] + ' + ' + partials[1] + ' = ' + result,
          explanation: 'Juntamos los resultados parciales',
          category: 'partial',
          accent: 'yellow',
          badge: 'Combinación',
        });
      } else {
        let runningSum = partials[0];
        for (let i = 1; i < partials.length; i++) {
          const nextVal = partials[i];
          const nextSum = runningSum + nextVal;
          steps.push({
            chalkText: runningSum + ' + ' + nextVal + ' = ' + nextSum,
            explanation: 'Sumamos acumulado con ' + nextVal,
            category: 'partial',
            accent: 'yellow',
            badge: 'Acumulado ' + i,
          });
          runningSum = nextSum;
        }
      }
    }

    steps.push({
      chalkText: a + ' + ' + b + ' = ' + result,
      explanation: '¡Resultado final comprobado!',
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado',
    });

    return {
      num1: a,
      num2: b,
      operation: '+',
      result: result,
      steps: steps,
      methodName: 'Descomposición Posicional',
    };
  }

  function breakdownSubtraction(a, b) {
    const result = a - b;
    const steps = [];

    if (a === b) {
      steps.push({
        chalkText: a + ' - ' + b + ' = 0',
        explanation: 'Ambas cantidades son iguales, no hay diferencia',
        category: 'final',
        accent: 'emerald',
        badge: 'Resultado',
      });
      return {
        num1: a,
        num2: b,
        operation: '-',
        result: 0,
        steps: steps,
        methodName: 'Resta Directa',
      };
    }

    if (b === 0) {
      steps.push({
        chalkText: a + ' - 0 = ' + a,
        explanation: 'Restar 0 deja la cantidad intacta',
        category: 'final',
        accent: 'emerald',
        badge: 'Resultado',
      });
      return {
        num1: a,
        num2: b,
        operation: '-',
        result: a,
        steps: steps,
        methodName: 'Resta Directa',
      };
    }

    if (a < b) {
      const positiveBreakdown = breakdownSubtraction(b, a);
      const positiveResult = b - a;

      steps.push({
        chalkText: 'Como ' + a + ' < ' + b + ', calculamos ' + b + ' - ' + a,
        explanation: 'El resultado será negativo con signo menos (-)',
        category: 'partial',
        accent: 'pink',
        badge: 'Aviso',
      });

      positiveBreakdown.steps.forEach((s) => {
        if (s.category !== 'final') {
          steps.push(s);
        }
      });

      steps.push({
        chalkText: a + ' - ' + b + ' = -' + positiveResult,
        explanation: 'Diferencia de magnitud ' + positiveResult + ', resultado negativo',
        category: 'final',
        accent: 'emerald',
        badge: 'Resultado',
      });

      return {
        num1: a,
        num2: b,
        operation: '-',
        result: result,
        steps: steps,
        methodName: 'Método del Salto (Negativo)',
      };
    }

    let current = b;
    const target = a;
    const jumps = [];

    if (current % 10 !== 0 && current < target) {
      const nextTen = Math.min(Math.ceil(current / 10) * 10, target);
      const jump = nextTen - current;
      jumps.push({
        jump: jump,
        from: current,
        to: nextTen,
        reason: nextTen === target ? 'Llegamos directo al objetivo' : 'Completamos a la siguiente decena',
      });
      current = nextTen;
    }

    if (current % 100 !== 0 && current < target) {
      const nextHundred = Math.min(Math.ceil(current / 100) * 100, target);
      if (nextHundred > current) {
        const jump = nextHundred - current;
        jumps.push({
          jump: jump,
          from: current,
          to: nextHundred,
          reason: nextHundred === target ? 'Llegamos al objetivo' : 'Completamos a la siguiente centena',
        });
        current = nextHundred;
      }
    }

    if (target >= 1000 && current % 1000 !== 0 && current < target) {
      const nextThousand = Math.min(Math.ceil(current / 1000) * 1000, target);
      if (nextThousand > current) {
        const jump = nextThousand - current;
        jumps.push({
          jump: jump,
          from: current,
          to: nextThousand,
          reason: nextThousand === target ? 'Llegamos al objetivo' : 'Completamos al siguiente millar',
        });
        current = nextThousand;
      }
    }

    if (current < target) {
      const jump = target - current;
      jumps.push({
        jump: jump,
        from: current,
        to: target,
        reason: 'Sumamos lo necesario para llegar al número final',
      });
      current = target;
    }

    jumps.forEach((j, index) => {
      steps.push({
        chalkText: j.from + ' + ' + j.jump + ' = ' + j.to,
        explanation: j.reason + ' (+' + j.jump + ') ',
        category: 'jump',
        accent: index === 0 ? 'cyan' : index === 1 ? 'yellow' : 'pink',
        badge: 'Salto ' + (index + 1),
      });
    });

    if (jumps.length > 1) {
      const jumpValues = jumps.map((j) => j.jump).reverse();
      steps.push({
        chalkText: jumpValues.join(' + ') + ' = ' + result,
        explanation: 'Sumamos todos los saltos realizados',
        category: 'jump_sum',
        accent: 'yellow',
        badge: 'Suma de Saltos',
      });
    }

    steps.push({
      chalkText: a + ' - ' + b + ' = ' + result,
      explanation: '¡Resultado final comprobado!',
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado',
    });

    return {
      num1: a,
      num2: b,
      operation: '-',
      result: result,
      steps: steps,
      methodName: 'Método del Salto / Complemento',
    };
  }

  function breakdownMultiplication(a, b) {
    const result = a * b;
    const steps = [];

    if (a === 0 || b === 0) {
      steps.push({
        chalkText: a + ' × ' + b + ' = 0',
        explanation: 'Todo número multiplicado por 0 es igual a 0 (Propiedad absorbente)',
        category: 'final',
        accent: 'yellow',
        badge: 'Regla del Cero',
      });
      return {
        num1: a,
        num2: b,
        operation: '×',
        result: 0,
        steps: steps,
        methodName: 'Multiplicación Directa',
      };
    }

    if (a === 1 || b === 1) {
      steps.push({
        chalkText: a + ' × ' + b + ' = ' + result,
        explanation: 'Todo número multiplicado por 1 se queda igual (Elemento neutro)',
        category: 'final',
        accent: 'emerald',
        badge: 'Elemento Neutro',
      });
      return {
        num1: a,
        num2: b,
        operation: '×',
        result: result,
        steps: steps,
        methodName: 'Multiplicación Directa',
      };
    }

    if (a < 10 && b < 10) {
      if (a >= 6 && b >= 6) {
        const splitA2 = a - 5;
        const part1 = 5 * b;
        const part2 = splitA2 * b;

        steps.push({
          chalkText: a + ' = 5 + ' + splitA2,
          explanation: 'Descomponemos ' + a + ' con el 5 como ancla amigable',
          category: 'decomposition',
          accent: 'cyan',
          badge: 'Descomponer',
        });
        steps.push({
          chalkText: '5 × ' + b + ' = ' + part1,
          explanation: 'Tabla del 5: fácil de calcular',
          category: 'partial',
          accent: 'yellow',
          badge: 'Parte 1',
        });
        steps.push({
          chalkText: splitA2 + ' × ' + b + ' = ' + part2,
          explanation: 'Multiplicamos el resto (' + splitA2 + ' × ' + b + ')',
          category: 'partial',
          accent: 'pink',
          badge: 'Parte 2',
        });
        steps.push({
          chalkText: part1 + ' + ' + part2 + ' = ' + result,
          explanation: 'Sumamos ambas partes para el resultado final',
          category: 'partial',
          accent: 'yellow',
          badge: 'Suma Parcial',
        });
      }

      steps.push({
        chalkText: a + ' × ' + b + ' = ' + result,
        explanation: '¡Resultado final!',
        category: 'final',
        accent: 'emerald',
        badge: 'Resultado',
      });

      return {
        num1: a,
        num2: b,
        operation: '×',
        result: result,
        steps: steps,
        methodName: 'Descomposición Distributiva',
      };
    }

    let mainNum = a;
    let multNum = b;
    if (a < 10 && b >= 10) {
      mainNum = b;
      multNum = a;
    }

    const places = [];
    if (mainNum >= 1000) {
      const thousands = Math.floor((mainNum % 10000) / 1000) * 1000;
      if (thousands > 0) places.push({ name: 'Millares', value: thousands });
    }
    if (mainNum >= 100) {
      const hundreds = Math.floor((mainNum % 1000) / 100) * 100;
      if (hundreds > 0) places.push({ name: 'Centenas', value: hundreds });
    }
    if (mainNum >= 10) {
      const tens = Math.floor((mainNum % 100) / 10) * 10;
      if (tens > 0) places.push({ name: 'Decenas', value: tens });
    }
    const units = mainNum % 10;
    if (units > 0) {
      places.push({ name: 'Unidades', value: units });
    }

    const decompText = places.map((p) => p.value).join(' + ');
    steps.push({
      chalkText: mainNum + ' = ' + decompText,
      explanation: 'Descomponemos ' + mainNum + ' en sus valores posicionales',
      category: 'decomposition',
      accent: 'cyan',
      badge: 'Descomponer',
    });

    const partialProducts = [];
    places.forEach((p, idx) => {
      const partial = p.value * multNum;
      partialProducts.push(partial);

      let tip = 'Multiplicamos las ' + p.name.toLowerCase();
      if (p.value >= 10 && p.value % 10 === 0) {
        const baseDigit = p.value / (p.value >= 1000 ? 1000 : p.value >= 100 ? 100 : 10);
        tip = '(' + baseDigit + ' × ' + multNum + ' = ' + baseDigit * multNum + ') + ceros ➔ ' + partial;
      }

      steps.push({
        chalkText: p.value + ' × ' + multNum + ' = ' + partial,
        explanation: tip,
        category: 'partial',
        accent: idx === 0 ? 'yellow' : idx === 1 ? 'pink' : 'cyan',
        badge: p.name,
      });
    });

    if (partialProducts.length > 1) {
      steps.push({
        chalkText: partialProducts.join(' + ') + ' = ' + result,
        explanation: 'Sumamos todos los productos parciales',
        category: 'jump_sum',
        accent: 'yellow',
        badge: 'Suma Parcial',
      });
    }

    steps.push({
      chalkText: a + ' × ' + b + ' = ' + result,
      explanation: '¡Resultado final obtenido!',
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado',
    });

    return {
      num1: a,
      num2: b,
      operation: '×',
      result: result,
      steps: steps,
      methodName: 'Descomposición Distributiva',
    };
  }

  function breakdownDivision(a, b) {
    const steps = [];

    if (b === 0) {
      steps.push({
        chalkText: a + ' ÷ 0 = Indefinido',
        explanation: 'No es posible dividir ningún número entre 0 en matemáticas',
        category: 'final',
        accent: 'pink',
        badge: 'Indeterminado',
      });
      return {
        num1: a,
        num2: b,
        operation: '÷',
        result: 0,
        steps: steps,
        methodName: 'Indefinido',
      };
    }

    if (a === 0) {
      steps.push({
        chalkText: '0 ÷ ' + b + ' = 0',
        explanation: 'Cero repartido entre cualquier cantidad es 0',
        category: 'final',
        accent: 'emerald',
        badge: 'Resultado',
      });
      return {
        num1: a,
        num2: b,
        operation: '÷',
        result: 0,
        steps: steps,
        methodName: 'División Directa',
      };
    }

    if (b === 1) {
      steps.push({
        chalkText: a + ' ÷ 1 = ' + a,
        explanation: 'Dividir entre 1 deja el mismo número',
        category: 'final',
        accent: 'emerald',
        badge: 'Resultado',
      });
      return {
        num1: a,
        num2: b,
        operation: '÷',
        result: a,
        steps: steps,
        methodName: 'División Directa',
      };
    }

    if (a < b) {
      steps.push({
        chalkText: 'Como ' + a + ' < ' + b + ' : Cociente = 0, Residuo = ' + a,
        explanation: 'No alcanza para dar al menos 1 a cada uno. Sobran ' + a,
        category: 'final',
        accent: 'yellow',
        badge: 'Resultado',
      });
      return {
        num1: a,
        num2: b,
        operation: '÷',
        result: 0,
        remainder: a,
        steps: steps,
        methodName: 'División Directa',
      };
    }

    const quotient = Math.floor(a / b);
    const remainder = a % b;

    let currentDividend = a;
    const partials = [];
    const friendlyMultipliers = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

    while (currentDividend >= b) {
      let chosenMultiplier = 1;
      for (let i = 0; i < friendlyMultipliers.length; i++) {
        const m = friendlyMultipliers[i];
        if (b * m <= currentDividend) {
          chosenMultiplier = m;
          break;
        }
      }

      const chunk = b * chosenMultiplier;
      const remaining = currentDividend - chunk;
      partials.push({
        chunk: chunk,
        partialQuotient: chosenMultiplier,
        remaining: remaining,
      });
      currentDividend = remaining;
    }

    if (partials.length > 1) {
      steps.push({
        chalkText: 'Repartimos ' + a + ' en partes cómodas de múltiplo ' + b,
        explanation: 'Buscamos múltiplos fáciles del divisor para el cálculo mental',
        category: 'decomposition',
        accent: 'cyan',
        badge: 'Estrategia',
      });
    }

    partials.forEach((p, idx) => {
      steps.push({
        chalkText: p.chunk + ' ÷ ' + b + ' = ' + p.partialQuotient,
        explanation: 'Tomamos ' + p.chunk + ' (' + p.partialQuotient + ' veces ' + b + ') ➔ Quedan ' + p.remaining,
        category: 'partial',
        accent: idx === 0 ? 'yellow' : idx === 1 ? 'cyan' : 'pink',
        badge: 'Reparto ' + (idx + 1),
      });
    });

    if (partials.length > 1) {
      const qSumText = partials.map((p) => p.partialQuotient).join(' + ');
      steps.push({
        chalkText: qSumText + ' = ' + quotient,
        explanation: 'Sumamos todos los cocientes parciales',
        category: 'jump_sum',
        accent: 'yellow',
        badge: 'Cociente',
      });
    }

    if (remainder > 0) {
      steps.push({
        chalkText: 'Sobra: ' + remainder + ' (Residuo)',
        explanation: remainder + ' es menor que ' + b + ', no se puede repartir entero',
        category: 'remainder',
        accent: 'pink',
        badge: 'Residuo',
      });
    }

    const finalChalk =
      remainder === 0
        ? a + ' ÷ ' + b + ' = ' + quotient
        : a + ' ÷ ' + b + ' = ' + quotient + ' (Residuo: ' + remainder + ')';

    steps.push({
      chalkText: finalChalk,
      explanation: remainder === 0 ? '¡División exacta comprobada!' : 'Cociente entero: ' + quotient + ' con resto ' + remainder,
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado',
    });

    return {
      num1: a,
      num2: b,
      operation: '÷',
      result: quotient,
      remainder: remainder,
      steps: steps,
      methodName: 'Cocientes Parciales (Partes Amigables)',
    };
  }

  function calculateAndBreakdown(a, op, b) {
    if (op === '+') return breakdownAddition(a, b);
    if (op === '-') return breakdownSubtraction(a, b);
    if (op === '×' || op === '*') return breakdownMultiplication(a, b);
    if (op === '÷' || op === '/') return breakdownDivision(a, b);
    return breakdownAddition(a, b);
  }

  // ==========================================
  // 4. Application State
  // ==========================================
  let firstNum = '';
  let activeOp = null;
  let secondNum = '';
  let breakdown = null;
  let chalkColor = 'white';
  let isKeypadMinimized = false;
  let visibleStepCount = 0;
  let stepTimer = null;
  let isAutoPlaying = false;

  // DOM Elements
  const equationTextEl = document.getElementById('equation-text');
  const equationSubtitleEl = document.getElementById('equation-subtitle');
  const boardMethodTextEl = document.getElementById('board-method-text');
  const boardControlsEl = document.getElementById('board-controls');
  const stepsContainerEl = document.getElementById('steps-container');
  const boardSectionEl = document.getElementById('board-section');
  const keypadSectionEl = document.getElementById('keypad-section');
  const minimizedBarEl = document.getElementById('minimized-bar');
  const soundToggleBtn = document.getElementById('btn-sound-toggle');
  const pedagogyModalEl = document.getElementById('pedagogy-modal');
  const splashScreenEl = document.getElementById('splash-screen');

  function getEquationString() {
    if (!firstNum && !activeOp && !secondNum) return '0';
    let str = firstNum || '0';
    if (activeOp) {
      str += ' ' + activeOp + ' ';
      if (secondNum) str += secondNum;
    }
    return str;
  }

  function getOperationHeadline() {
    if (!breakdown) {
      if (activeOp === '+') return 'SUMANDO · INGRESA SEGUNDO NÚMERO';
      if (activeOp === '-') return 'RESTANDO · INGRESA SEGUNDO NÚMERO';
      if (activeOp === '×') return 'MULTIPLICANDO · INGRESA FACTOR';
      if (activeOp === '÷') return 'DIVIDIENDO · INGRESA DIVISOR';
      return 'INGRESA NÚMEROS Y OPERACIÓN';
    }
    if (breakdown.operation === '+') return 'SUMA POR VALOR POSICIONAL';
    if (breakdown.operation === '-') return 'RESTA MEDIANTE SALTOS';
    if (breakdown.operation === '×') return 'MULTIPLICACIÓN DISTRIBUTIVA';
    if (breakdown.operation === '÷') return 'DIVISIÓN POR PARTES AMIGABLES';
    return 'DESGLOSE PASO A PASO';
  }

  function getResultTitle() {
    if (!breakdown) return 'RESULTADO';
    if (breakdown.operation === '+') return 'TOTAL DE LA SUMA';
    if (breakdown.operation === '-') return 'DIFERENCIA FINAL';
    if (breakdown.operation === '×') return 'PRODUCTO FINAL';
    if (breakdown.operation === '÷') return 'COCIENTE OBTENIDO';
    return 'RESULTADO FINAL';
  }

  function getAccentClass(accent) {
    if (accent === 'yellow') return 'chalk-text-yellow';
    if (accent === 'cyan') return 'chalk-text-cyan';
    if (accent === 'pink') return 'chalk-text-pink';
    if (accent === 'emerald') return 'chalk-text-emerald';
    return 'chalk-text-white';
  }

  // ==========================================
  // 5. Render Engine
  // ==========================================
  function render() {
    // 1. Equation header
    equationTextEl.textContent = getEquationString();
    equationSubtitleEl.textContent = getOperationHeadline();

    // 2. Method indicator title
    boardMethodTextEl.textContent = breakdown ? breakdown.methodName : 'Pizarra de Desglose Mental';

    // 3. Bottom Keypad View State
    if (isKeypadMinimized) {
      boardSectionEl.classList.remove('keypad-mode');
      boardSectionEl.classList.add('minimized-mode');
      keypadSectionEl.style.display = 'none';
      minimizedBarEl.style.display = 'flex';
    } else {
      boardSectionEl.classList.remove('minimized-mode');
      boardSectionEl.classList.add('keypad-mode');
      keypadSectionEl.style.display = 'flex';
      minimizedBarEl.style.display = 'none';
    }

    // 4. Keypad active op styling
    document.querySelectorAll('.key-button.btn-op').forEach((btn) => {
      btn.classList.remove('active-div', 'active-mult', 'active-sub', 'active-add');
      const op = btn.getAttribute('data-op');
      if (activeOp === op) {
        if (op === '÷') btn.classList.add('active-div');
        if (op === '×') btn.classList.add('active-mult');
        if (op === '-') btn.classList.add('active-sub');
        if (op === '+') btn.classList.add('active-add');
      }
    });

    // 5. Chalk stick active state
    document.querySelectorAll('.chalk-stick').forEach((btn) => {
      const color = btn.getAttribute('data-color');
      if (color === chalkColor) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 6. Sound toggle state
    if (soundEnabled) {
      soundToggleBtn.classList.add('active');
      soundToggleBtn.title = 'Silenciar sonidos de tiza';
      soundToggleBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
    } else {
      soundToggleBtn.classList.remove('active');
      soundToggleBtn.title = 'Activar sonidos de tiza';
      soundToggleBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    }

    // 7. Render Steps or Empty Guide
    renderSteps();
  }

  function renderSteps() {
    stepsContainerEl.innerHTML = '';

    if (!breakdown) {
      boardControlsEl.style.display = 'none';

      // Show pedagogical welcome guide
      const emptyGuide = document.createElement('div');
      emptyGuide.className = 'empty-guide';
      emptyGuide.innerHTML = `
        <p class="empty-guide-title">Altair desglosa cada operación en pasos claros para el cálculo mental:</p>
        <div class="empty-guide-grid">
          <div class="guide-pill" style="color: #6ee7b7;">
            <span class="guide-pill-header">Suma (+)</span>
            50 + 30 = 80, 4 + 6 = 10 ➔ 90
          </div>
          <div class="guide-pill" style="color: #fde68a;">
            <span class="guide-pill-header">Resta (−)</span>
            157 + 3 = 160 ➔ Saltos hasta 350
          </div>
          <div class="guide-pill" style="color: #d8b4fe;">
            <span class="guide-pill-header">Multiplicación (×)</span>
            48 × 6 = (40 × 6) + (8 × 6) ➔ 288
          </div>
          <div class="guide-pill" style="color: #7dd3fc;">
            <span class="guide-pill-header">División (÷)</span>
            144 ÷ 6 = (120 ÷ 6) + (24 ÷ 6) ➔ 24
          </div>
        </div>
      `;
      stepsContainerEl.appendChild(emptyGuide);
      return;
    }

    // If breakdown exists, show board playback controls
    boardControlsEl.style.display = 'flex';
    const totalSteps = breakdown.steps.length;

    // Controls update
    const btnNextStep = document.getElementById('btn-next-step');
    const btnShowAll = document.getElementById('btn-show-all');
    if (visibleStepCount < totalSteps) {
      btnNextStep.style.display = 'inline-flex';
      btnShowAll.style.display = 'inline-flex';
    } else {
      btnNextStep.style.display = 'none';
      btnShowAll.style.display = 'none';
    }

    const stepsList = document.createElement('div');
    stepsList.className = 'steps-list';

    for (let i = 0; i < visibleStepCount; i++) {
      const step = breakdown.steps[i];
      const isLast = i === totalSteps - 1;

      if (isLast) {
        // Final Result Card
        const card = document.createElement('div');
        card.className = 'final-result-card';

        let resText = '= ' + breakdown.result;
        if (breakdown.remainder !== undefined && breakdown.remainder > 0) {
          resText += ' (r: ' + breakdown.remainder + ')';
        }

        card.innerHTML = `
          <div class="step-info">
            <div class="final-result-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>${getResultTitle()}</span>
            </div>
            <div class="final-result-explanation">${step.explanation}</div>
          </div>
          <div class="final-result-math chalk-text">${resText}</div>
        `;
        stepsList.appendChild(card);
      } else {
        // Regular intermediate step card
        const card = document.createElement('div');
        card.className = 'step-card';
        const badgeLabel = step.badge ? step.badge : 'PASO ' + (i + 1);

        card.innerHTML = `
          <div class="step-info">
            <div class="step-badge-row">
              <span class="step-badge">${badgeLabel}</span>
              <span class="step-explanation">${step.explanation}</span>
            </div>
          </div>
          <div class="step-math ${getAccentClass(step.accent)}">${step.chalkText}</div>
        `;
        stepsList.appendChild(card);
      }
    }

    stepsContainerEl.appendChild(stepsList);

    // Auto-scroll steps smoothly
    stepsContainerEl.scrollTo({
      top: stepsContainerEl.scrollHeight,
      behavior: 'smooth',
    });
  }

  // ==========================================
  // 6. Action Handlers
  // ==========================================
  function handleDigit(digit) {
    if (breakdown) {
      breakdown = null;
      firstNum = digit;
      activeOp = null;
      secondNum = '';
      visibleStepCount = 0;
      clearInterval(stepTimer);
      render();
      return;
    }

    if (activeOp === null) {
      if (firstNum.length >= 6) return;
      if (firstNum === '0' && digit === '0') return;
      if (firstNum === '0' && digit !== '0') {
        firstNum = digit;
      } else {
        firstNum += digit;
      }
    } else {
      if (secondNum.length >= 6) return;
      if (secondNum === '0' && digit === '0') return;
      if (secondNum === '0' && digit !== '0') {
        secondNum = digit;
      } else {
        secondNum += digit;
      }
    }
    render();
  }

  function handleOperation(op) {
    if (breakdown) {
      const prevResult = breakdown.result;
      breakdown = null;
      firstNum = prevResult >= 0 ? String(prevResult) : '0';
      activeOp = op;
      secondNum = '';
      visibleStepCount = 0;
      clearInterval(stepTimer);
      render();
      return;
    }

    if (!firstNum) {
      firstNum = '0';
    }
    activeOp = op;
    render();
  }

  function handleEquals() {
    const a = parseInt(firstNum || '0', 10);
    const b = parseInt(secondNum || '0', 10);
    const op = activeOp || '+';

    breakdown = calculateAndBreakdown(a, op, b);
    isKeypadMinimized = true;
    startStepAnimation();
  }

  function startStepAnimation() {
    if (!breakdown) return;
    clearInterval(stepTimer);
    visibleStepCount = 0;
    isAutoPlaying = true;
    render();

    const totalSteps = breakdown.steps.length;
    stepTimer = setInterval(() => {
      visibleStepCount++;
      playChalkStroke();
      render();

      if (visibleStepCount >= totalSteps) {
        clearInterval(stepTimer);
        isAutoPlaying = false;
        playSuccessChime();
        fireConfetti();
        render();
      }
    }, 580);
  }

  function handleBackspace() {
    if (breakdown) {
      breakdown = null;
      visibleStepCount = 0;
      clearInterval(stepTimer);
      render();
      return;
    }

    if (secondNum.length > 0) {
      secondNum = secondNum.slice(0, -1);
    } else if (activeOp !== null) {
      activeOp = null;
    } else if (firstNum.length > 0) {
      firstNum = firstNum.slice(0, -1);
    }
    render();
  }

  function handleClear() {
    firstNum = '';
    activeOp = null;
    secondNum = '';
    breakdown = null;
    visibleStepCount = 0;
    clearInterval(stepTimer);
    isKeypadMinimized = false;
    render();
  }

  function handlePreset(a, op, b) {
    firstNum = String(a);
    activeOp = op;
    secondNum = String(b);
    breakdown = calculateAndBreakdown(a, op, b);
    isKeypadMinimized = true;
    startStepAnimation();
  }

  // ==========================================
  // 7. Event Listeners Setup
  // ==========================================
  function setupEventListeners() {
    // Keypad Digit Buttons
    document.querySelectorAll('.key-button[data-digit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        playChalkTap(1);
        handleDigit(btn.getAttribute('data-digit'));
      });
    });

    // Keypad Operation Buttons
    document.querySelectorAll('.key-button[data-op]').forEach((btn) => {
      btn.addEventListener('click', () => {
        playChalkTap(1.2);
        handleOperation(btn.getAttribute('data-op'));
      });
    });

    // Equals (=)
    document.getElementById('btn-equals').addEventListener('click', () => {
      playChalkTap(1.4);
      handleEquals();
    });

    // Backspace (⌫)
    document.getElementById('btn-backspace').addEventListener('click', () => {
      playChalkTap(0.9);
      handleBackspace();
    });

    // Clear (C)
    document.getElementById('btn-clear').addEventListener('click', () => {
      playChalkTap(0.8);
      handleClear();
    });

    // Presets
    document.querySelectorAll('.btn-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        playChalkTap(1.1);
        const a = parseInt(btn.getAttribute('data-a'), 10);
        const op = btn.getAttribute('data-op');
        const b = parseInt(btn.getAttribute('data-b'), 10);
        handlePreset(a, op, b);
      });
    });

    // Minimized Bar Buttons
    document.getElementById('btn-open-keypad').addEventListener('click', () => {
      playChalkTap(1.1);
      isKeypadMinimized = false;
      render();
    });

    document.getElementById('btn-nueva-operacion').addEventListener('click', () => {
      playEraserSound();
      handleClear();
    });

    // Header Actions
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      playChalkTap(0.9);
      render();
    });

    document.getElementById('btn-open-help').addEventListener('click', () => {
      playChalkTap(1.2);
      pedagogyModalEl.style.display = 'flex';
    });

    document.getElementById('btn-clear-all').addEventListener('click', () => {
      playEraserSound();
      handleClear();
    });

    // Board Step Playback Controls
    document.getElementById('btn-replay-steps').addEventListener('click', () => {
      if (isAutoPlaying) return;
      playChalkTap(1);
      startStepAnimation();
    });

    document.getElementById('btn-next-step').addEventListener('click', () => {
      if (!breakdown || visibleStepCount >= breakdown.steps.length) return;
      playChalkStroke();
      visibleStepCount++;
      render();
    });

    document.getElementById('btn-show-all').addEventListener('click', () => {
      if (!breakdown) return;
      playChalkStroke();
      clearInterval(stepTimer);
      isAutoPlaying = false;
      visibleStepCount = breakdown.steps.length;
      render();
    });

    // Board Eraser Button
    document.getElementById('btn-board-eraser').addEventListener('click', () => {
      const boardSlate = document.getElementById('chalk-board-slate');
      boardSlate.classList.add('erasing-effect');
      playEraserSound();
      setTimeout(() => {
        handleClear();
        boardSlate.classList.remove('erasing-effect');
      }, 250);
    });

    // Chalk Sticks Color Selection
    document.querySelectorAll('.chalk-stick').forEach((stick) => {
      stick.addEventListener('click', () => {
        playChalkStroke();
        chalkColor = stick.getAttribute('data-color');
        render();
      });
    });

    // Pedagogy Modal Close
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      playEraserSound();
      pedagogyModalEl.style.display = 'none';
    });
    document.getElementById('btn-modal-done').addEventListener('click', () => {
      playEraserSound();
      pedagogyModalEl.style.display = 'none';
    });
    pedagogyModalEl.addEventListener('click', (e) => {
      if (e.target === pedagogyModalEl) {
        playEraserSound();
        pedagogyModalEl.style.display = 'none';
      }
    });

    // Splash Screen Click / Dismiss
    splashScreenEl.addEventListener('click', () => {
      splashScreenEl.classList.add('fading');
      setTimeout(() => {
        splashScreenEl.style.display = 'none';
      }, 500);
    });

    // Auto-dismiss Splash Screen after 3.2s
    setTimeout(() => {
      if (splashScreenEl) {
        splashScreenEl.classList.add('fading');
        setTimeout(() => {
          splashScreenEl.style.display = 'none';
        }, 850);
      }
    }, 3200);

    // Keyboard Shortcuts (0-9, +, -, *, /, Enter, Backspace, Escape/C)
    window.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        playChalkTap(1);
        handleDigit(e.key);
      } else if (e.key === '+') {
        playChalkTap(1.2);
        handleOperation('+');
      } else if (e.key === '-') {
        playChalkTap(1.2);
        handleOperation('-');
      } else if (e.key === '*' || e.key.toLowerCase() === 'x') {
        playChalkTap(1.2);
        handleOperation('×');
      } else if (e.key === '/') {
        playChalkTap(1.2);
        handleOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        playChalkTap(1.4);
        handleEquals();
      } else if (e.key === 'Backspace') {
        playChalkTap(0.9);
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        playChalkTap(0.8);
        handleClear();
      }
    });
  }

  // ==========================================
  // 8. Bootstrap
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    render();
  });
})();
