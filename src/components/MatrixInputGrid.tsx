/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';

interface MatrixInputGridProps {
  rows: number;
  cols: number;
  values: string[][];
  onChange: (row: number, col: number, val: string) => void;
  cellMatches?: boolean[][] | null;
  hasChecked?: boolean;
  disabled?: boolean;
  label?: string;
}

export const MatrixInputGrid: React.FC<MatrixInputGridProps> = ({
  rows,
  cols,
  values,
  onChange,
  cellMatches = null,
  hasChecked = false,
  disabled = false,
  label = 'C',
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[][]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault();
      if (c < cols - 1) {
        inputsRef.current[r]?.[c + 1]?.focus();
      } else if (r < rows - 1) {
        inputsRef.current[r + 1]?.[0]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (c > 0) {
        inputsRef.current[r]?.[c - 1]?.focus();
      } else if (r > 0) {
        inputsRef.current[r - 1]?.[cols - 1]?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (r < rows - 1) {
        inputsRef.current[r + 1]?.[c]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (r > 0) {
        inputsRef.current[r - 1]?.[c]?.focus();
      }
    }
  };

  return (
    <div className="inline-flex items-center gap-2 select-none">
      {label && (
        <span className="font-serif italic text-base md:text-lg text-slate-700 font-semibold">
          {label} =
        </span>
      )}
      <div className="relative inline-flex items-stretch p-1">
        {/* Left square bracket */}
        <div className="w-2 border-l-2 border-t-2 border-b-2 border-slate-400 rounded-l-xs mr-1" />

        {/* Inner grid */}
        <div
          className="grid gap-2 p-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(3.25rem, auto))` }}
        >
          {Array.from({ length: rows }).map((_, r) => {
            if (!inputsRef.current[r]) inputsRef.current[r] = [];

            return Array.from({ length: cols }).map((_, c) => {
              const val = values[r]?.[c] ?? '';
              const isMatch = cellMatches ? cellMatches[r]?.[c] : null;

              let statusClasses =
                'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900';

              if (hasChecked && isMatch === true) {
                statusClasses =
                  'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
              } else if (hasChecked && isMatch === false) {
                statusClasses =
                  'border-rose-400 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-300';
              }

              return (
                <input
                  key={`${r}-${c}`}
                  ref={(el) => {
                    inputsRef.current[r][c] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  value={val}
                  disabled={disabled}
                  onChange={(e) => onChange(r, c, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, r, c)}
                  placeholder={`c${r + 1}${c + 1}`}
                  aria-label={`Matrixelement Zeile ${r + 1}, Spalte ${c + 1}`}
                  className={`w-14 sm:w-16 h-10 text-center font-mono text-base rounded-md border shadow-xs transition-all outline-none tabular-nums ${statusClasses} ${
                    disabled ? 'opacity-85 cursor-not-allowed' : ''
                  }`}
                />
              );
            });
          })}
        </div>

        {/* Right square bracket */}
        <div className="w-2 border-r-2 border-t-2 border-b-2 border-slate-400 rounded-r-xs ml-1" />
      </div>
    </div>
  );
};
