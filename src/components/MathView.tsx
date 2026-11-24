/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface VectorViewProps {
  vector: number[];
  label?: string;
  highlightIndices?: number[];
  className?: string;
}

export const VectorView: React.FC<VectorViewProps> = ({
  vector,
  label,
  highlightIndices = [],
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 font-mono select-none ${className}`}>
      {label && <span className="font-serif italic text-base md:text-lg text-slate-700 mr-0.5">{label} =</span>}
      <div className="relative inline-flex items-center px-2 py-1">
        {/* Left tall parenthesis bracket */}
        <span className="text-2xl md:text-3xl font-light text-slate-400 select-none -mr-0.5 leading-none">(</span>
        <div className="flex flex-col items-center justify-center gap-1 min-w-[2rem] px-1">
          {vector.map((val, idx) => {
            const isHighlighted = highlightIndices.includes(idx);
            return (
              <span
                key={idx}
                className={`text-sm md:text-base font-semibold tabular-nums text-center transition-colors ${
                  isHighlighted ? 'text-blue-600 font-bold' : 'text-slate-800'
                }`}
              >
                {val}
              </span>
            );
          })}
        </div>
        {/* Right tall parenthesis bracket */}
        <span className="text-2xl md:text-3xl font-light text-slate-400 select-none -ml-0.5 leading-none">)</span>
      </div>
    </div>
  );
};

interface MatrixViewProps {
  matrix: number[][];
  label?: string;
  highlightRow?: number | null;
  highlightCol?: number | null;
  className?: string;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  matrix,
  label,
  highlightRow = null,
  highlightCol = null,
  className = '',
}) => {
  if (!matrix || matrix.length === 0) return null;
  const cols = matrix[0]?.length || 0;

  return (
    <div className={`inline-flex items-center gap-2 font-mono select-none ${className}`}>
      {label && <span className="font-serif italic text-base md:text-lg text-slate-700 mr-0.5">{label} =</span>}
      <div className="relative inline-flex items-stretch p-1">
        {/* Left square bracket */}
        <div className="w-1.5 border-l-2 border-t-2 border-b-2 border-slate-400 rounded-l-sm" />
        <div
          className="grid gap-x-3 gap-y-1.5 px-2 py-1 items-center justify-items-center"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(1.75rem, auto))` }}
        >
          {matrix.map((row, r) =>
            row.map((val, c) => {
              const isRowMatch = highlightRow === r;
              const isColMatch = highlightCol === c;
              const isFocal = isRowMatch && isColMatch;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`text-sm md:text-base font-semibold tabular-nums text-center px-1.5 py-0.5 rounded transition-colors ${
                    isFocal
                      ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-400'
                      : isRowMatch || isColMatch
                      ? 'bg-slate-100 text-blue-700'
                      : 'text-slate-800'
                  }`}
                >
                  {val}
                </div>
              );
            })
          )}
        </div>
        {/* Right square bracket */}
        <div className="w-1.5 border-r-2 border-t-2 border-b-2 border-slate-400 rounded-r-sm" />
      </div>
    </div>
  );
};
