/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * matrixService.js
 * Modul für Matrixberechnungen und Validierung
 */

/**
 * Erstellt eine Matrix mit vorgegebener Zeilen- und Spaltenanzahl
 * @param {number} rows 
 * @param {number} cols 
 * @param {number} initialVal 
 * @returns {number[][]}
 */
export function createMatrix(rows, cols, initialVal = 0) {
  return Array.from({ length: rows }, () => Array(cols).fill(initialVal));
}

/**
 * Ermittelt die Dimensionen einer Matrix [Zeilen, Spalten]
 * @param {number[][]} matrix 
 * @returns {[number, number]}
 */
export function getMatrixDimensions(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0])) {
    return [0, 0];
  }
  return [matrix.length, matrix[0].length];
}

/**
 * Addiert zwei Matrizen gleicher Dimension komponentenweise
 * @param {number[][]} A 
 * @param {number[][]} B 
 * @returns {number[][]}
 */
export function addMatrices(A, B) {
  const [rowsA, colsA] = getMatrixDimensions(A);
  const [rowsB, colsB] = getMatrixDimensions(B);

  if (rowsA !== rowsB || colsA !== colsB) {
    throw new Error(`Matrizen müssen identische Dimensionen haben (${rowsA}x${colsA} vs ${rowsB}x${colsB}).`);
  }

  const result = createMatrix(rowsA, colsA);
  for (let r = 0; r < rowsA; r++) {
    for (let c = 0; c < colsA; c++) {
      result[r][c] = A[r][c] + B[r][c];
    }
  }
  return result;
}

/**
 * Subtrahiert zwei Matrizen (A - B)
 * @param {number[][]} A 
 * @param {number[][]} B 
 * @returns {number[][]}
 */
export function subtractMatrices(A, B) {
  const [rowsA, colsA] = getMatrixDimensions(A);
  const [rowsB, colsB] = getMatrixDimensions(B);

  if (rowsA !== rowsB || colsA !== colsB) {
    throw new Error('Matrizen müssen identische Dimensionen haben.');
  }

  const result = createMatrix(rowsA, colsA);
  for (let r = 0; r < rowsA; r++) {
    for (let c = 0; c < colsA; c++) {
      result[r][c] = A[r][c] - B[r][c];
    }
  }
  return result;
}

/**
 * Multipliziert zwei Matrizen A (m x k) und B (k x n)
 * Gibt das Ergebnis sowie die Rechenschritte pro Zelle zurück
 * @param {number[][]} A 
 * @param {number[][]} B 
 * @returns {{ result: number[][], stepDetails: { row: number, col: number, expression: string, sum: number }[][] }}
 */
export function multiplyMatrices(A, B) {
  const [rowsA, colsA] = getMatrixDimensions(A);
  const [rowsB, colsB] = getMatrixDimensions(B);

  if (colsA !== rowsB) {
    throw new Error(`Spaltenanzahl von A (${colsA}) muss Zeilenanzahl von B (${rowsB}) entsprechen.`);
  }

  const result = createMatrix(rowsA, colsB);
  const stepDetails = Array.from({ length: rowsA }, () => []);

  for (let r = 0; r < rowsA; r++) {
    for (let c = 0; c < colsB; c++) {
      let sum = 0;
      const terms = [];

      for (let k = 0; k < colsA; k++) {
        const product = A[r][k] * B[k][c];
        sum += product;
        const bFormatted = B[k][c] < 0 ? `(${B[k][c]})` : `${B[k][c]}`;
        terms.push(`${A[r][k]} \\cdot ${bFormatted}`);
      }

      result[r][c] = sum;
      stepDetails[r][c] = {
        row: r,
        col: c,
        expression: terms.join(' + '),
        sum,
      };
    }
  }

  return { result, stepDetails };
}

/**
 * Validiert die Benutzereingabe einer Matrix gegen die erwartete Matrix
 * @param {Array<Array<number|string>>} userInput 
 * @param {number[][]} expectedMatrix 
 * @param {number} tolerance 
 * @returns {{ isCorrect: boolean, cellMatches: boolean[][], feedback: string }}
 */
export function validateMatrixInput(userInput, expectedMatrix, tolerance = 0.001) {
  const [rowsExpected, colsExpected] = getMatrixDimensions(expectedMatrix);

  if (!Array.isArray(userInput) || userInput.length !== rowsExpected) {
    return {
      isCorrect: false,
      cellMatches: createMatrix(rowsExpected, colsExpected, false),
      feedback: 'Die Zeilenanzahl stimmt nicht mit der Zielmatrix überein.',
    };
  }

  const cellMatches = [];
  let allCorrect = true;

  for (let r = 0; r < rowsExpected; r++) {
    const rowMatches = [];
    const userRow = userInput[r] || [];

    for (let c = 0; c < colsExpected; c++) {
      const rawVal = userRow[c];
      if (rawVal === undefined || rawVal === null || rawVal === '') {
        rowMatches.push(false);
        allCorrect = false;
        continue;
      }
      const normalized = String(rawVal).replace(',', '.').trim();
      const parsed = Number(normalized);
      if (Number.isNaN(parsed)) {
        rowMatches.push(false);
        allCorrect = false;
        continue;
      }

      const match = Math.abs(parsed - expectedMatrix[r][c]) <= tolerance;
      if (!match) allCorrect = false;
      rowMatches.push(match);
    }
    cellMatches.push(rowMatches);
  }

  return {
    isCorrect: allCorrect,
    cellMatches,
    feedback: allCorrect
      ? 'Perfekt! Alle Matrixeinträge sind fehlerfrei berechnet.'
      : 'Einige Matrixeinträge sind noch nicht korrekt. Überprüfe die farblich markierten Zellen.',
  };
}

/**
 * Transponiert eine Matrix (vertauscht Zeilen und Spalten)
 * @param {number[][]} matrix 
 * @returns {number[][]}
 */
export function transposeMatrix(matrix) {
  const [rows, cols] = getMatrixDimensions(matrix);
  const result = createMatrix(cols, rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][r] = matrix[r][c];
    }
  }
  return result;
}

/**
 * Erzeugt eine quadratische Einheitsmatrix der Größe n
 * @param {number} size 
 * @returns {number[][]}
 */
export function createIdentityMatrix(size) {
  const result = createMatrix(size, size, 0);
  for (let i = 0; i < size; i++) {
    result[i][i] = 1;
  }
  return result;
}

