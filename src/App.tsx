/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExerciseCard } from './components/ExerciseCard';
import { generateTaskByNumber } from './services/exerciseGenerator.js';
import {
  loadSavedScoreState,
  recordExerciseAttempt,
  resetScoreState,
  isTaskAlreadyScored,
  TOTAL_MAX_POINTS,
  APP2_TASK_NUMBERS,
} from './services/scoringService.js';
import { scormService } from './services/scormService.js';
import {
  getInitialLanguage,
  saveLanguage,
  translations,
} from './services/i18nService.js';
import { RotateCw, RotateCcw } from 'lucide-react';

interface ScoreState {
  score: number;
  maxPossiblePoints: number;
  solvedCount: number;
  attemptedCount: number;
  solvedTaskIndices: number[];
  scoredExerciseIds: string[];
  attemptsHistory: any[];
}

export default function App() {
  // Sprache (Standard: 'en')
  const [lang, setLang] = useState<'en' | 'de'>(() => getInitialLanguage() as 'en' | 'de');

  // Anwendung 2: Aufgaben 1 bis 3 (Matrizenrechnung)
  const [currentTaskNumber, setCurrentTaskNumber] = useState<number>(1);
  const [matrixSizePreference, setMatrixSizePreference] = useState<number>(2);
  const [matrixPresetPreference, setMatrixPresetPreference] = useState<any>(null);

  // Punktestand (max. 30 Punkte für Aufgaben 1, 2, 3)
  const [scoreState, setScoreState] = useState<ScoreState>(() => loadSavedScoreState() as ScoreState);

  // Aktuelle Aufgabe (Start bei Aufgabe 1: Matrizenaddition/-subtraktion)
  const [currentExercise, setCurrentExercise] = useState<any>(() =>
    generateTaskByNumber(1, { size: 2 })
  );

  const t = translations[lang];

  // SCORM 1.2 Moodle Lifecycle: Beim Starten initialisieren und beim Verlassen beenden
  useEffect(() => {
    scormService.initialize();
    if (scormService.isAvailable()) {
      scormService.setScore(scoreState.score, TOTAL_MAX_POINTS, 0);
      if (scoreState.score >= TOTAL_MAX_POINTS) {
        scormService.setStatus('completed');
      } else if (scoreState.score > 0) {
        scormService.setStatus('incomplete');
      }
    }
    return () => {
      scormService.finish();
    };
  }, []);

  const handleToggleLang = (newLang: 'en' | 'de') => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  // Aufgabenwechsel (4 bis 6 für Anwendung 2)
  const handleSelectTask = (taskNum: number) => {
    if (!APP2_TASK_NUMBERS.includes(taskNum)) return;
    setCurrentTaskNumber(taskNum);
    const newEx = generateTaskByNumber(taskNum, {
      size: matrixSizePreference,
      preset: matrixPresetPreference,
    });
    setCurrentExercise(newEx);
  };

  // Nächste Aufgabe (Schritt nach vorne innerhalb von Aufgabe 4..6)
  const handleNextExercise = () => {
    const currentIndex = APP2_TASK_NUMBERS.indexOf(currentTaskNumber);
    const nextIndex = (currentIndex + 1) % APP2_TASK_NUMBERS.length;
    const nextNum = APP2_TASK_NUMBERS[nextIndex];
    setCurrentTaskNumber(nextNum);
    const newEx = generateTaskByNumber(nextNum, {
      size: matrixSizePreference,
      preset: matrixPresetPreference,
    });
    setCurrentExercise(newEx);
  };

  // Neue Zufallszahlen für dieselbe Aufgabennummer
  const handleRegenerateCurrentTask = () => {
    const newEx = generateTaskByNumber(currentTaskNumber, {
      size: matrixSizePreference,
      preset: matrixPresetPreference,
    });
    setCurrentExercise(newEx);
  };

  // Matrixgröße ändern (2x2 vs 3x3 für Aufgabe 4)
  const handleMatrixSizeChange = (size: number) => {
    setMatrixSizePreference(size);
    const newEx = generateTaskByNumber(currentTaskNumber, { size });
    setCurrentExercise(newEx);
  };

  // Matrix-Multiplikations-Preset ändern für Aufgabe 5
  const handleMatrixPresetChange = (preset: any) => {
    setMatrixPresetPreference(preset);
    const newEx = generateTaskByNumber(currentTaskNumber, { preset });
    setCurrentExercise(newEx);
  };

  // Punkte verbuchen (verhindert Doppelbepunktung)
  const handleRecordAttempt = (attempt: {
    exerciseId: string;
    taskNumber: number;
    isCorrect: boolean;
    customPoints?: number;
  }) => {
    const result = recordExerciseAttempt(scoreState, attempt);
    const nextState = result.nextState as ScoreState;
    setScoreState(nextState);

    // SCORM 1.2 Moodle Synchronisation im Hintergrund
    if (scormService.isAvailable() && result.pointsAwarded > 0) {
      scormService.setScore(nextState.score, TOTAL_MAX_POINTS, 0);
      if (nextState.score >= TOTAL_MAX_POINTS) {
        scormService.setStatus('completed');
      } else if (nextState.score > 0) {
        scormService.setStatus('incomplete');
      }
    }

    return result;
  };

  const handleResetScore = () => {
    if (window.confirm(t.resetConfirm)) {
      const fresh = resetScoreState() as ScoreState;
      setScoreState(fresh);
      if (scormService.isAvailable()) {
        scormService.setScore(0, TOTAL_MAX_POINTS, 0);
        scormService.setStatus('incomplete');
      }
    }
  };

  const isCurrentTaskScored = isTaskAlreadyScored(
    scoreState.solvedTaskIndices,
    currentTaskNumber
  );

  const solvedInApp2Count = (scoreState.solvedTaskIndices || []).filter((num: number) =>
    APP2_TASK_NUMBERS.includes(num)
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-800">
      {/* Header mit Sprachumschalter (EN / DE) und Punktestand (X / 30) */}
      <Header
        currentTaskNumber={currentTaskNumber}
        onSelectTask={handleSelectTask}
        score={scoreState.score}
        solvedTaskIndices={scoreState.solvedTaskIndices}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Hauptbereich */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        {/* Sub-Header mit Fortschritt & Neuerzeugung */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {t.task} {currentTaskNumber} ({t.taskOf.replace('{current}', String(APP2_TASK_NUMBERS.indexOf(currentTaskNumber) + 1)).replace('{total}', '3')})
            </span>
            <span className="text-xs text-slate-500">
              {t.solvedCount
                .replace('{count}', String(solvedInApp2Count))
                .replace('{total}', '3')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerateCurrentTask}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
              title={t.generateNewNumbers}
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.generateNewNumbers}</span>
            </button>

            <button
              onClick={handleResetScore}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title={t.resetScore}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.resetScore}</span>
            </button>
          </div>
        </div>

        {/* Die aktuelle Aufgabe */}
        {currentExercise && (
          <ExerciseCard
            exercise={currentExercise}
            currentTaskNumber={currentTaskNumber}
            onNextExercise={handleNextExercise}
            onRecordAttempt={handleRecordAttempt}
            isAlreadyScored={isCurrentTaskScored}
            onMatrixSizeChange={
              currentExercise.taskNumber === 1 || currentExercise.taskNumber === 4 ? handleMatrixSizeChange : undefined
            }
            onMatrixPresetChange={
              currentExercise.taskNumber === 2 || currentExercise.taskNumber === 5 ? handleMatrixPresetChange : undefined
            }
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-mono">
        {t.appSubtitle}
      </footer>
    </div>
  );
}
