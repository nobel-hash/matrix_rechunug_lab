/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';

interface VectorInputGridProps {
  values: string[];
  onChange: (index: number, val: string) => void;
  cellMatches?: boolean[] | null;
  hasChecked?: boolean;
  disabled?: boolean;
  label?: string;
}

export const VectorInputGrid: React.FC<VectorInputGridProps> = ({
  values,
  onChange,
  cellMatches = null,
  hasChecked = false,
  disabled = false,
  label = 'v',
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      if (idx < values.length - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      {label && (
        <span className="font-serif italic text-base md:text-lg text-slate-700 font-semibold select-none">
          {label} =
        </span>
      )}
      <div className="relative inline-flex items-center px-2 py-1">
        {/* Left parenthesis */}
        <span className="text-3xl md:text-4xl font-light text-slate-400 select-none leading-none -mr-1">(</span>

        <div className="flex flex-col gap-2 min-w-[3.5rem] px-1">
          {values.map((val, idx) => {
            const isMatch = cellMatches ? cellMatches[idx] : null;
            let statusClasses = 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900';

            if (hasChecked && isMatch === true) {
              statusClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
            } else if (hasChecked && isMatch === false) {
              statusClasses = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-300';
            }

            return (
              <div key={idx} className="relative flex items-center">
                <input
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  value={val}
                  disabled={disabled}
                  onChange={(e) => onChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  placeholder={`v${idx + 1}`}
                  aria-label={`Vektorkomponente ${idx + 1}`}
                  className={`w-14 sm:w-16 h-10 text-center font-mono text-base rounded-md border shadow-xs transition-all outline-none tabular-nums ${statusClasses} ${
                    disabled ? 'opacity-85 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Right parenthesis */}
        <span className="text-3xl md:text-4xl font-light text-slate-400 select-none leading-none -ml-1">)</span>
      </div>
    </div>
  );
};
