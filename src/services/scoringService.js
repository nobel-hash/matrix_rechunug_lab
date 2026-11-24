/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * scoringService.js
 * Modul für Punkteberechnung mit strikter Obergrenze pro Aufgabe:
 * Jede Aufgabe (1 bis 6) kann maximal nur ihre festgelegte Wertigkeit beitragen,
 * auch wenn sie mit neu generierten Zahlen mehrfach gelöst wird.
 */

export const TASK_POINTS = Object.freeze({
  1: 5,  // Aufgabe 1 (App 2): Matrizenaddition / -subtraktion (max. 5 Pkt)
  2: 15, // Aufgabe 2 (App 2): Matrizenmultiplikation (max. 15 Pkt)
  3: 10, // Aufgabe 3 (App 2): Multiplikation mit Einheitsmatrix & Transponieren (max. 10 Pkt)
  // Kompatibilitäts-Aliase
  4: 5,
  5: 15,
  6: 10,
});

export const APP1_TASK_NUMBERS = [1, 2, 3];
export const APP2_TASK_NUMBERS = [1, 2, 3];
export const TOTAL_MAX_POINTS = 30; // Anwendung 2: Aufgaben 1, 2, 3 (5 + 15 + 10 = 30 Punkte)

const STORAGE_KEY = 'la_exercise_score_state_app2_v2';

/**
 * Erstellt den initialen Zustand für das Punktesystem
 * @returns {object} Initial state
 */
export function createInitialScoreState() {
  return {
    score: 0,
    maxPossiblePoints: TOTAL_MAX_POINTS,
    solvedCount: 0,
    attemptedCount: 0,
    solvedTaskIndices: [], // Liste der gelösten Aufgaben [1..6]
    attemptsHistory: [],
  };
}

/**
 * Lädt den gespeicherten Zustand aus dem localStorage
 * @returns {object}
 */
export function loadSavedScoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialScoreState();
    const parsed = JSON.parse(raw);
    const solvedIndices = Array.isArray(parsed.solvedTaskIndices) ? parsed.solvedTaskIndices : [];
    
    // Berechne den Punktestand strikt aus den gelösten Aufgabennummern
    const recalculateScore = solvedIndices.reduce(
      (sum, num) => sum + (TASK_POINTS[num] || 0),
      0
    );

    return {
      ...createInitialScoreState(),
      ...parsed,
      score: recalculateScore,
      maxPossiblePoints: TOTAL_MAX_POINTS,
      solvedTaskIndices: solvedIndices,
    };
  } catch {
    return createInitialScoreState();
  }
}

/**
 * Speichert den Zustand im localStorage
 * @param {object} state 
 */
export function saveScoreState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Setzt den Punktestand zurück
 * @returns {object}
 */
export function resetScoreState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return createInitialScoreState();
}

/**
 * Prüft, ob für eine bestimmte Aufgabennummer (1 bis 6) bereits Punkte vergeben wurden
 * @param {number[]} solvedTaskIndices 
 * @param {number} taskNumber 
 * @returns {boolean}
 */
export function isTaskAlreadyScored(solvedTaskIndices, taskNumber) {
  return Array.isArray(solvedTaskIndices) && solvedTaskIndices.includes(taskNumber);
}

/**
 * Registriert eine Antwort und vergibt Punkte:
 * Für jede Aufgabennummer (1-6) kann MAXIMAL EINMAL die Punktzahl erhalten werden.
 * Wiederholtes Lösen mit neuen Zufallszahlen bringt keine weiteren Punkte für dieselbe Aufgabe.
 * 
 * @param {object} currentState 
 * @param {object} attempt
 * @param {string} attempt.exerciseId Eindeutige Aufgaben-ID
 * @param {number} attempt.taskNumber Aufgabennummer (1 bis 6)
 * @param {boolean} attempt.isCorrect Ob die Antwort richtig war
 * @param {number} [attempt.customPoints] Optional abweichende Punktzahl
 * @returns {{ nextState: object, pointsAwarded: number, alreadyScored: boolean }}
 */
export function recordExerciseAttempt(currentState, attempt) {
  const { exerciseId, taskNumber, isCorrect, customPoints } = attempt;
  const standardPoints = customPoints ?? TASK_POINTS[taskNumber] ?? 5;
  const alreadyScored = isTaskAlreadyScored(currentState.solvedTaskIndices, taskNumber);

  let pointsAwarded = 0;
  const nextSolvedIndices = Array.isArray(currentState.solvedTaskIndices)
    ? [...currentState.solvedTaskIndices]
    : [];

  if (isCorrect && !alreadyScored) {
    pointsAwarded = standardPoints;
    nextSolvedIndices.push(taskNumber);
  }

  // Gesamtpunktestand wird strikt als Summe der einmalig gelösten Aufgaben berechnet
  const computedTotalScore = nextSolvedIndices.reduce(
    (sum, num) => sum + (TASK_POINTS[num] || 0),
    0
  );

  const nextState = {
    ...currentState,
    score: computedTotalScore,
    maxPossiblePoints: TOTAL_MAX_POINTS,
    solvedCount: isCorrect ? currentState.solvedCount + 1 : currentState.solvedCount,
    attemptedCount: currentState.attemptedCount + 1,
    solvedTaskIndices: nextSolvedIndices,
    attemptsHistory: [
      ...currentState.attemptsHistory,
      {
        exerciseId,
        taskNumber,
        isCorrect,
        pointsAwarded,
        timestamp: Date.now(),
      },
    ],
  };

  saveScoreState(nextState);

  return {
    nextState,
    pointsAwarded,
    alreadyScored,
  };
}
