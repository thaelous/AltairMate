export interface StepItem {
  id: string;
  chalkText: string;
  explanation: string;
  category: 'decomposition' | 'partial' | 'jump' | 'jump_sum' | 'final' | 'multiplication' | 'division' | 'remainder';
  highlightNumber?: string | number;
  badge?: string;
  accent?: 'white' | 'yellow' | 'cyan' | 'pink' | 'emerald';
}

export type MathOperation = '+' | '-' | '×' | '÷' | '*' | '/';

export interface CalculationBreakdown {
  num1: number;
  num2: number;
  operation: MathOperation;
  result: number;
  remainder?: number;
  steps: StepItem[];
  summaryMessage: string;
  methodName: string;
}

/**
 * Breakdown for Addition: Positional Decomposition (Centenas, Decenas, Unidades)
 */
export function breakdownAddition(a: number, b: number): CalculationBreakdown {
  const result = a + b;
  const steps: StepItem[] = [];

  if (a === 0 && b === 0) {
    steps.push({
      id: 'step-0',
      chalkText: '0 + 0 = 0',
      explanation: 'El cero no agrega ninguna cantidad',
      category: 'final',
      accent: 'yellow',
      badge: 'Resultado'
    });
    return {
      num1: a,
      num2: b,
      operation: '+',
      result,
      steps,
      summaryMessage: 'Suma de ceros',
      methodName: 'Descomposición Posicional'
    };
  }

  // Single digit numbers (e.g. 7 + 5)
  if (a < 10 && b < 10) {
    if (a + b >= 10 && a > 0 && b > 0) {
      const compToTen = 10 - a;
      const remainder = b - compToTen;
      if (compToTen > 0 && remainder >= 0) {
        steps.push({
          id: 'step-single-1',
          chalkText: `${a} + ${compToTen} = 10`,
          explanation: `Completamos ${a} a la decena (+${compToTen})`,
          category: 'partial',
          accent: 'cyan',
          badge: 'Paso 1'
        });
        if (remainder > 0) {
          steps.push({
            id: 'step-single-2',
            chalkText: `10 + ${remainder} = ${result}`,
            explanation: `Sumamos lo que sobra (+${remainder})`,
            category: 'partial',
            accent: 'yellow',
            badge: 'Paso 2'
          });
        }
      }
    }
    steps.push({
      id: 'step-final',
      chalkText: `${a} + ${b} = ${result}`,
      explanation: '¡Resultado final obtenido!',
      category: 'final',
      accent: 'emerald',
      badge: 'Total'
    });
    return {
      num1: a,
      num2: b,
      operation: '+',
      result,
      steps,
      summaryMessage: `La suma de ${a} + ${b} es ${result}`,
      methodName: 'Descomposición y Amigos del 10'
    };
  }

  // Multi-digit numbers: Positional Breakdown
  const maxVal = Math.max(a, b);
  const places: { name: string; multiplier: number }[] = [];

  if (maxVal >= 1000) places.push({ name: 'Millares', multiplier: 1000 });
  if (maxVal >= 100) places.push({ name: 'Centenas', multiplier: 100 });
  if (maxVal >= 10) places.push({ name: 'Decenas', multiplier: 10 });
  places.push({ name: 'Unidades', multiplier: 1 });

  const partials: number[] = [];

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
        id: `step-place-${p.multiplier}`,
        chalkText: `${partA} + ${partB} = ${sumPart}`,
        explanation: `Sumamos las ${p.name.toLowerCase()}`,
        category: 'decomposition',
        accent: idx === 0 ? 'cyan' : idx === 1 ? 'yellow' : 'pink',
        badge: p.name
      });
    }
  });

  // Combine partial results
  if (partials.length > 1) {
    if (partials.length === 2) {
      steps.push({
        id: 'step-combine-1',
        chalkText: `${partials[0]} + ${partials[1]} = ${result}`,
        explanation: 'Juntamos los resultados parciales',
        category: 'partial',
        accent: 'yellow',
        badge: 'Combinación'
      });
    } else {
      let runningSum = partials[0];
      for (let i = 1; i < partials.length; i++) {
        const nextVal = partials[i];
        const nextSum = runningSum + nextVal;
        steps.push({
          id: `step-combine-${i}`,
          chalkText: `${runningSum} + ${nextVal} = ${nextSum}`,
          explanation: `Sumamos acumulado con ${nextVal}`,
          category: 'partial',
          accent: 'yellow',
          badge: `Acumulado ${i}`
        });
        runningSum = nextSum;
      }
    }
  }

  // Final summary equation
  steps.push({
    id: 'step-final',
    chalkText: `${a} + ${b} = ${result}`,
    explanation: '¡Resultado final comprobado!',
    category: 'final',
    accent: 'emerald',
    badge: 'Resultado'
  });

  return {
    num1: a,
    num2: b,
    operation: '+',
    result,
    steps,
    summaryMessage: `Desglosamos ${a} y ${b} por valor posicional`,
    methodName: 'Descomposición Posicional'
  };
}

/**
 * Breakdown for Subtraction: Ascending jumps / Shopkeeper's Complement Method
 */
export function breakdownSubtraction(a: number, b: number): CalculationBreakdown {
  const result = a - b;
  const steps: StepItem[] = [];

  if (a === b) {
    steps.push({
      id: 'step-equal',
      chalkText: `${a} - ${b} = 0`,
      explanation: 'Ambas cantidades son iguales, no hay diferencia',
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado'
    });
    return {
      num1: a,
      num2: b,
      operation: '-',
      result: 0,
      steps,
      summaryMessage: 'Cantidades idénticas',
      methodName: 'Resta Directa'
    };
  }

  if (b === 0) {
    steps.push({
      id: 'step-zero',
      chalkText: `${a} - 0 = ${a}`,
      explanation: 'Restar 0 deja la cantidad intacta',
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado'
    });
    return {
      num1: a,
      num2: b,
      operation: '-',
      result: a,
      steps,
      summaryMessage: 'Resta con cero',
      methodName: 'Resta Directa'
    };
  }

  if (a < b) {
    const positiveBreakdown = breakdownSubtraction(b, a);
    const positiveResult = b - a;
    
    steps.push({
      id: 'step-negative-intro',
      chalkText: `Como ${a} < ${b}, calculamos ${b} - ${a}`,
      explanation: 'El resultado será negativo con signo menos (-)',
      category: 'partial',
      accent: 'pink',
      badge: 'Aviso'
    });

    positiveBreakdown.steps.forEach((s) => {
      if (s.category !== 'final') {
        steps.push({
          ...s,
          id: `neg-${s.id}`
        });
      }
    });

    steps.push({
      id: 'step-negative-final',
      chalkText: `${a} - ${b} = -${positiveResult}`,
      explanation: `Diferencia de magnitud ${positiveResult}, resultado negativo`,
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado'
    });

    return {
      num1: a,
      num2: b,
      operation: '-',
      result,
      steps,
      summaryMessage: `Resta con minuendo menor, resultado -${positiveResult}`,
      methodName: 'Método del Salto (Negativo)'
    };
  }

  // Standard Ascending Jumps (A > B)
  let current = b;
  const target = a;
  const jumps: { jump: number; from: number; to: number; reason: string }[] = [];

  // Step 1: Complete to next 10
  if (current % 10 !== 0 && current < target) {
    const nextTen = Math.min(Math.ceil(current / 10) * 10, target);
    const jump = nextTen - current;
    jumps.push({
      jump,
      from: current,
      to: nextTen,
      reason: nextTen === target ? 'Llegamos directo al objetivo' : 'Completamos a la siguiente decena'
    });
    current = nextTen;
  }

  // Step 2: Complete to next 100
  if (current % 100 !== 0 && current < target) {
    const nextHundred = Math.min(Math.ceil(current / 100) * 100, target);
    if (nextHundred > current) {
      const jump = nextHundred - current;
      jumps.push({
        jump,
        from: current,
        to: nextHundred,
        reason: nextHundred === target ? 'Llegamos al objetivo' : 'Completamos a la siguiente centena'
      });
      current = nextHundred;
    }
  }

  // Step 3: Complete to next 1000
  if (target >= 1000 && current % 1000 !== 0 && current < target) {
    const nextThousand = Math.min(Math.ceil(current / 1000) * 1000, target);
    if (nextThousand > current) {
      const jump = nextThousand - current;
      jumps.push({
        jump,
        from: current,
        to: nextThousand,
        reason: nextThousand === target ? 'Llegamos al objetivo' : 'Completamos al siguiente millar'
      });
      current = nextThousand;
    }
  }

  // Step 4: Final jump directly from current to target
  if (current < target) {
    const jump = target - current;
    jumps.push({
      jump,
      from: current,
      to: target,
      reason: 'Sumamos lo necesario para llegar al número final'
    });
    current = target;
  }

  jumps.forEach((j, index) => {
    steps.push({
      id: `jump-step-${index + 1}`,
      chalkText: `${j.from} + ${j.jump} = ${j.to}`,
      explanation: `${j.reason} (+${j.jump})`,
      category: 'jump',
      accent: index === 0 ? 'cyan' : index === 1 ? 'yellow' : 'pink',
      badge: `Salto ${index + 1}`
    });
  });

  if (jumps.length > 1) {
    const jumpValues = [...jumps.map(j => j.jump)].reverse();
    const sumExpression = jumpValues.join(' + ');
    
    steps.push({
      id: 'step-jumps-total',
      chalkText: `${sumExpression} = ${result}`,
      explanation: 'Sumamos todos los saltos realizados',
      category: 'jump_sum',
      accent: 'yellow',
      badge: 'Suma de Saltos'
    });
  }

  steps.push({
    id: 'step-subtraction-final',
    chalkText: `${a} - ${b} = ${result}`,
    explanation: '¡Resultado final comprobado!',
    category: 'final',
    accent: 'emerald',
    badge: 'Resultado'
  });

  return {
    num1: a,
    num2: b,
    operation: '-',
    result,
    steps,
    summaryMessage: `Llegamos de ${b} hasta ${a} mediante saltos`,
    methodName: 'Método del Salto / Complemento'
  };
}

/**
 * Breakdown for Multiplication:
 * Strategy: Distributive property & Mental decomposition (Descomposición distributiva y factores amigables)
 * Example 1: 48 × 6
 *   48 = 40 + 8
 *   40 × 6 = 240 (Decenas)
 *   8 × 6 = 48 (Unidades)
 *   240 + 48 = 288 (Suma de productos parciales)
 *   48 × 6 = 288
 * Example 2: 24 × 15
 *   15 = 10 + 5
 *   24 × 10 = 240
 *   24 × 5 = 120 (mitad de 240)
 *   240 + 120 = 360
 */
export function breakdownMultiplication(a: number, b: number): CalculationBreakdown {
  const result = a * b;
  const steps: StepItem[] = [];

  // Edge cases with 0 or 1
  if (a === 0 || b === 0) {
    steps.push({
      id: 'mult-zero',
      chalkText: `${a} × ${b} = 0`,
      explanation: 'Todo número multiplicado por 0 es igual a 0 (Propiedad absorbente)',
      category: 'final',
      accent: 'yellow',
      badge: 'Regla del Cero'
    });
    return {
      num1: a,
      num2: b,
      operation: '×',
      result: 0,
      steps,
      summaryMessage: 'Multiplicación con cero',
      methodName: 'Multiplicación Directa'
    };
  }

  if (a === 1 || b === 1) {
    steps.push({
      id: 'mult-one',
      chalkText: `${a} × ${b} = ${result}`,
      explanation: 'Todo número multiplicado por 1 se queda igual (Elemento neutro)',
      category: 'final',
      accent: 'emerald',
      badge: 'Elemento Neutro'
    });
    return {
      num1: a,
      num2: b,
      operation: '×',
      result,
      steps,
      summaryMessage: 'Multiplicación por uno',
      methodName: 'Multiplicación Directa'
    };
  }

  // Single digits (e.g. 7 × 8)
  if (a < 10 && b < 10) {
    // Break down one into 5 + x if helpful for mental math
    if (a >= 6 && b >= 6) {
      const splitA1 = 5;
      const splitA2 = a - 5;
      const part1 = splitA1 * b;
      const part2 = splitA2 * b;

      steps.push({
        id: 'mult-single-decomp',
        chalkText: `${a} = 5 + ${splitA2}`,
        explanation: `Descomponemos ${a} con el 5 como ancla amigable`,
        category: 'decomposition',
        accent: 'cyan',
        badge: 'Descomponer'
      });
      steps.push({
        id: 'mult-single-p1',
        chalkText: `5 × ${b} = ${part1}`,
        explanation: `Tabla del 5: fácil de calcular`,
        category: 'partial',
        accent: 'yellow',
        badge: 'Parte 1'
      });
      steps.push({
        id: 'mult-single-p2',
        chalkText: `${splitA2} × ${b} = ${part2}`,
        explanation: `Multiplicamos el resto (${splitA2} × ${b})`,
        category: 'partial',
        accent: 'pink',
        badge: 'Parte 2'
      });
      steps.push({
        id: 'mult-single-sum',
        chalkText: `${part1} + ${part2} = ${result}`,
        explanation: 'Sumamos ambas partes para el resultado final',
        category: 'partial',
        accent: 'yellow',
        badge: 'Suma Parcial'
      });
    }

    steps.push({
      id: 'mult-single-final',
      chalkText: `${a} × ${b} = ${result}`,
      explanation: '¡Resultado final!',
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado'
    });

    return {
      num1: a,
      num2: b,
      operation: '×',
      result,
      steps,
      summaryMessage: `Cálculo de ${a} × ${b} = ${result}`,
      methodName: 'Descomposición Distributiva'
    };
  }

  // Multi-digit multiplication: decide which number to decompose (the simpler or smaller one, or the one with tens)
  // Standard strategy: decompose the first number or second number by positional value
  let mainNum = a;
  let multNum = b;

  // If b has multiple digits and a is single digit, swap for cleaner breakdown (e.g. 6 × 48 -> 48 × 6)
  let swapped = false;
  if (a < 10 && b >= 10) {
    mainNum = b;
    multNum = a;
    swapped = true;
  }

  // Deconstruct mainNum into places (Centenas, Decenas, Unidades)
  const places: { name: string; value: number }[] = [];
  
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

  // Initial breakdown step
  const decompText = places.map(p => p.value).join(' + ');
  steps.push({
    id: 'mult-decomp-intro',
    chalkText: `${mainNum} = ${decompText}`,
    explanation: `Descomponemos ${mainNum} en sus valores posicionales`,
    category: 'decomposition',
    accent: 'cyan',
    badge: 'Descomponer'
  });

  // Calculate each partial product
  const partialProducts: number[] = [];
  places.forEach((p, idx) => {
    const partial = p.value * multNum;
    partialProducts.push(partial);
    
    // Friendly explanation (e.g. 40 × 6: 4 × 6 = 24, agregamos un 0 -> 240)
    let tip = `Multiplicamos las ${p.name.toLowerCase()}`;
    if (p.value >= 10 && p.value % 10 === 0) {
      const baseDigit = p.value / (p.value >= 1000 ? 1000 : p.value >= 100 ? 100 : 10);
      const zeros = p.value >= 1000 ? '000' : p.value >= 100 ? '00' : '0';
      tip = `(${baseDigit} × ${multNum} = ${baseDigit * multNum}) + ceros ➔ ${partial}`;
    }

    steps.push({
      id: `mult-part-${idx}`,
      chalkText: `${p.value} × ${multNum} = ${partial}`,
      explanation: tip,
      category: 'partial',
      accent: idx === 0 ? 'yellow' : idx === 1 ? 'pink' : 'cyan',
      badge: p.name
    });
  });

  // Sum partial products
  if (partialProducts.length > 1) {
    const sumChalk = partialProducts.join(' + ');
    steps.push({
      id: 'mult-sum-partials',
      chalkText: `${sumChalk} = ${result}`,
      explanation: 'Sumamos todos los productos parciales',
      category: 'jump_sum',
      accent: 'yellow',
      badge: 'Suma Parcial'
    });
  }

  // Final summary
  steps.push({
    id: 'mult-final',
    chalkText: `${a} × ${b} = ${result}`,
    explanation: '¡Resultado final obtenido!',
    category: 'final',
    accent: 'emerald',
    badge: 'Resultado'
  });

  return {
    num1: a,
    num2: b,
    operation: '×',
    result,
    steps,
    summaryMessage: `Multiplicamos desglosando ${mainNum} (${decompText}) × ${multNum}`,
    methodName: 'Descomposición Distributiva'
  };
}

/**
 * Breakdown for Division:
 * Strategy: Friendly chunks & quotient decomposition (Cocientes parciales y descomposición en múltiplos amigables)
 * Example 1: 144 ÷ 6
 *   Buscamos múltiplos cómodos de 6:
 *   6 × 20 = 120 ➔ 120 ÷ 6 = 20
 *   Queda: 144 - 120 = 24 ➔ 24 ÷ 6 = 4
 *   Sumamos cocientes: 20 + 4 = 24
 *   144 ÷ 6 = 24
 * Example 2: Inexact division 145 ÷ 6
 *   Cociente 24, residuo 1
 */
export function breakdownDivision(a: number, b: number): CalculationBreakdown {
  const steps: StepItem[] = [];

  // Division by zero guard
  if (b === 0) {
    steps.push({
      id: 'div-zero-err',
      chalkText: `${a} ÷ 0 = Indefinido`,
      explanation: 'No es posible dividir ningún número entre 0 en matemáticas',
      category: 'final',
      accent: 'pink',
      badge: 'Indeterminado'
    });
    return {
      num1: a,
      num2: b,
      operation: '÷',
      result: 0,
      steps,
      summaryMessage: 'División entre cero no definida',
      methodName: 'Indefinido'
    };
  }

  // 0 divided by any number
  if (a === 0) {
    steps.push({
      id: 'div-zero-num',
      chalkText: `0 ÷ ${b} = 0`,
      explanation: 'Cero repartido entre cualquier cantidad es 0',
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado'
    });
    return {
      num1: a,
      num2: b,
      operation: '÷',
      result: 0,
      steps,
      summaryMessage: 'Cero dividido',
      methodName: 'División Directa'
    };
  }

  // Divided by 1
  if (b === 1) {
    steps.push({
      id: 'div-by-one',
      chalkText: `${a} ÷ 1 = ${a}`,
      explanation: 'Dividir entre 1 deja el mismo número',
      category: 'final',
      accent: 'emerald',
      badge: 'Resultado'
    });
    return {
      num1: a,
      num2: b,
      operation: '÷',
      result: a,
      steps,
      summaryMessage: 'División entre uno',
      methodName: 'División Directa'
    };
  }

  // Dividend smaller than Divisor (a < b)
  if (a < b) {
    steps.push({
      id: 'div-less-than',
      chalkText: `Como ${a} < ${b} : Cociente = 0, Residuo = ${a}`,
      explanation: `No alcanza para dar al menos 1 a cada uno. Sobran ${a}`,
      category: 'final',
      accent: 'yellow',
      badge: 'Resultado'
    });
    return {
      num1: a,
      num2: b,
      operation: '÷',
      result: 0,
      remainder: a,
      steps,
      summaryMessage: `No alcanza: Cociente 0, Residuo ${a}`,
      methodName: 'División Directa'
    };
  }

  // Exact or Inexact Division using Friendly Chunks (Cocientes Parciales)
  const quotient = Math.floor(a / b);
  const remainder = a % b;

  let currentDividend = a;
  const partials: { chunk: number; partialQuotient: number; remaining: number }[] = [];

  // Multipliers to try for friendly chunks: 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1
  const friendlyMultipliers = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

  while (currentDividend >= b) {
    let chosenMultiplier = 1;
    for (const m of friendlyMultipliers) {
      if (b * m <= currentDividend) {
        chosenMultiplier = m;
        break;
      }
    }

    const chunk = b * chosenMultiplier;
    const remaining = currentDividend - chunk;
    partials.push({
      chunk,
      partialQuotient: chosenMultiplier,
      remaining
    });
    currentDividend = remaining;
  }

  // Step 1: Explain the chunking approach
  if (partials.length > 1) {
    steps.push({
      id: 'div-intro',
      chalkText: `Repartimos ${a} en partes cómodas de múltiplo ${b}`,
      explanation: 'Buscamos múltiplos fáciles del divisor para el cálculo mental',
      category: 'decomposition',
      accent: 'cyan',
      badge: 'Estrategia'
    });
  }

  // Step 2: Show each partial chunk division
  partials.forEach((p, idx) => {
    steps.push({
      id: `div-chunk-${idx + 1}`,
      chalkText: `${p.chunk} ÷ ${b} = ${p.partialQuotient}`,
      explanation: `Tomamos ${p.chunk} (${p.partialQuotient} veces ${b}) ➔ Quedan ${p.remaining}`,
      category: 'partial',
      accent: idx === 0 ? 'yellow' : idx === 1 ? 'cyan' : 'pink',
      badge: `Reparto ${idx + 1}`
    });
  });

  // Step 3: Sum the partial quotients
  if (partials.length > 1) {
    const qSumText = partials.map(p => p.partialQuotient).join(' + ');
    steps.push({
      id: 'div-sum-quotients',
      chalkText: `${qSumText} = ${quotient}`,
      explanation: 'Sumamos todos los cocientes parciales',
      category: 'jump_sum',
      accent: 'yellow',
      badge: 'Cociente'
    });
  }

  // Step 4: Mention remainder if any
  if (remainder > 0) {
    steps.push({
      id: 'div-remainder',
      chalkText: `Sobra: ${remainder} (Residuo)`,
      explanation: `${remainder} es menor que ${b}, no se puede repartir entero`,
      category: 'remainder',
      accent: 'pink',
      badge: 'Residuo'
    });
  }

  // Step 5: Final Result
  const finalChalk = remainder === 0
    ? `${a} ÷ ${b} = ${quotient}`
    : `${a} ÷ ${b} = ${quotient} (Residuo: ${remainder})`;

  steps.push({
    id: 'div-final',
    chalkText: finalChalk,
    explanation: remainder === 0 ? '¡División exacta comprobada!' : `Cociente entero: ${quotient} con resto ${remainder}`,
    category: 'final',
    accent: 'emerald',
    badge: 'Resultado'
  });

  return {
    num1: a,
    num2: b,
    operation: '÷',
    result: quotient,
    remainder,
    steps,
    summaryMessage: remainder === 0
      ? `División exacta: ${a} ÷ ${b} = ${quotient}`
      : `${a} ÷ ${b} = ${quotient} con residuo ${remainder}`,
    methodName: 'Cocientes Parciales (Partes Amigables)'
  };
}

/**
 * Main dispatcher for all four operations
 */
export function calculateAndBreakdown(a: number, op: MathOperation, b: number): CalculationBreakdown {
  if (op === '+') {
    return breakdownAddition(a, b);
  } else if (op === '-') {
    return breakdownSubtraction(a, b);
  } else if (op === '×' || op === '*') {
    return breakdownMultiplication(a, b);
  } else if (op === '÷' || op === '/') {
    return breakdownDivision(a, b);
  }
  return breakdownAddition(a, b);
}
