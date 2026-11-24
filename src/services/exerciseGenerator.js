/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * exerciseGenerator.js
 * Erstellt die 6 spezifischen Aufgabentypen für die Hochschul-Übungsplattform
 */

import { addVectors, subtractVectors, scaleVector, vectorMagnitude } from './vectorService.js';
import {
  addMatrices,
  subtractMatrices,
  multiplyMatrices,
  transposeMatrix,
  createIdentityMatrix,
} from './matrixService.js';
import { TASK_POINTS } from './scoringService.js';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNonZero(min, max, exclude = [0, 1]) {
  let val = 0;
  while (val === 0 || exclude.includes(val)) {
    val = getRandomInt(min, max);
  }
  return val;
}

function generateId(taskNumber) {
  return `task_${taskNumber}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * AUFGABE 1: Vektoraddition ODER Vektorsubtraktion (zufällig)
 * 5 Punkte, 2D oder 3D
 */
export function generateTask1(dimension = null) {
  const dim = dimension || (Math.random() > 0.5 ? 3 : 2);
  const isAddition = Math.random() > 0.5;
  const operator = isAddition ? '+' : '-';

  const v1 = Array.from({ length: dim }, () => getRandomInt(-6, 7));
  const v2 = Array.from({ length: dim }, () => getRandomInt(-6, 7));
  const expectedResult = isAddition ? addVectors(v1, v2) : subtractVectors(v1, v2);

  return {
    id: generateId(1),
    taskNumber: 1,
    title: `Aufgabe 1: Vektor${isAddition ? 'addition' : 'subtraktion'} (${dim}D)`,
    points: TASK_POINTS[1], // 5 Punkte
    questionText: `Berechne ${isAddition ? 'die Summe' : 'die Differenz'} der beiden ${dim}D-Vektoren:`,
    subOperation: isAddition ? 'addition' : 'subtraction',
    operator,
    dimension: dim,
    inputs: { v1, v2 },
    inputType: 'vector',
    inputShape: [dim],
    expectedResult,
  };
}

/**
 * AUFGABE 2: Multiplikation eines Vektors mit einem Skalar
 * 5 Punkte, 2D oder 3D
 */
export function generateTask2(dimension = null) {
  const dim = dimension || (Math.random() > 0.5 ? 3 : 2);
  const scalar = getRandomNonZero(-4, 5, [0, 1]);
  const vector = Array.from({ length: dim }, () => getRandomInt(-6, 7));
  const expectedResult = scaleVector(vector, scalar);

  return {
    id: generateId(2),
    taskNumber: 2,
    title: `Aufgabe 2: Skalarmultiplikation (${dim}D)`,
    points: TASK_POINTS[2], // 5 Punkte
    questionText: `Multipliziere den Vektor \\vec{v} mit dem Skalar c = ${scalar}:`,
    dimension: dim,
    scalar,
    inputs: { vector, scalar },
    inputType: 'vector',
    inputShape: [dim],
    expectedResult,
  };
}

/**
 * AUFGABE 3: Betrag eines Vektors
 * 5 Punkte, 2D oder 3D
 */
export function generateTask3(dimension = null) {
  const dim = dimension || (Math.random() > 0.5 ? 3 : 2);

  // Pythagoreische Tupel für saubere Längen
  const triples2D = [
    [3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6], [8, 15]
  ];
  const triples3D = [
    [1, 2, 2], [2, 3, 6], [1, 4, 8], [2, 6, 9], [2, 10, 11], [3, 4, 12]
  ];

  const pool = dim === 2 ? triples2D : triples3D;
  const base = pool[Math.floor(Math.random() * pool.length)];
  const vector = base.map((num) => num * (Math.random() > 0.5 ? 1 : -1));

  const { decimal, isInteger, integerMagnitude } = vectorMagnitude(vector);
  const expectedResult = isInteger ? integerMagnitude : Math.round(decimal * 100) / 100;

  return {
    id: generateId(3),
    taskNumber: 3,
    title: `Aufgabe 3: Betrag eines Vektors (${dim}D)`,
    points: TASK_POINTS[3], // 5 Punkte
    questionText: `Bestimme die geometrische Länge (den Betrag) des Vektors \\vec{v}:`,
    note: 'Tipp: Der Betrag ergibt eine ganze Zahl.',
    dimension: dim,
    inputs: { vector },
    inputType: 'scalar',
    expectedResult,
  };
}

/**
 * AUFGABE 1 (bzw. vormals 4): Matrizenaddition ODER Matrizensubtraktion (zufällig)
 * 5 Punkte, 2x2 oder 3x3
 */
export function generateTask4(size = null, taskNum = 1) {
  const dim = size || (Math.random() > 0.5 ? 2 : 3);
  const isAddition = Math.random() > 0.5;
  const operator = isAddition ? '+' : '-';

  const A = Array.from({ length: dim }, () =>
    Array.from({ length: dim }, () => getRandomInt(-5, 6))
  );
  const B = Array.from({ length: dim }, () =>
    Array.from({ length: dim }, () => getRandomInt(-5, 6))
  );

  const expectedResult = isAddition ? addMatrices(A, B) : subtractMatrices(A, B);

  return {
    id: generateId(taskNum),
    taskNumber: taskNum,
    title: `Aufgabe ${taskNum}: Matrizen${isAddition ? 'addition' : 'subtraktion'} (${dim}×${dim})`,
    points: TASK_POINTS[taskNum] || 5, // 5 Punkte
    questionText: `Berechne ${isAddition ? 'die Summe A + B' : 'die Differenz A - B'} der beiden ${dim}×${dim}-Matrizen:`,
    subOperation: isAddition ? 'addition' : 'subtraction',
    operator,
    rows: dim,
    cols: dim,
    inputs: { A, B },
    inputType: 'matrix',
    inputShape: [dim, dim],
    expectedResult,
  };
}

/**
 * AUFGABE 2 (bzw. vormals 5): Matrizenmultiplikation
 * 15 Punkte, 2x2 mit 2x2 oder 2x3 mit 3x2
 */
export function generateTask5(preset = null, taskNum = 2) {
  const presets = [
    { rowsA: 2, colsA: 2, rowsB: 2, colsB: 2, label: '2×2 mal 2×2' },
    { rowsA: 2, colsA: 3, rowsB: 3, colsB: 2, label: '2×3 mal 3×2' },
  ];

  const selectedPreset = preset || presets[Math.floor(Math.random() * presets.length)];
  const { rowsA, colsA, rowsB, colsB } = selectedPreset;

  const A = Array.from({ length: rowsA }, () =>
    Array.from({ length: colsA }, () => getRandomInt(-3, 4))
  );
  const B = Array.from({ length: rowsB }, () =>
    Array.from({ length: colsB }, () => getRandomInt(-3, 4))
  );

  const { result: expectedResult } = multiplyMatrices(A, B);

  return {
    id: generateId(taskNum),
    taskNumber: taskNum,
    title: `Aufgabe ${taskNum}: Matrizenmultiplikation (${rowsA}×${colsA} · ${rowsB}×${colsB})`,
    points: TASK_POINTS[taskNum] || 15, // 15 Punkte
    questionText: `Multipliziere Matrix A (${rowsA}×${colsA}) mit Matrix B (${rowsB}×${colsB}):`,
    rowsA,
    colsA,
    rowsB,
    colsB,
    inputs: { A, B },
    inputType: 'matrix',
    inputShape: [rowsA, colsB],
    expectedResult,
  };
}

/**
 * AUFGABE 3 (bzw. vormals 6): 2x2 Matrix multipliziert mit Einheitsmatrix und transponieren
 * 10 Punkte
 * C = (A · I)^T
 */
export function generateTask6(taskNum = 3) {
  const dim = 2;
  const A = [
    [getRandomInt(-6, 7), getRandomInt(-6, 7)],
    [getRandomInt(-6, 7), getRandomInt(-6, 7)],
  ];
  const I = createIdentityMatrix(dim); // [[1, 0], [0, 1]]

  // Multiplikation A · I ergibt A
  const { result: intermediateProduct } = multiplyMatrices(A, I);

  // Das Ergebnis wird anschließend transponiert: C = (A · I)^T
  const expectedResult = transposeMatrix(intermediateProduct);

  return {
    id: generateId(taskNum),
    taskNumber: taskNum,
    title: `Aufgabe ${taskNum}: Multiplikation mit Einheitsmatrix & Transponieren`,
    points: TASK_POINTS[taskNum] || 10, // 10 Punkte
    questionText: `Multipliziere die 2×2-Matrix A mit der Einheitsmatrix I₂ und transponiere das Ergebnis:`,
    formulaHint: 'Gesucht ist: C = (A \\cdot I)^T',
    inputs: { A, I },
    inputType: 'matrix',
    inputShape: [dim, dim],
    expectedResult,
  };
}

/**
 * Generiert die jeweilige Aufgabe nach Aufgabennummer (in App 2: 1 bis 3)
 * @param {number} taskNumber 
 * @param {object} [options]
 * @returns {object}
 */
export function generateTaskByNumber(taskNumber, options = {}) {
  switch (taskNumber) {
    case 1:
      return generateTask4(options.size, 1);
    case 2:
      return generateTask5(options.preset, 2);
    case 3:
      return generateTask6(3);
    case 4:
      return generateTask4(options.size, 1);
    case 5:
      return generateTask5(options.preset, 2);
    case 6:
      return generateTask6(3);
    default:
      return generateTask4(options.size, 1);
  }
}
