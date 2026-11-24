/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VectorView, MatrixView } from './MathView';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { translations } from '../services/i18nService.js';

interface SolutionViewerProps {
  expectedResult: any;
  inputType: 'vector' | 'matrix' | 'scalar';
  isOpen: boolean;
  onToggle: () => void;
  resultLabel?: string;
  lang?: 'en' | 'de';
}

export const SolutionViewer: React.FC<SolutionViewerProps> = ({
  expectedResult,
  inputType,
  isOpen,
  onToggle,
  resultLabel,
  lang = 'en',
}) => {
  const t = translations[lang];
  const displayLabel = resultLabel || (lang === 'en' ? 'Solution' : 'Lösung');

  return (
    <div className="mt-5 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/80 hover:bg-slate-100/80 text-left transition-colors cursor-pointer border-b border-slate-200"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold text-slate-800">
            {isOpen ? t.hideSolution : t.showSolution}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span>{isOpen ? (lang === 'en' ? 'Hide' : 'Verbergen') : (lang === 'en' ? 'Show' : 'Einblenden')}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 bg-white text-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 font-mono">
            {t.exactResult}
          </span>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-center">
            {inputType === 'vector' && Array.isArray(expectedResult) && (
              <VectorView vector={expectedResult} label={displayLabel} />
            )}

            {inputType === 'matrix' && Array.isArray(expectedResult) && (
              <MatrixView matrix={expectedResult} label={displayLabel} />
            )}

            {inputType === 'scalar' && (
              <div className="flex items-center gap-2">
                <span className="font-serif italic text-base text-slate-700 font-semibold">
                  ||v|| =
                </span>
                <span className="font-mono font-bold text-lg text-emerald-900 bg-white px-3 py-1 rounded border border-emerald-300 shadow-2xs">
                  {expectedResult}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
