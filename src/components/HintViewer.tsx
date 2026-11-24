/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lightbulb, ChevronDown, CheckCircle2, Unlock } from 'lucide-react';
import { translations } from '../services/i18nService.js';
import { SolutionViewer } from './SolutionViewer';

interface HintViewerProps {
  exercise: any;
  failedAttempts: number;
  isAlreadyScored: boolean;
  isCorrect: boolean | null;
  lang?: 'en' | 'de';
}

export const HintViewer: React.FC<HintViewerProps> = ({
  exercise,
  failedAttempts,
  isAlreadyScored,
  isCorrect,
  lang = 'en',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSolutionUnlocked, setShowSolutionUnlocked] = useState(false);
  const t = translations[lang];

  // Lösung ist freigeschaltet wenn:
  // - Mindestens 2 Fehlversuche gemacht wurden, ODER
  // - Die Aufgabe bereits früher bepunktet wurde (Üben mit neuen Zahlen), ODER
  // - Die Aufgabe soeben richtig gelöst wurde!
  const isSolutionUnlocked = failedAttempts >= 2 || isAlreadyScored || isCorrect === true;

  // Bestimme Hinweistext 1 (Konzept)
  let hint1 = '';
  if (exercise.taskNumber === 1) {
    hint1 = exercise.subOperation === 'addition' ? t.task1Hint1Add : t.task1Hint1Sub;
  } else if (exercise.taskNumber === 2) {
    hint1 = t.task2Hint1;
  } else if (exercise.taskNumber === 3) {
    hint1 = t.task3Hint1;
  } else if (exercise.taskNumber === 4) {
    hint1 = exercise.subOperation === 'addition' ? t.task4Hint1Add : t.task4Hint1Sub;
  } else if (exercise.taskNumber === 5) {
    hint1 = t.task5Hint1;
  } else if (exercise.taskNumber === 6) {
    hint1 = t.task6Hint1;
  }

  // Bestimme Hinweistext 2 (Konkreter Zwischenschritt)
  let hint2 = '';
  if (exercise.taskNumber === 1 && exercise.inputs?.v1 && exercise.inputs?.v2) {
    const op = exercise.operator || '+';
    hint2 = lang === 'en'
      ? `First component: ${exercise.inputs.v1[0]} ${op} (${exercise.inputs.v2[0]}) = ${exercise.expectedResult[0]}`
      : `Erste Zeile: ${exercise.inputs.v1[0]} ${op} (${exercise.inputs.v2[0]}) = ${exercise.expectedResult[0]}`;
  } else if (exercise.taskNumber === 2 && exercise.inputs?.vector) {
    hint2 = lang === 'en'
      ? `First coordinate: ${exercise.scalar} · (${exercise.inputs.vector[0]}) = ${exercise.expectedResult[0]}`
      : `Erste Koordinate: ${exercise.scalar} · (${exercise.inputs.vector[0]}) = ${exercise.expectedResult[0]}`;
  } else if (exercise.taskNumber === 3 && exercise.inputs?.vector) {
    const sqSum = exercise.inputs.vector.map((x: number) => x * x).reduce((a: number, b: number) => a + b, 0);
    hint2 = lang === 'en'
      ? `Sum of squared components: ${exercise.inputs.vector.map((x: number) => `(${x})²`).join(' + ')} = ${sqSum}`
      : `Summe der Quadrate: ${exercise.inputs.vector.map((x: number) => `(${x})²`).join(' + ')} = ${sqSum}`;
  } else if (exercise.taskNumber === 4 && exercise.inputs?.A && exercise.inputs?.B) {
    const op = exercise.operator || '+';
    hint2 = lang === 'en'
      ? `Top-left entry: ${exercise.inputs.A[0][0]} ${op} (${exercise.inputs.B[0][0]}) = ${exercise.expectedResult[0][0]}`
      : `Eintrag oben links: ${exercise.inputs.A[0][0]} ${op} (${exercise.inputs.B[0][0]}) = ${exercise.expectedResult[0][0]}`;
  } else if (exercise.taskNumber === 5 && exercise.inputs?.A && exercise.inputs?.B) {
    const rA = exercise.inputs.A[0];
    const cB = exercise.inputs.B.map((row: number[]) => row[0]);
    const terms = rA.map((val: number, i: number) => `${val} · (${cB[i]})`).join(' + ');
    hint2 = lang === 'en'
      ? `Cell C₁₁ (Row 1 of A · Column 1 of B): ${terms} = ${exercise.expectedResult[0][0]}`
      : `Zelle C₁₁ (Zeile 1 von A · Spalte 1 von B): ${terms} = ${exercise.expectedResult[0][0]}`;
  } else if (exercise.taskNumber === 6 && exercise.inputs?.A) {
    hint2 = lang === 'en'
      ? `Transposing swaps rows and columns: The rows of A become the columns of C.`
      : `Transponieren vertauscht Zeilen und Spalten: Die Zeilen von A werden zu den Spalten von C.`;
  }

  // Zeige den Bereich nur wenn Fehlversuche da sind, oder die Aufgabe gelöst/bepunktet ist, oder der Nutzer manuell öffnet
  const hasFailedAttempt = failedAttempts > 0;
  if (!hasFailedAttempt && !isAlreadyScored && isCorrect !== true) {
    return null;
  }

  return (
    <div className="mt-5 border border-amber-200 bg-amber-50/50 rounded-lg overflow-hidden shadow-2xs transition-all">
      {/* Kopfbereich: Tipp / Lösung aufklappen */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100/70 text-left transition-colors cursor-pointer border-b border-amber-200/70"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-sm font-semibold text-amber-900">
            {isSolutionUnlocked
              ? `${t.hint} & ${lang === 'en' ? 'Solution' : 'Musterlösung'}`
              : `${t.hint} (${lang === 'en' ? 'Available' : 'Verfügbar'})`}
          </span>
          {failedAttempts > 0 && !isSolutionUnlocked && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
              {failedAttempts} {lang === 'en' ? 'attempt(s)' : 'Fehlversuch(e)'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800">
          <span>{isOpen ? (lang === 'en' ? 'Hide' : 'Verbergen') : (lang === 'en' ? 'Show' : 'Anzeigen')}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Inhalt der Tipps */}
      {isOpen && (
        <div className="p-4 sm:p-5 bg-white text-slate-800 space-y-4">
          {/* Tipp 1: Konzept */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <h5 className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.hint1Title}</span>
            </h5>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{hint1}</p>
          </div>

          {/* Tipp 2: Konkreter Zwischenschritt (ab 1-2 Versuchen) */}
          {hint2 && (
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-md">
              <h5 className="text-xs font-bold font-mono text-blue-800 uppercase tracking-wider mb-1">
                {t.hint2Title}
              </h5>
              <p className="text-xs sm:text-sm text-blue-900 font-mono leading-relaxed">{hint2}</p>
            </div>
          )}

          {/* Freischaltung der Musterlösung */}
          {isSolutionUnlocked ? (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1 font-mono">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  {t.solutionUnlockedNotice}
                </span>
                <button
                  onClick={() => setShowSolutionUnlocked((prev) => !prev)}
                  className="text-xs text-blue-700 hover:text-blue-800 font-semibold cursor-pointer underline"
                >
                  {showSolutionUnlocked ? t.hideSolution : t.showSolution}
                </button>
              </div>

              {showSolutionUnlocked && (
                <SolutionViewer
                  expectedResult={exercise.expectedResult}
                  inputType={exercise.inputType}
                  isOpen={true}
                  onToggle={() => setShowSolutionUnlocked(false)}
                  lang={lang}
                />
              )}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono italic text-center pt-1">
              {lang === 'en'
                ? `Tip: Make at least 2 attempts to unlock the direct solution (current: ${failedAttempts}/2).`
                : `Tipp: Mache mindestens 2 Versuche, um die direkte Musterlösung freizuschalten (aktuell: ${failedAttempts}/2).`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
