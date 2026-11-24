/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { translations } from '../services/i18nService.js';

interface Vector3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  label?: string;
}

interface CoordinateSystem3DProps {
  vectors?: Vector3D[];
  userVector?: [number, number, number] | null;
  onSetUserVector?: (val: [number, number, number]) => void;
  interactive?: boolean;
  expectedVector?: [number, number, number] | null;
  showExpected?: boolean;
  className?: string;
  lang?: 'en' | 'de';
  pythagorasVector?: [number, number, number] | null;
  showResult?: boolean;
}

export const CoordinateSystem3D: React.FC<CoordinateSystem3DProps> = ({
  vectors = [],
  userVector = null,
  onSetUserVector,
  interactive = false,
  expectedVector = null,
  showExpected = false,
  className = '',
  lang = 'en',
  pythagorasVector = null,
  showResult = false,
}) => {
  const [angle, setAngle] = useState<number>(35); // Drehwinkel in Grad
  const t = translations[lang];

  const size = 320;
  const center = size / 2;

  // Dynamischer Wertebereich basierend auf Koordinaten
  const maxCoord = Math.max(
    ...vectors.flatMap((v) => [Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)]),
    pythagorasVector ? Math.max(Math.abs(pythagorasVector[0]), Math.abs(pythagorasVector[1]), Math.abs(pythagorasVector[2])) : 0,
    6
  );
  const range = Math.max(8, Math.ceil(maxCoord + 1.5));
  const scale = Math.max(7, Math.min(15, Math.floor(125 / range)));

  const rad = (angle * Math.PI) / 180;
  const project = (x: number, y: number, z: number) => {
    const rotX = x * Math.cos(rad) - y * Math.sin(rad);
    const rotY = x * Math.sin(rad) + y * Math.cos(rad);

    const screenX = center + rotY * scale - rotX * scale * 0.65;
    const screenY = center - z * scale + rotX * scale * 0.45;
    return { x: screenX, y: screenY };
  };

  const origin = project(0, 0, 0);
  const axisX = project(range, 0, 0);
  const axisY = project(0, range, 0);
  const axisZ = project(0, 0, range);
  const axisXNeg = project(-range, 0, 0);
  const axisYNeg = project(0, -range, 0);
  const axisZNeg = project(0, 0, -range);

  // Pythagoras Werte falls aktiv
  const pvX = pythagorasVector ? pythagorasVector[0] : 0;
  const pvY = pythagorasVector ? pythagorasVector[1] : 0;
  const pvZ = pythagorasVector ? pythagorasVector[2] : 0;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative border border-slate-200 rounded-lg bg-slate-50/70 p-2 shadow-2xs">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <marker id="arrow-3d-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
            </marker>
            <marker id="arrow-3d-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#d97706" />
            </marker>
            <marker id="arrow-3d-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
            </marker>
            <marker id="arrow-3d-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#7c3aed" />
            </marker>
          </defs>

          {/* Achsen negativ gestrichelt */}
          <line x1={origin.x} y1={origin.y} x2={axisXNeg.x} y2={axisXNeg.y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={origin.x} y1={origin.y} x2={axisYNeg.x} y2={axisYNeg.y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={origin.x} y1={origin.y} x2={axisZNeg.x} y2={axisZNeg.y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

          {/* Boden-Gitter */}
          {[-4, -2, 2, 4].map((coord) => {
            const p1 = project(coord, -4, 0);
            const p2 = project(coord, 4, 0);
            const q1 = project(-4, coord, 0);
            const q2 = project(4, coord, 0);
            return (
              <React.Fragment key={coord}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#e2e8f0" strokeWidth="1" />
                <line x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y} stroke="#e2e8f0" strokeWidth="1" />
              </React.Fragment>
            );
          })}

          {/* RÄUMLICHER PYTHAGORAS IM 3D-SYSTEM (Aufgabe 3) */}
          {pythagorasVector && (() => {
            const ptX = project(pvX, 0, 0);
            const ptGround = project(pvX, pvY, 0);
            const ptTip = project(pvX, pvY, pvZ);

            return (
              <g>
                {/* 1. Bodendreieck: (0,0,0) -> (vx,0,0) -> (vx,vy,0) */}
                <polygon
                  points={`${origin.x},${origin.y} ${ptX.x},${ptX.y} ${ptGround.x},${ptGround.y}`}
                  fill="#eff6ff"
                  stroke="#bfdbfe"
                  strokeWidth="1"
                  opacity="0.8"
                />

                {/* Kathete x auf x-Achse */}
                <line x1={origin.x} y1={origin.y} x2={ptX.x} y2={ptX.y} stroke="#d97706" strokeWidth="2.5" />
                {/* Kathete y parallel zu y-Achse */}
                <line x1={ptX.x} y1={ptX.y} x2={ptGround.x} y2={ptGround.y} stroke="#059669" strokeWidth="2.5" />
                {/* Bodendiagonale d_xy */}
                <line x1={origin.x} y1={origin.y} x2={ptGround.x} y2={ptGround.y} stroke="#3b82f6" strokeWidth="1.8" strokeDasharray="3 3" />

                {/* 2. Vertikale Kathete z: (vx,vy,0) -> (vx,vy,vz) */}
                <line x1={ptGround.x} y1={ptGround.y} x2={ptTip.x} y2={ptTip.y} stroke="#8b5cf6" strokeWidth="2.5" />

                {/* 3. Raum-Hypotenuse: Vektor v vom Ursprung zur 3D-Spitze */}
                <line x1={origin.x} y1={origin.y} x2={ptTip.x} y2={ptTip.y} stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrow-3d-blue)" />

                {/* Allgemeine Beschriftungen ohne konkrete Zahlen */}
                <text x={ptX.x - 10} y={ptX.y + 12} fontSize="10" fontWeight="bold" fill="#d97706" fontFamily="monospace">
                  |v_x|
                </text>
                <text x={ptGround.x + 8} y={ptGround.y + 4} fontSize="10" fontWeight="bold" fill="#059669" fontFamily="monospace">
                  |v_y|
                </text>
                <text x={ptTip.x + 8} y={ptTip.y + 12} fontSize="10" fontWeight="bold" fill="#8b5cf6" fontFamily="monospace">
                  |v_z|
                </text>
                <text x={ptTip.x + 8} y={ptTip.y - 4} fontSize="11" fontWeight="bold" fill="#2563eb" fontFamily="monospace">
                  ||v||
                </text>
              </g>
            );
          })()}

          {/* Achsen positiv */}
          <line x1={origin.x} y1={origin.y} x2={axisX.x} y2={axisX.y} stroke="#64748b" strokeWidth="1.5" />
          <line x1={origin.x} y1={origin.y} x2={axisY.x} y2={axisY.y} stroke="#64748b" strokeWidth="1.5" />
          <line x1={origin.x} y1={origin.y} x2={axisZ.x} y2={axisZ.y} stroke="#64748b" strokeWidth="1.5" />

          {/* Achsen-Labels */}
          <text x={axisX.x - 12} y={axisX.y + 12} fontSize="11" fontWeight="bold" fill="#475569" fontStyle="italic">x</text>
          <text x={axisY.x + 8} y={axisY.y + 4} fontSize="11" fontWeight="bold" fill="#475569" fontStyle="italic">y</text>
          <text x={axisZ.x - 14} y={axisZ.y - 4} fontSize="11" fontWeight="bold" fill="#475569" fontStyle="italic">z</text>

          {/* Gegebene Vektoren zeichnen (wenn nicht pythagoras) */}
          {!pythagorasVector && vectors.map((vec, idx) => {
            const tip = project(vec.x, vec.y, vec.z);
            const ground = project(vec.x, vec.y, 0);
            const marker = vec.color === '#d97706' ? 'arrow-3d-amber' : 'arrow-3d-blue';

            return (
              <g key={idx}>
                <line x1={tip.x} y1={tip.y} x2={ground.x} y2={ground.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                <line x1={origin.x} y1={origin.y} x2={ground.x} y2={ground.y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />

                <line x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} stroke={vec.color || '#2563eb'} strokeWidth="2.5" markerEnd={`url(#${marker})`} />
                {vec.label && (
                  <text x={tip.x + 6} y={tip.y - 4} fontSize="11" fontWeight="bold" fill={vec.color || '#2563eb'}>
                    {vec.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Benutzer Vektor */}
          {userVector && (userVector[0] !== 0 || userVector[1] !== 0 || userVector[2] !== 0) && (() => {
            const tip = project(userVector[0], userVector[1], userVector[2]);
            const ground = project(userVector[0], userVector[1], 0);
            return (
              <g>
                <line x1={tip.x} y1={tip.y} x2={ground.x} y2={ground.y} stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
                <line x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} stroke="#7c3aed" strokeWidth="2.5" markerEnd="url(#arrow-3d-purple)" />
                <circle cx={tip.x} cy={tip.y} r="4" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
                <text x={tip.x + 6} y={tip.y - 4} fontSize="11" fontWeight="bold" fill="#7c3aed" fontFamily="monospace">
                  ({userVector[0]}|{userVector[1]}|{userVector[2]})
                </text>
              </g>
            );
          })()}

          {/* Richtige Lösung */}
          {showExpected && expectedVector && (() => {
            const tip = project(expectedVector[0], expectedVector[1], expectedVector[2]);
            return (
              <g>
                <line x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} stroke="#059669" strokeWidth="2.5" strokeDasharray="3 2" markerEnd="url(#arrow-3d-emerald)" />
                <text x={tip.x + 6} y={tip.y - 4} fontSize="11" fontWeight="bold" fill="#059669" fontFamily="monospace">
                  {lang === 'en' ? 'Solution' : 'Lösung'}: ({expectedVector[0]}|{expectedVector[1]}|{expectedVector[2]})
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Pythagoras Banner für 3D - rein allgemeine Veranschaulichung */}
      {pythagorasVector && (
        <div className="mt-2 text-center text-xs font-mono text-slate-700 bg-blue-50/70 border border-blue-200/60 rounded px-3 py-1.5 space-y-0.5 max-w-sm">
          <div className="font-semibold text-blue-800">
            {lang === 'en' ? 'Spatial Pythagoras (general):' : 'Räumlicher Pythagoras (allgemein):'}
          </div>
          <div className="text-[11px] text-slate-600">
            ||v||² = v_x² + v_y² + v_z² ⇒ ||v|| = √(v_x² + v_y² + v_z²)
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <RotateCw className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-500">{t.viewAngle}</span>
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-28 accent-blue-600 cursor-pointer"
        />
        <span className="text-xs font-mono text-slate-500 w-8">{angle}°</span>
      </div>
    </div>
  );
};
