/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * i18nService.js
 * Internationalization service for English (default) and German.
 */

export const translations = {
  en: {
    appTitle: 'Linear Algebra · App 2',
    appSubtitle: 'Linear Algebra University Practice · App 2: Matrices (Tasks 1-3, Max 30 points)',
    points: 'Points',
    maxPoints: '30',
    scormMoodle: 'Moodle / SCORM',
    matrixSize: 'Matrix Size',
    matrixPreset: 'Dimensions',
    task: 'Task',
    taskOf: 'Task {current} of {total}',
    solvedCount: 'Solved: {count} of {total}',
    generateNewNumbers: 'Generate new numbers',
    resetScore: 'Reset',
    resetConfirm: 'Do you really want to reset your score and solved tasks?',
    valueLabel: 'Worth: {points} Points',
    alreadyScored: 'Scored',
    pointsAwarded: '+{points} Points awarded!',
    alreadyScoredNotice: 'Task {task} was already scored previously. Max {points} points already earned for this task.',
    checkAnswer: 'Check Answer',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    revealSolution: 'Reveal Solution',
    solutionUnlockedNotice: 'Solution unlocked after failed attempts',
    needHint: 'Need a Hint?',
    hint: 'Hint',
    hint1Title: 'Hint 1: Method & Formula',
    hint2Title: 'Hint 2: Intermediate Values',
    nextTask: 'Next Task',
    enterSolution: 'Enter your answer:',
    enterSolutionOrGraph: 'Enter your result or click inside the coordinate system:',
    exactResult: 'Exact Result:',
    correctTitle: 'Correct answer!',
    correctVectorFeedback: 'Excellent! All vector components are correctly computed.',
    correctMatrixFeedback: 'Perfect! All matrix entries are correctly computed.',
    correctScalarFeedback: 'Great job! The numerical value is correct.',
    incorrectTitle: 'Check required',
    incorrectVectorFeedback: 'Some components do not match. Check the highlighted values or open the hints below.',
    incorrectMatrixFeedback: 'Some matrix entries are not correct. Check the highlighted cells or open the hints below.',
    incorrectScalarFeedback: 'Not quite correct. Check your calculation or open the hints below.',
    givenValues: 'Given values:',
    coordSystem2D: '2D Coordinate System (xy)',
    coordSystem3D: '3D Coordinate System (xyz)',
    interactiveHint: 'Interactive input available',
    rotatableHint: 'Rotatable 3D view',
    clickCoordHint: 'Tip: You can click the coordinate system to place the vector arrow!',
    viewAngle: 'Angle:',
    triangleRuleSubtraction: 'Triangle rule: attach opposite vector (-b) to the tip of a',
    subtractionOppositeVector: 'Opposite vector -b (inverted)',
    pythagorasVisualization: 'General Visualization: Pythagorean Theorem',
    pythagorasFormula: 'General Formula: ||v|| = √(v₁² + v₂²)',
    pythagoras3DFormula: 'General Formula: ||v|| = √(v₁² + v₂² + v₃²)',
    // Task 1 (App 2: Matrix Addition / Subtraction)
    task1TitleAdd: 'Task 1: Matrix Addition ({dim}×{dim})',
    task1TitleSub: 'Task 1: Matrix Subtraction ({dim}×{dim})',
    task1QuestionAdd: 'Calculate the sum A + B of the two {dim}×{dim} matrices:',
    task1QuestionSub: 'Calculate the difference A - B of the two {dim}×{dim} matrices:',
    task1Hint1Add: 'Add corresponding cells with identical row and column indices: C_ij = A_ij + B_ij.',
    task1Hint1Sub: 'Subtract corresponding cells: C_ij = A_ij - B_ij. Subtracting a negative number turns into addition (e.g. 3 - (-2) = 5).',
    // Task 2 (App 2: Matrix Multiplication)
    task2Title: 'Task 2: Matrix Multiplication ({rowsA}×{colsA} · {rowsB}×{colsB})',
    task2Question: 'Multiply matrix A ({rowsA}×{colsA}) with matrix B ({rowsB}×{colsB}):',
    task2Hint1: 'Row times Column: To compute entry C_ij, take the dot product of the i-th row of A and the j-th column of B.',
    // Task 3 (App 2: Multiplication with Identity Matrix & Transposition)
    task3Title: 'Task 3: Multiplication with Identity Matrix & Transposition',
    task3Question: 'Multiply the 2×2 matrix A with the identity matrix I₂ and transpose the result:',
    task3Hint: 'Required: C = (A · I₂)ᵀ',
    task3Subtext: 'Transpose the resulting matrix: C = (A · I₂)ᵀ',
    task3Note: 'Tip: The result is a transposed 2×2 matrix.',
    task3Hint1: 'Property of the identity matrix: A · I₂ = A. Then transpose the matrix by reflecting across the main diagonal (swap rows and columns: C_12 = A_21, C_21 = A_12)!',
    // Aliases for 4, 5, 6
    task4TitleAdd: 'Task 1: Matrix Addition ({dim}×{dim})',
    task4TitleSub: 'Task 1: Matrix Subtraction ({dim}×{dim})',
    task4QuestionAdd: 'Calculate the sum A + B of the two {dim}×{dim} matrices:',
    task4QuestionSub: 'Calculate the difference A - B of the two {dim}×{dim} matrices:',
    task4Hint1Add: 'Add corresponding cells with identical row and column indices: C_ij = A_ij + B_ij.',
    task4Hint1Sub: 'Subtract corresponding cells: C_ij = A_ij - B_ij. Subtracting a negative number turns into addition (e.g. 3 - (-2) = 5).',
    task5Title: 'Task 2: Matrix Multiplication ({rowsA}×{colsA} · {rowsB}×{colsB})',
    task5Question: 'Multiply matrix A ({rowsA}×{colsA}) with matrix B ({rowsB}×{colsB}):',
    task5Hint1: 'Row times Column: To compute entry C_ij, take the dot product of the i-th row of A and the j-th column of B.',
    task6Title: 'Task 3: Multiplication with Identity Matrix & Transposition',
    task6Question: 'Multiply the 2×2 matrix A with the identity matrix I₂ and transpose the result:',
    task6Hint: 'Required: C = (A · I₂)ᵀ',
    task6Subtext: 'Transpose the resulting matrix: C = (A · I₂)ᵀ',
    task6Hint1: 'Property of the identity matrix: A · I₂ = A. Then transpose the matrix by reflecting across the main diagonal (swap rows and columns: C_12 = A_21, C_21 = A_12)!',
  },
  de: {
    appTitle: 'Lineare Algebra · Anwendung 2',
    appSubtitle: 'Lineare Algebra · Anwendung 2: Matrizenrechnung (Aufgaben 1-3, Max. 30 Punkte)',
    points: 'Punkte',
    maxPoints: '30',
    scormMoodle: 'Moodle / SCORM',
    matrixSize: 'Matrixgröße',
    matrixPreset: 'Format',
    task: 'Aufgabe',
    taskOf: 'Aufgabe {current} von {total}',
    solvedCount: 'Gelöst: {count} von {total}',
    generateNewNumbers: 'Neue Zahlen generieren',
    resetScore: 'Reset',
    resetConfirm: 'Möchtest du deinen Punktestand und gelöste Aufgaben wirklich zurücksetzen?',
    valueLabel: 'Wertigkeit: {points} Punkte',
    alreadyScored: 'Bepunktet',
    pointsAwarded: '+{points} Punkte gutgeschrieben!',
    alreadyScoredNotice: 'Aufgabe {task} wurde bereits gewertet. Maximale {points} Punkte für diese Aufgabe bereits erreicht.',
    checkAnswer: 'Antwort prüfen',
    showSolution: 'Lösung anzeigen',
    hideSolution: 'Lösung verbergen',
    revealSolution: 'Musterlösung anzeigen',
    solutionUnlockedNotice: 'Musterlösung nach Fehlversuchen freigeschaltet',
    needHint: 'Brauchst du einen Tipp?',
    hint: 'Tipp',
    hint1Title: 'Tipp 1: Rechenweg & Formel',
    hint2Title: 'Tipp 2: Zwischenschritt',
    nextTask: 'Nächste Aufgabe',
    enterSolution: 'Ergebnis eintragen:',
    enterSolutionOrGraph: 'Ergebnis eintragen oder im Koordinatensystem anklicken:',
    exactResult: 'Exaktes Ergebnis:',
    correctTitle: 'Richtig gelöst!',
    correctVectorFeedback: 'Ausgezeichnet! Alle Vektorkomponenten sind korrekt berechnet.',
    correctMatrixFeedback: 'Perfekt! Alle Matrixeinträge sind fehlerfrei berechnet.',
    correctScalarFeedback: 'Hervorragend! Das Ergebnis ist korrekt.',
    incorrectTitle: 'Überprüfung erforderlich',
    incorrectVectorFeedback: 'Einige Komponenten weichen ab. Überprüfe die markierten Werte oder öffne die Tipps unten.',
    incorrectMatrixFeedback: 'Einige Matrixeinträge sind noch nicht korrekt. Überprüfe die Zellen oder öffne die Tipps unten.',
    incorrectScalarFeedback: 'Leider nicht ganz korrekt. Bitte rechne nach oder nutze die Tipps unten.',
    givenValues: 'Gegebene Werte:',
    coordSystem2D: '2D-Koordinatensystem (xy)',
    coordSystem3D: '3D-Koordinatensystem (xyz)',
    interactiveHint: 'Interaktive Eingabe möglich',
    rotatableHint: 'Rotierbare Ansicht',
    clickCoordHint: 'Tipp: Du kannst das Koordinatensystem anklicken, um die Vektorspitze grafisch zu setzen!',
    viewAngle: 'Blickwinkel:',
    triangleRuleSubtraction: 'Dreiecksregel: Gegenvektor (-b) wird an die Spitze von a angehängt',
    pythagorasVisualization: 'Allgemeine Veranschaulichung: Satz des Pythagoras',
    pythagorasFormula: 'Allgemeine Formel: ||v|| = √(v₁² + v₂²)',
    pythagoras3DFormula: 'Allgemeine Formel: ||v|| = √(v₁² + v₂² + v₃²)',
    // Aufgabe 1 (Anwendung 2: Matrizenaddition / -subtraktion)
    task1TitleAdd: 'Aufgabe 1: Matrizenaddition ({dim}×{dim})',
    task1TitleSub: 'Aufgabe 1: Matrizensubtraktion ({dim}×{dim})',
    task1QuestionAdd: 'Berechne die Summe A + B der beiden {dim}×{dim}-Matrizen:',
    task1QuestionSub: 'Berechne die Differenz A - B der beiden {dim}×{dim}-Matrizen:',
    task1Hint1Add: 'Addiere die zueinander passenden Einträge: C_ij = A_ij + B_ij.',
    task1Hint1Sub: 'Subtrahiere zellenweise: C_ij = A_ij - B_ij. Minus einer negativen Zahl wird zum Plus (z.B. 3 - (-2) = 5).',
    // Aufgabe 2 (Anwendung 2: Matrizenmultiplikation)
    task2Title: 'Aufgabe 2: Matrizenmultiplikation ({rowsA}×{colsA} · {rowsB}×{colsB})',
    task2Question: 'Multipliziere Matrix A ({rowsA}×{colsA}) mit Matrix B ({rowsB}×{colsB}):',
    task2Hint1: 'Zeile mal Spalte: Der Eintrag C_ij entsteht durch das Skalarprodukt der i-ten Zeile von A mit der j-ten Spalte von B.',
    // Aufgabe 3 (Anwendung 2: Multiplikation mit Einheitsmatrix & Transponieren)
    task3Title: 'Aufgabe 3: Multiplikation mit Einheitsmatrix & Transponieren',
    task3Question: 'Multipliziere die 2×2-Matrix A mit der Einheitsmatrix I₂ und transponiere das Ergebnis:',
    task3Hint: 'Gesucht ist: C = (A · I₂)ᵀ',
    task3Subtext: 'Ergebnis anschließend transponieren: C = (A · I₂)ᵀ',
    task3Note: 'Tipp: Das Ergebnis ist eine transponierte 2×2-Matrix.',
    task3Hint1: 'Eigenschaft der Einheitsmatrix: A · I₂ = A. Transponiere anschließend durch Spiegelung an der Hauptdiagonale (Zeilen und Spalten vertauschen: C_12 = A_21, C_21 = A_12)!',
    // Aliase für 4, 5, 6
    task4TitleAdd: 'Aufgabe 1: Matrizenaddition ({dim}×{dim})',
    task4TitleSub: 'Aufgabe 1: Matrizensubtraktion ({dim}×{dim})',
    task4QuestionAdd: 'Berechne die Summe A + B der beiden {dim}×{dim}-Matrizen:',
    task4QuestionSub: 'Berechne die Differenz A - B der beiden {dim}×{dim}-Matrizen:',
    task4Hint1Add: 'Addiere die zueinander passenden Einträge: C_ij = A_ij + B_ij.',
    task4Hint1Sub: 'Subtrahiere zellenweise: C_ij = A_ij - B_ij. Minus einer negativen Zahl wird zum Plus (z.B. 3 - (-2) = 5).',
    task5Title: 'Aufgabe 2: Matrizenmultiplikation ({rowsA}×{colsA} · {rowsB}×{colsB})',
    task5Question: 'Multipliziere Matrix A ({rowsA}×{colsA}) mit Matrix B ({rowsB}×{colsB}):',
    task5Hint1: 'Zeile mal Spalte: Der Eintrag C_ij entsteht durch das Skalarprodukt der i-ten Zeile von A mit der j-ten Spalte von B.',
    task6Title: 'Aufgabe 3: Multiplikation mit Einheitsmatrix & Transponieren',
    task6Question: 'Multipliziere die 2×2-Matrix A mit der Einheitsmatrix I₂ und transponiere das Ergebnis:',
    task6Hint: 'Gesucht ist: C = (A · I₂)ᵀ',
    task6Subtext: 'Ergebnis anschließend transponieren: C = (A · I₂)ᵀ',
    task6Hint1: 'Eigenschaft der Einheitsmatrix: A · I₂ = A. Transponiere anschließend durch Spiegelung an der Hauptdiagonale (Zeilen und Spalten vertauschen: C_12 = A_21, C_21 = A_12)!',
  },
};

const LANG_KEY = 'la_app_language_v1';

export function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'de' || saved === 'en') return saved;
  } catch {
    // ignore
  }
  return 'en'; // English is the requested default
}

export function saveLanguage(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
}
