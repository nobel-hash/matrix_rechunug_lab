/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';

interface ScalarInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  isCorrect?: boolean | null;
  hasChecked?: boolean;
  disabled?: boolean;
  label?: string;
  unitHint?: string;
}

export const ScalarInput: React.FC<ScalarInputProps> = ({
  value,
  onChange,
  onSubmit,
  isCorrect = null,
  hasChecked = false,
  disabled = false,
  label = '||v||',
  unitHint,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  let statusClasses = 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900';
  if (hasChecked && isCorrect === true) {
    statusClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
  } else if (hasChecked && isCorrect === false) {
    statusClasses = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-300';
  }

  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="inline-flex items-center gap-3">
        {label && (
          <span className="font-serif italic text-base md:text-lg text-slate-700 font-semibold select-none">
            {label} =
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="z.B. 5 oder 7.21"
          aria-label="Skalarer Ergebniswert"
          className={`w-36 sm:w-44 h-11 px-3 text-center font-mono text-base md:text-lg rounded-md border shadow-xs transition-all outline-none tabular-nums ${statusClasses} ${
            disabled ? 'opacity-85 cursor-not-allowed' : ''
          }`}
        />
      </div>
      {unitHint && (
        <p className="text-xs text-slate-500 pl-1">{unitHint}</p>
      )}
    </div>
  );
};
