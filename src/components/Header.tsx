/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { TOTAL_MAX_POINTS } from '../services/scoringService.js';
import { translations } from '../services/i18nService.js';

interface HeaderProps {
  currentTaskNumber: number;
  onSelectTask: (num: number) => void;
  score: number;
  solvedTaskIndices: number[];
  lang: 'en' | 'de';
  onToggleLang: (lang: 'en' | 'de') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTaskNumber,
  onSelectTask,
  score,
  solvedTaskIndices = [],
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];
  // Anwendung 2: Aufgaben 1 bis 3
  const tasks = [1, 2, 3];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-md bg-blue-700 flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
            LA
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            {t.appTitle}
          </span>
        </div>

        {/* Zone 2: Schnellauswahl der 6 Aufgaben (1 bis 6) */}
        <div className="hidden sm:flex items-center gap-1.5">
          {tasks.map((taskNum) => {
            const isActive = currentTaskNumber === taskNum;
            const isSolved = solvedTaskIndices.includes(taskNum);

            return (
              <button
                key={taskNum}
                onClick={() => onSelectTask(taskNum)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs'
                    : isSolved
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{t.task} {taskNum}</span>
                {isSolved && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Zone 3: Sprache & Punktestand */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Sprach-Umschalter (EN / DE) */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-mono font-bold">
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="English (Default)"
            >
              EN
            </button>
            <button
              onClick={() => onToggleLang('de')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                lang === 'de'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Deutsch"
            >
              DE
            </button>
          </div>


          {/* Punktestand */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50/80 border border-blue-200 rounded-lg text-sm font-medium text-slate-800 shadow-2xs">
            <Award className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs text-slate-500 font-medium hidden xs:inline">{t.points}:</span>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="font-bold text-blue-700 text-base tabular-nums">{score}</span>
              <span className="text-slate-400 text-xs">/ {TOTAL_MAX_POINTS}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Subbar für Aufgaben-Auswahl */}
      <div className="flex sm:hidden border-t border-slate-100 bg-slate-50/80 px-3 py-2 gap-2 overflow-x-auto justify-between">
        {tasks.map((taskNum) => {
          const isActive = currentTaskNumber === taskNum;
          const isSolved = solvedTaskIndices.includes(taskNum);

          return (
            <button
              key={taskNum}
              onClick={() => onSelectTask(taskNum)}
              className={`flex-1 py-1 px-2 rounded font-mono text-xs font-bold text-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : isSolved
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              T{taskNum}
            </button>
          );
        })}
      </div>
    </header>
  );
};
