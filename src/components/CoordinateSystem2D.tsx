/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { translations } from '../services/i18nService.js';

interface Vector2D {
  x: number;
  y: number;
  color?: string;
  label?: string;
  dashed?: boolean;
}

interface CoordinateSystem2DProps {
  vectors?: Vector2D[];
  userVector?: [number, number] | null;
  onSetUserVector?: (val: [number, number]) => void;
  interactive?: boolean;
  expectedVector?: [number, number] | null;
  showExpected?: boolean;
  className?: string;
  lang?: 'en' | 'de';
  operation?: 'addition' | 'subtraction';
  rawInputs?: { v1?: number[]; v2?: number[]; vector?: number[] };
  pythagorasVector?: [number, number] | null;
  showResult?: boolean;
}

export const CoordinateSystem2D: React.FC<CoordinateSystem2DProps> = ({
  vectors = [],
  userVector = null,
  onSetUserVector,
  interactive = false,
  expectedVector = null,
  showExpected = false,
  className = '',
  lang = 'en',
  operation,
  rawInputs,
  pythagorasVector = null,
  showResult = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const t = translations[lang];

  const v1 = rawInputs?.v1;
  const v2 = rawInputs?.v2;
  const isSubtraction = operation === 'subtraction' && v1 && v2;
  const isAddition = operation === 'addition' && v1 && v2;
  const isPythagoras = !!pythagorasVector;

  // Bestimme sichtbaren Bereich basierend auf allen Vektorpunkten
  const allCoords = [
    ...vectors.flatMap((v) => [Math.abs(v.x), Math.abs(v.y)]),
    v1 ? Math.abs(v1[0]) : 0,
    v1 ? Math.abs(v1[1]) : 0,
    v2 ? Math.abs(v2[0]) : 0,
    v2 ? Math.abs(v2[1]) : 0,
    pythagorasVector ? Math.abs(pythagorasVector[0]) : 0,
    pythagorasVector ? Math.abs(pythagorasVector[1]) : 0,
    isSubtraction && v1 && v2 ? Math.abs(v1[0] - v2[0]) : 0,
    isSubtraction && v1 && v2 ? Math.abs(v1[1] - v2[1]) : 0,
    isAddition && v1 && v2 ? Math.abs(v1[0] + v2[0]) : 0,
    isAddition && v1 && v2 ? Math.abs(v1[1] + v2[1]) : 0,
    userVector ? Math.abs(userVector[0]) : 0,
    userVector ? Math.abs(userVector[1]) : 0,
    expectedVector ? Math.abs(expectedVector[0]) : 0,
    expectedVector ? Math.abs(expectedVector[1]) : 0,
    5,
  ];
  const maxVal = Math.max(...allCoords);
  const range = Math.max(7, Math.min(18, Math.ceil(maxVal + 2)));

  // SVG Dimensionen
  const size = 330;
  const padding = 28;
  const plotSize = size - 2 * padding;
  const center = size / 2;
  const scale = plotSize / (2 * range);

  const toSvgX = (x: number) => center + x * scale;
  const toSvgY = (y: number) => center - y * scale;

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive || !onSetUserVector || !svgRef.current) return;
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging && e.type !== 'pointerdown') return;
    if (!svgRef.current || !onSetUserVector) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const mathX = (clientX - center) / scale;
    const mathY = (center - clientY) / scale;

    const snappedX = Math.round(mathX);
    const snappedY = Math.round(mathY);

    if (snappedX >= -range && snappedX <= range && snappedY >= -range && snappedY <= range) {
      onSetUserVector([snappedX, snappedY]);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Pythagoras Werte falls aktiv
  const pvX = pythagorasVector ? pythagorasVector[0] : 0;
  const pvY = pythagorasVector ? pythagorasVector[1] : 0;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative border border-slate-200 rounded-lg bg-slate-50/70 p-2 shadow-2xs">
        <svg
          ref={svgRef}
          width={size}
          height={size}
          className={`overflow-visible ${interactive ? 'cursor-crosshair' : 'cursor-default'}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#d97706" />
            </marker>
            <marker id="arrow-amber-dim" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" opacity="0.6" />
            </marker>
            <marker id="arrow-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
            </marker>
            <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#7c3aed" />
            </marker>
          </defs>

          {/* Gitterlinien */}
          {Array.from({ length: 2 * range + 1 }).map((_, i) => {
            const val = i - range;
            if (val === 0) return null;
            return (
              <React.Fragment key={`grid-${val}`}>
                <line
                  x1={toSvgX(val)}
                  y1={toSvgY(-range)}
                  x2={toSvgX(val)}
                  y2={toSvgY(range)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <line
                  x1={toSvgX(-range)}
                  y1={toSvgY(val)}
                  x2={toSvgX(range)}
                  y2={toSvgY(val)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              </React.Fragment>
            );
          })}

          {/* SATZ DES PYTHAGORAS IM KOORDINATENSYSTEM (Aufgabe 3) */}
          {isPythagoras && (
            <g>
              {/* Ausfüllung des rechtwinkligen Dreiecks zwischen (0,0), (vx, 0) und (vx, vy) */}
              <polygon
                points={`${center},${center} ${toSvgX(pvX)},${center} ${toSvgX(pvX)},${toSvgY(pvY)}`}
                fill="#eff6ff"
                stroke="#bfdbfe"
                strokeWidth="1"
                opacity="0.85"
              />

              {/* Kathete 1: Horizontale Kathete entlang x-Achse */}
              <line
                x1={center}
                y1={center}
                x2={toSvgX(pvX)}
                y2={center}
                stroke="#d97706"
                strokeWidth="3"
              />
              {/* Kathete 2: Vertikale Kathete parallel zur y-Achse */}
              <line
                x1={toSvgX(pvX)}
                y1={center}
                x2={toSvgX(pvX)}
                y2={toSvgY(pvY)}
                stroke="#059669"
                strokeWidth="3"
              />

              {/* Rechter Winkel Symbol am Punkt (pvX, 0) */}
              {pvX !== 0 && pvY !== 0 && (() => {
                const cornerX = toSvgX(pvX);
                const cornerY = center;
                const signX = pvX > 0 ? -1 : 1;
                const signY = pvY > 0 ? -1 : 1;
                const rwSize = 10;
                return (
                  <g>
                    <path
                      d={`M ${cornerX + signX * rwSize} ${cornerY} L ${cornerX + signX * rwSize} ${cornerY + signY * rwSize} L ${cornerX} ${cornerY + signY * rwSize}`}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <circle cx={cornerX + signX * 5} cy={cornerY + signY * 5} r="1.5" fill="#475569" />
                  </g>
                );
              })()}

              {/* Hypotenuse: Vektor v vom Ursprung zu (vx, vy) */}
              <line
                x1={center}
                y1={center}
                x2={toSvgX(pvX)}
                y2={toSvgY(pvY)}
                stroke="#2563eb"
                strokeWidth="3.5"
                markerEnd="url(#arrow-blue)"
              />

              {/* Beschriftung der Kathete x (allgemein) */}
              <text
                x={toSvgX(pvX / 2)}
                y={center + (pvY > 0 ? 17 : -10)}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#d97706"
                fontFamily="monospace"
                style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 3, strokeLinejoin: 'round' }}
              >
                |v_x|
              </text>

              {/* Beschriftung der Kathete y (allgemein) */}
              <text
                x={toSvgX(pvX) + (pvX >= 0 ? 8 : -8)}
                y={toSvgY(pvY / 2) + 4}
                textAnchor={pvX >= 0 ? 'start' : 'end'}
                fontSize="11"
                fontWeight="bold"
                fill="#059669"
                fontFamily="monospace"
                style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 3, strokeLinejoin: 'round' }}
              >
                |v_y|
              </text>

              {/* Beschriftung der Hypotenuse */}
              <text
                x={toSvgX(pvX / 2) - (pvX > 0 ? 16 : -16)}
                y={toSvgY(pvY / 2) - 10}
                fontSize="12"
                fontWeight="bold"
                fill="#2563eb"
                fontFamily="monospace"
                style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 3, strokeLinejoin: 'round' }}
              >
                ||v||
              </text>
            </g>
          )}

          {/* Koordinatenachsen */}
          <line x1={center} y1={padding / 2} x2={center} y2={size - padding / 2} stroke="#64748b" strokeWidth="1.5" />
          <line x1={padding / 2} y1={center} x2={size - padding / 2} y2={center} stroke="#64748b" strokeWidth="1.5" />

          {/* Achsenbeschriftung */}
          <text x={size - padding + 8} y={center + 14} fontSize="11" fontWeight="bold" fill="#475569" fontStyle="italic">x</text>
          <text x={center + 8} y={padding - 8} fontSize="11" fontWeight="bold" fill="#475569" fontStyle="italic">y</text>

          {/* Zahlen an den Achsen mit dynamischem Schritt */}
          {(() => {
            const step = range > 12 ? 4 : range > 8 ? 2 : 1;
            const ticks: number[] = [];
            for (let val = -range + 1; val <= range - 1; val++) {
              if (val !== 0 && val % step === 0) ticks.push(val);
            }
            return ticks.map((tick) => (
              <React.Fragment key={`tick-${tick}`}>
                <text
                  x={toSvgX(tick)}
                  y={center + 13}
                  fontSize="9"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontFamily="monospace"
                  style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 2 }}
                >
                  {tick}
                </text>
                <text
                  x={center - 7}
                  y={toSvgY(tick) + 3}
                  fontSize="9"
                  textAnchor="end"
                  fill="#94a3b8"
                  fontFamily="monospace"
                  style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 2 }}
                >
                  {tick}
                </text>
              </React.Fragment>
            ));
          })()}

          {/* DREIECKSREGEL FÜR SUBTRAKTION: a - b = a + (-b) */}
          {isSubtraction && v1 && v2 && (
            <g>
              {/* 1. Vektor a vom Ursprung */}
              <line
                x1={center}
                y1={center}
                x2={toSvgX(v1[0])}
                y2={toSvgY(v1[1])}
                stroke="#2563eb"
                strokeWidth="2.5"
                markerEnd="url(#arrow-blue)"
              />
              <text
                x={toSvgX(v1[0] / 2) - 12}
                y={toSvgY(v1[1] / 2) - 8}
                fontSize="12"
                fontWeight="bold"
                fill="#2563eb"
              >
                a
              </text>

              {/* 2. Originalvektor b gestrichelt vom Ursprung zur Anschauung */}
              <line
                x1={center}
                y1={center}
                x2={toSvgX(v2[0])}
                y2={toSvgY(v2[1])}
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeDasharray="4 3"
                opacity="0.5"
                markerEnd="url(#arrow-amber-dim)"
              />
              <text
                x={toSvgX(v2[0]) + 6}
                y={toSvgY(v2[1]) + 4}
                fontSize="11"
                fill="#d97706"
                opacity="0.75"
              >
                +b
              </text>

              {/* 3. Umgedrehter Gegenvektor -b angehängt an die Spitze von a (Dreiecksregel!) */}
              <line
                x1={toSvgX(v1[0])}
                y1={toSvgY(v1[1])}
                x2={toSvgX(v1[0] - v2[0])}
                y2={toSvgY(v1[1] - v2[1])}
                stroke="#d97706"
                strokeWidth="2.5"
                markerEnd="url(#arrow-amber)"
              />
              <text
                x={toSvgX(v1[0] - v2[0] / 2) + 8}
                y={toSvgY(v1[1] - v2[1] / 2) - 6}
                fontSize="12"
                fontWeight="bold"
                fill="#d97706"
              >
                -b
              </text>

              {/* Verbindungslinie / Parallelogramm-Spur */}
              <line
                x1={toSvgX(v2[0])}
                y1={toSvgY(v2[1])}
                x2={toSvgX(v1[0])}
                y2={toSvgY(v1[1])}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* DREIECKSREGEL / PARALLELOGRAMM FÜR ADDITION: a + b */}
          {isAddition && v1 && v2 && (
            <g>
              {/* Vektor a vom Ursprung */}
              <line
                x1={center}
                y1={center}
                x2={toSvgX(v1[0])}
                y2={toSvgY(v1[1])}
                stroke="#2563eb"
                strokeWidth="2.5"
                markerEnd="url(#arrow-blue)"
              />
              <text x={toSvgX(v1[0] / 2) - 10} y={toSvgY(v1[1] / 2) - 6} fontSize="12" fontWeight="bold" fill="#2563eb">
                a
              </text>

              {/* Vektor b gestrichelt vom Ursprung */}
              <line
                x1={center}
                y1={center}
                x2={toSvgX(v2[0])}
                y2={toSvgY(v2[1])}
                stroke="#d97706"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                opacity="0.5"
                markerEnd="url(#arrow-amber-dim)"
              />

              {/* Vektor b angehängt an die Spitze von a */}
              <line
                x1={toSvgX(v1[0])}
                y1={toSvgY(v1[1])}
                x2={toSvgX(v1[0] + v2[0])}
                y2={toSvgY(v1[1] + v2[1])}
                stroke="#d97706"
                strokeWidth="2.5"
                markerEnd="url(#arrow-amber)"
              />
              <text x={toSvgX(v1[0] + v2[0] / 2) + 8} y={toSvgY(v1[1] + v2[1] / 2) - 6} fontSize="12" fontWeight="bold" fill="#d97706">
                b
              </text>

              {/* Parallelogramm Schließung */}
              <line
                x1={toSvgX(v2[0])}
                y1={toSvgY(v2[1])}
                x2={toSvgX(v1[0] + v2[0])}
                y2={toSvgY(v1[1] + v2[1])}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* Standard Vektoren (z.B. bei Skalarmultiplikation) */}
          {!isSubtraction && !isAddition && !isPythagoras && vectors.map((vec, idx) => {
            const markerColor =
              vec.color === '#d97706'
                ? 'arrow-amber'
                : vec.color === '#059669'
                ? 'arrow-emerald'
                : vec.color === '#7c3aed'
                ? 'arrow-purple'
                : 'arrow-blue';

            return (
              <g key={idx}>
                <line
                  x1={center}
                  y1={center}
                  x2={toSvgX(vec.x)}
                  y2={toSvgY(vec.y)}
                  stroke={vec.color || '#2563eb'}
                  strokeWidth="2.5"
                  strokeDasharray={vec.dashed ? '4 3' : undefined}
                  markerEnd={`url(#${markerColor})`}
                />
                {vec.label && (
                  <text
                    x={toSvgX(vec.x) + 7}
                    y={toSvgY(vec.y) - 6}
                    fontSize="11"
                    fontWeight="bold"
                    fill={vec.color || '#2563eb'}
                    fontStyle="italic"
                  >
                    {vec.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Benutzer-Ergebnisvektor (interaktiv) */}
          {userVector && (userVector[0] !== 0 || userVector[1] !== 0) && (
            <g>
              <line
                x1={center}
                y1={center}
                x2={toSvgX(userVector[0])}
                y2={toSvgY(userVector[1])}
                stroke="#7c3aed"
                strokeWidth="2.5"
                markerEnd="url(#arrow-purple)"
              />
              <circle
                cx={toSvgX(userVector[0])}
                cy={toSvgY(userVector[1])}
                r={interactive ? 6 : 4}
                fill="#7c3aed"
                stroke="#ffffff"
                strokeWidth="2"
                className={interactive ? 'cursor-grab hover:scale-125 transition-transform' : ''}
              />
              <text
                x={toSvgX(userVector[0]) + 8}
                y={toSvgY(userVector[1]) + 4}
                fontSize="11"
                fontWeight="bold"
                fill="#7c3aed"
                fontFamily="monospace"
              >
                ({userVector[0]}|{userVector[1]})
              </text>
            </g>
          )}

          {/* Richtige Lösung (falls Lösung geklickt) */}
          {showExpected && expectedVector && (
            <g>
              <line
                x1={center}
                y1={center}
                x2={toSvgX(expectedVector[0])}
                y2={toSvgY(expectedVector[1])}
                stroke="#059669"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                markerEnd="url(#arrow-emerald)"
              />
              <text
                x={toSvgX(expectedVector[0]) + 8}
                y={toSvgY(expectedVector[1]) - 6}
                fontSize="11"
                fontWeight="bold"
                fill="#059669"
                fontFamily="monospace"
              >
                {lang === 'en' ? 'Solution' : 'Lösung'}: ({expectedVector[0]}|{expectedVector[1]})
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Didaktischer Hinweis unter dem Graphen */}
      {isSubtraction && (
        <div className="mt-2 text-center text-xs font-mono text-slate-600 bg-amber-50/70 border border-amber-200/60 rounded px-2.5 py-1">
          <span className="font-bold text-amber-800">a - b = a + (-b)</span> · {t.triangleRuleSubtraction}
        </div>
      )}

      {/* Pythagoras Banner unter dem Koordinatensystem bei Aufgabe 3 - rein allgemeine Veranschaulichung */}
      {isPythagoras && (
        <div className="mt-2 text-center text-xs font-mono text-slate-700 bg-blue-50/70 border border-blue-200/60 rounded px-3 py-1.5 space-y-0.5 max-w-sm">
          <div className="font-semibold text-blue-800">
            {lang === 'en' ? 'Pythagorean Theorem (general):' : 'Satz des Pythagoras (allgemein):'}
          </div>
          <div className="text-[11px] text-slate-600">
            ||v||² = v_x² + v_y² ⇒ ||v|| = √(v_x² + v_y²)
          </div>
        </div>
      )}

      {interactive && onSetUserVector && (
        <p className="text-[11px] text-slate-500 mt-1.5 text-center">
          {t.clickCoordHint}
        </p>
      )}
    </div>
  );
};
