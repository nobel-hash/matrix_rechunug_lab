/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { translations } from '../services/i18nService.js';
import { Triangle } from 'lucide-react';

interface MagnitudeVisualizerProps {
  vector: number[];
  dimension: number;
  lang?: 'en' | 'de';
}

export const MagnitudeVisualizer: React.FC<MagnitudeVisualizerProps> = ({
  vector,
  dimension,
  lang = 'en',
}) => {
  const t = translations[lang];

  if (!vector || vector.length < 2) return null;

  const vx = vector[0];
  const vy = vector[1];
  const vz = dimension === 3 ? vector[2] : null;

  const sqX = vx * vx;
  const sqY = vy * vy;
  const sqZ = vz !== null ? vz * vz : 0;
  const sumSquares = sqX + sqY + sqZ;
  const magnitude = Math.sqrt(sumSquares);
  const isInteger = Number.isInteger(magnitude);

  // 2D SVG Geometrie des rechtwinkligen Dreiecks
  const size = 260;
  const padding = 36;
  const plotWidth = size - 2 * padding;

  const absX = Math.max(1, Math.abs(vx));
  const absY = Math.max(1, Math.abs(vy));
  const maxLeg = Math.max(absX, absY);
  const scale = (plotWidth * 0.85) / maxLeg;

  // Koordinaten im Dreieck
  const startX = padding;
  const startY = size - padding;
  const cornerX = startX + absX * scale;
  const cornerY = startY;
  const tipX = cornerX;
  const tipY = startY - absY * scale;

  return (
    <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg p-4 shadow-2xs max-w-md w-full">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 font-mono mb-2 self-start">
        <Triangle className="w-4 h-4 text-blue-600" />
        <span>{t.pythagorasVisualization}</span>
      </div>

      {/* SVG Rechtwinkliges Dreieck */}
      <svg width={size} height={size - 20} className="overflow-visible select-none">
        <defs>
          <marker id="hypo-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
          </marker>
        </defs>

        {/* Ausfüllung des rechtwinkligen Dreiecks */}
        <polygon
          points={`${startX},${startY} ${cornerX},${cornerY} ${tipX},${tipY}`}
          fill="#eff6ff"
          stroke="#bfdbfe"
          strokeWidth="1"
        />

        {/* Rechter Winkel Symbol am Eckpunkt */}
        <rect
          x={cornerX - 12}
          y={cornerY - 12}
          width="12"
          height="12"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <circle cx={cornerX - 6} cy={cornerY - 6} r="1.5" fill="#64748b" />

        {/* Kathete a (x-Achse) */}
        <line
          x1={startX}
          y1={startY}
          x2={cornerX}
          y2={cornerY}
          stroke="#d97706"
          strokeWidth="2.5"
        />
        <text
          x={(startX + cornerX) / 2}
          y={startY + 16}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#d97706"
          fontFamily="monospace"
        >
          |v₁| = {Math.abs(vx)} ({vx}² = {sqX})
        </text>

        {/* Kathete b (y-Achse) */}
        <line
          x1={cornerX}
          y1={cornerY}
          x2={tipX}
          y2={tipY}
          stroke="#059669"
          strokeWidth="2.5"
        />
        <text
          x={cornerX + 8}
          y={(cornerY + tipY) / 2 + 4}
          fontSize="11"
          fontWeight="bold"
          fill="#059669"
          fontFamily="monospace"
        >
          |v₂| = {Math.abs(vy)} ({vy}² = {sqY})
        </text>

        {/* Hypotenuse c (Vektor v) */}
        <line
          x1={startX}
          y1={startY}
          x2={tipX}
          y2={tipY}
          stroke="#2563eb"
          strokeWidth="3"
          markerEnd="url(#hypo-arrow)"
        />
        <text
          x={(startX + tipX) / 2 - 14}
          y={(startY + tipY) / 2 - 8}
          fontSize="12"
          fontWeight="bold"
          fill="#2563eb"
          fontFamily="monospace"
        >
          ||v||
        </text>
      </svg>

      {/* Formelerläuterung Pythagoras */}
      <div className="w-full mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded text-center font-mono text-xs text-slate-700 space-y-1">
        <div className="font-semibold text-blue-700">
          {dimension === 2 ? t.pythagorasFormula : t.pythagoras3DFormula}
        </div>
        <div className="text-[11px] text-slate-600">
          {dimension === 2 ? (
            <span>
              ||v|| = √({sqX} + {sqY}) = √{sumSquares}
              {isInteger ? ` = ${magnitude}` : ` ≈ ${magnitude.toFixed(2)}`}
            </span>
          ) : (
            <span>
              ||v|| = √({sqX} + {sqY} + {sqZ}) = √{sumSquares}
              {isInteger ? ` = ${magnitude}` : ` ≈ ${magnitude.toFixed(2)}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
