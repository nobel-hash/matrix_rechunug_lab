/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * vectorService.js
 * Modul für Vektorberechnungen im 2D- und 3D-Raum
 */

/**
 * Addiert zwei Vektoren komponentenweise
 * @param {number[]} v1 
 * @param {number[]} v2 
 * @returns {number[]} Ergebnisvektor
 */
export function addVectors(v1, v2) {
  if (!Array.isArray(v1) || !Array.isArray(v2)) {
    throw new Error('Beide Argumente müssen Vektoren (Arrays) sein.');
  }
  if (v1.length !== v2.length) {
    throw new Error(`Vektoren müssen die gleiche Dimension haben (${v1.length} vs ${v2.length}).`);
  }
  return v1.map((val, idx) => val + v2[idx]);
}

/**
 * Subtrahiert zwei Vektoren komponentenweise (v1 - v2)
 * @param {number[]} v1 
 * @param {number[]} v2 
 * @returns {number[]} Ergebnisvektor
 */
export function subtractVectors(v1, v2) {
  if (v1.length !== v2.length) {
    throw new Error('Vektoren müssen die gleiche Dimension haben.');
  }
  return v1.map((val, idx) => val - v2[idx]);
}

/**
 * Multipliziert einen Vektor mit einem Skalar
 * @param {number[]} v 
 * @param {number} scalar 
 * @returns {number[]} Skalierter Vektor
 */
export function scaleVector(v, scalar) {
  if (!Array.isArray(v)) {
    throw new Error('Das erste Argument muss ein Vektor sein.');
  }
  return v.map((val) => val * scalar);
}

/**
 * Berechnet den Betrag (euklidische Norm) eines Vektors
 * @param {number[]} v 
 * @returns {{ radicand: number, decimal: number, isInteger: boolean, integerMagnitude: number | null }}
 */
export function vectorMagnitude(v) {
  if (!Array.isArray(v)) {
    throw new Error('Argument muss ein Vektor sein.');
  }
  const radicand = v.reduce((sum, val) => sum + val * val, 0);
  const decimal = Math.sqrt(radicand);
  const isInteger = Number.isInteger(decimal);

  return {
    radicand,
    decimal,
    isInteger,
    integerMagnitude: isInteger ? decimal : null,
  };
}

/**
 * Berechnet das Skalarprodukt zweier Vektoren
 * @param {number[]} v1 
 * @param {number[]} v2 
 * @returns {number}
 */
export function dotProduct(v1, v2) {
  if (v1.length !== v2.length) {
    throw new Error('Vektoren müssen die gleiche Dimension haben.');
  }
  return v1.reduce((sum, val, idx) => sum + val * v2[idx], 0);
}

/**
 * Prüft, ob die Benutzereingabe mit dem Zielvektor übereinstimmt
 * @param {Array<number|string>} userInput 
 * @param {number[]} expectedVector 
 * @param {number} tolerance 
 * @returns {{ isCorrect: boolean, cellMatches: boolean[], feedback: string }}
 */
export function validateVectorInput(userInput, expectedVector, tolerance = 0.001) {
  if (!Array.isArray(userInput) || userInput.length !== expectedVector.length) {
    return {
      isCorrect: false,
      cellMatches: expectedVector.map(() => false),
      feedback: 'Die Anzahl der eingegebenen Komponenten stimmt nicht überein.',
    };
  }

  const cellMatches = expectedVector.map((expected, idx) => {
    const rawVal = userInput[idx];
    if (rawVal === undefined || rawVal === null || rawVal === '') return false;
    // Komma in Punkt umwandeln für deutsche Studierende
    const normalized = String(rawVal).replace(',', '.').trim();
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) return false;
    return Math.abs(parsed - expected) <= tolerance;
  });

  const isCorrect = cellMatches.every(Boolean);

  return {
    isCorrect,
    cellMatches,
    feedback: isCorrect
      ? 'Ausgezeichnet! Alle Vektorkomponenten sind korrekt berechnet.'
      : 'Einige Komponenten weichen vom richtigen Ergebnis ab. Überprüfe die markierten Werte.',
  };
}

/**
 * Prüft eine Skalar- oder Betragseingabe
 * @param {number|string} userInput 
 * @param {number} expectedValue 
 * @param {number} tolerance 
 * @returns {{ isCorrect: boolean, feedback: string }}
 */
export function validateScalarInput(userInput, expectedValue, tolerance = 0.05) {
  if (userInput === undefined || userInput === null || userInput === '') {
    return { isCorrect: false, feedback: 'Bitte gib einen numerischen Wert ein.' };
  }
  const normalized = String(userInput).replace(',', '.').trim();
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    return { isCorrect: false, feedback: 'Ungültige Zahleneingabe.' };
  }

  const isCorrect = Math.abs(parsed - expectedValue) <= tolerance;
  return {
    isCorrect,
    feedback: isCorrect
      ? 'Hervorragend! Das Ergebnis ist korrekt.'
      : `Leider nicht ganz korrekt. Erwartet war ca. ${expectedValue % 1 === 0 ? expectedValue : expectedValue.toFixed(2)}.`,
  };
}
