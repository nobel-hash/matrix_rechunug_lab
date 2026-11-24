/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, CheckCircle, RotateCcw, Target, ShieldCheck } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  maxPoints: number;
  solvedCount: number;
  attemptedCount: number;
  onReset: () => void;
  isExamMode?: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  maxPoints,
  solvedCount,
  attemptedCount,
  onReset,
  isExamMode = false,
}) => {
  const accuracy = attemptedCount > 0 ? Math.round((solvedCount / attemptedCount) * 100) : 0;
  const progressPercent = maxPoints > 0 ? Math.min(100, Math.round((score / maxPoints) * 100)) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              {isExamMode ? 'Prüfungsfortschritt' : 'Gesamtpunktestand & Lernfortschritt'}
            </h3>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Keine Doppelbepunktung
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Punkte werden pro neu generierter Aufgabe einmalig bei korrekter Lösung vergeben.
          </p>
        </div>

        {!isExamMode && (
          <button
            onClick={() => {
              if (window.confirm('Möchtest du deinen aktuellen Übungsfortschritt und Punktestand wirklich zurücksetzen?')) {
                onReset();
              }
            }}
            className="self-start sm:self-auto flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
            title="Punktestand zurücksetzen"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zurücksetzen</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        {/* Punktestand */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
          <span className="text-xs text-slate-500 font-medium">Aktuelle Punkte</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono text-blue-700 tabular-nums">
              {score}
            </span>
            {maxPoints > 0 && (
              <span className="text-xs text-slate-400 font-mono">/ {maxPoints}</span>
            )}
          </div>
        </div>

        {/* Gelöste Aufgaben */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
          <span className="text-xs text-slate-500 font-medium">Gelöste Aufgaben</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {solvedCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {attemptedCount} Versuche</span>
          </div>
        </div>

        {/* Erfolgsquote */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
          <span className="text-xs text-slate-500 font-medium">Erfolgsquote</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-800 tabular-nums">
              {accuracy}%
            </span>
          </div>
        </div>

        {/* SCORM / Status */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
          <span className="text-xs text-slate-500 font-medium">Lernstatus</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-semibold text-slate-800">
              {score >= 50 ? 'Sehr gut' : score >= 20 ? 'Auf gutem Weg' : 'In Bearbeitung'}
            </span>
          </div>
        </div>
      </div>

      {/* Fortschrittsbalken */}
      {maxPoints > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-mono">
            <span>Zielerreichung</span>
            <span className="tabular-nums font-semibold text-slate-700">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
