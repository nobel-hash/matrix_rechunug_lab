/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { VectorView, MatrixView } from './MathView';
import { VectorInputGrid } from './VectorInputGrid';
import { MatrixInputGrid } from './MatrixInputGrid';
import { ScalarInput } from './ScalarInput';
import { CoordinateSystem2D } from './CoordinateSystem2D';
import { CoordinateSystem3D } from './CoordinateSystem3D';
import { MagnitudeVisualizer } from './MagnitudeVisualizer';
import { validateVectorInput, validateScalarInput } from '../services/vectorService.js';
import { validateMatrixInput } from '../services/matrixService.js';
import { translations } from '../services/i18nService.js';
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  LineChart,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: any;
  onNextExercise: () => void;
  onRecordAttempt: (attempt: {
    exerciseId: string;
    taskNumber: number;
    isCorrect: boolean;
    customPoints?: number;
  }) => { pointsAwarded: number; alreadyScored: boolean };
  isAlreadyScored: boolean;
  onDimensionChange?: (dim: number) => void;
  onMatrixSizeChange?: (size: number) => void;
  onMatrixPresetChange?: (preset: any) => void;
  currentTaskNumber: number;
  lang?: 'en' | 'de';
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onNextExercise,
  onRecordAttempt,
  isAlreadyScored,
  onDimensionChange,
  onMatrixSizeChange,
  onMatrixPresetChange,
  currentTaskNumber,
  lang = 'en',
}) => {
  const t = translations[lang];

  // Eingabewerte
  const [vectorInput, setVectorInput] = useState<string[]>([]);
  const [matrixInput, setMatrixInput] = useState<string[][]>([]);
  const [scalarInput, setScalarInput] = useState<string>('');

  // Prüfstatus
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [cellMatches, setCellMatches] = useState<any>(null);
  const [pointsGainedThisSubmit, setPointsGainedThisSubmit] = useState<number | null>(null);
  
  // Hint State (ersetzt "Lösung anzeigen")
  const [showHint, setShowHint] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Bei neuer Aufgabe Felder zurücksetzen
  useEffect(() => {
    setHasChecked(false);
    setIsCorrect(null);
    setFeedbackText('');
    setCellMatches(null);
    setPointsGainedThisSubmit(null);
    setShowHint(false);
    setFailedAttempts(0);

    if (exercise.inputType === 'vector') {
      const dim = exercise.inputShape[0];
      setVectorInput(Array(dim).fill(''));
    } else if (exercise.inputType === 'matrix') {
      const [rows, cols] = exercise.inputShape;
      setMatrixInput(Array.from({ length: rows }, () => Array(cols).fill('')));
    } else if (exercise.inputType === 'scalar') {
      setScalarInput('');
    }
  }, [exercise.id]);

  const handleVectorChange = (idx: number, val: string) => {
    const updated = [...vectorInput];
    updated[idx] = val;
    setVectorInput(updated);
    if (hasChecked) {
      setHasChecked(false);
      setIsCorrect(null);
    }
  };

  const handleMatrixChange = (r: number, c: number, val: string) => {
    const updated = matrixInput.map((row) => [...row]);
    if (!updated[r]) updated[r] = [];
    updated[r][c] = val;
    setMatrixInput(updated);
    if (hasChecked) {
      setHasChecked(false);
      setIsCorrect(null);
    }
  };

  const handleScalarChange = (val: string) => {
    setScalarInput(val);
    if (hasChecked) {
      setHasChecked(false);
      setIsCorrect(null);
    }
  };

  // Grafische Eingabe im 2D-Koordinatensystem
  const handleGraphical2DSet = (coords: [number, number]) => {
    if (exercise.inputType === 'vector') {
      const updated = [String(coords[0]), String(coords[1])];
      if (exercise.dimension === 3) {
        updated.push(vectorInput[2] || '0');
      }
      setVectorInput(updated);
    }
    if (hasChecked) {
      setHasChecked(false);
      setIsCorrect(null);
    }
  };

  const handleCheck = () => {
    let checkSuccess = false;
    let matches: any = null;
    let customFeedback = '';

    if (exercise.inputType === 'vector') {
      const res = validateVectorInput(vectorInput, exercise.expectedResult);
      checkSuccess = res.isCorrect;
      matches = res.cellMatches;
      customFeedback = res.isCorrect ? t.correctVectorFeedback : t.incorrectVectorFeedback;
    } else if (exercise.inputType === 'matrix') {
      const res = validateMatrixInput(matrixInput, exercise.expectedResult);
      checkSuccess = res.isCorrect;
      matches = res.cellMatches;
      customFeedback = res.isCorrect ? t.correctMatrixFeedback : t.incorrectMatrixFeedback;
    } else if (exercise.inputType === 'scalar') {
      const res = validateScalarInput(scalarInput, exercise.expectedResult);
      checkSuccess = res.isCorrect;
      matches = res.isCorrect;
      customFeedback = res.isCorrect ? t.correctScalarFeedback : t.incorrectScalarFeedback;
    }

    setHasChecked(true);
    setIsCorrect(checkSuccess);
    setCellMatches(matches);
    setFeedbackText(customFeedback);

    if (!checkSuccess) {
      setFailedAttempts((prev) => prev + 1);
    }

    const { pointsAwarded } = onRecordAttempt({
      exerciseId: exercise.id,
      taskNumber: exercise.taskNumber,
      isCorrect: checkSuccess,
      customPoints: exercise.points,
    });

    setPointsGainedThisSubmit(pointsAwarded);
  };

  // Graph ist für Vektoraufgaben im Koordinatensystem aktiv (nie bei Matrizen)
  const hasGraph = exercise.inputType === 'vector' || (exercise.inputType === 'scalar' && Boolean(exercise.inputs?.vector));

  const is2D = exercise.dimension === 2;
  const is3D = exercise.dimension === 3;

  // Benutzervektor numerisch geparst
  const parsedUserVector2D: [number, number] | null =
    exercise.inputType === 'vector' && vectorInput.length >= 2 && vectorInput[0] !== '' && vectorInput[1] !== ''
      ? [Number(vectorInput[0]) || 0, Number(vectorInput[1]) || 0]
      : null;

  const parsedUserVector3D: [number, number, number] | null =
    exercise.inputType === 'vector' && vectorInput.length >= 3 && vectorInput[0] !== '' && vectorInput[1] !== '' && vectorInput[2] !== ''
      ? [Number(vectorInput[0]) || 0, Number(vectorInput[1]) || 0, Number(vectorInput[2]) || 0]
      : null;

  const vectorsFor2D: any[] = [];
  const vectorsFor3D: any[] = [];

  if (hasGraph) {
    if (exercise.taskNumber === 1) {
      if (is2D && exercise.inputs?.v1 && exercise.inputs?.v2) {
        vectorsFor2D.push({ x: exercise.inputs.v1[0], y: exercise.inputs.v1[1], color: '#2563eb', label: 'a' });
        vectorsFor2D.push({ x: exercise.inputs.v2[0], y: exercise.inputs.v2[1], color: '#d97706', label: 'b' });
      } else if (is3D && exercise.inputs?.v1 && exercise.inputs?.v2) {
        vectorsFor3D.push({ x: exercise.inputs.v1[0], y: exercise.inputs.v1[1], z: exercise.inputs.v1[2], color: '#2563eb', label: 'a' });
        vectorsFor3D.push({ x: exercise.inputs.v2[0], y: exercise.inputs.v2[1], z: exercise.inputs.v2[2], color: '#d97706', label: 'b' });
      }
    } else if (exercise.taskNumber === 2) {
      if (is2D && exercise.inputs?.vector) {
        vectorsFor2D.push({ x: exercise.inputs.vector[0], y: exercise.inputs.vector[1], color: '#2563eb', label: 'v' });
      } else if (is3D && exercise.inputs?.vector) {
        vectorsFor3D.push({ x: exercise.inputs.vector[0], y: exercise.inputs.vector[1], z: exercise.inputs.vector[2], color: '#2563eb', label: 'v' });
      }
    }
  }

  // Lokalisierter Aufgabentitel und Fragestellung
  let localizedTitle = exercise.title;
  let localizedQuestion = exercise.questionText;
  let localizedNote = exercise.note;

  if (exercise.inputType === 'matrix') {
    // Matrizenaufgaben (Anwendung 2: Aufgaben 1 bis 3)
    if (exercise.taskNumber === 1 || exercise.taskNumber === 4) {
      const isAdd = exercise.subOperation === 'addition';
      localizedTitle = isAdd
        ? t.task1TitleAdd.replace('{dim}', exercise.rows)
        : t.task1TitleSub.replace('{dim}', exercise.rows);
      localizedQuestion = isAdd
        ? t.task1QuestionAdd.replace('{dim}', exercise.rows)
        : t.task1QuestionSub.replace('{dim}', exercise.rows);
    } else if (exercise.taskNumber === 2 || exercise.taskNumber === 5) {
      localizedTitle = t.task2Title
        .replace('{rowsA}', exercise.rowsA)
        .replace('{colsA}', exercise.colsA)
        .replace('{rowsB}', exercise.rowsB)
        .replace('{colsB}', exercise.colsB);
      localizedQuestion = t.task2Question
        .replace('{rowsA}', exercise.rowsA)
        .replace('{colsA}', exercise.colsA)
        .replace('{rowsB}', exercise.rowsB)
        .replace('{colsB}', exercise.colsB);
    } else if (exercise.taskNumber === 3 || exercise.taskNumber === 6) {
      localizedTitle = t.task3Title;
      localizedQuestion = t.task3Question;
    }
  } else {
    // Vektoraufgaben (Anwendung 1: Aufgaben 1 bis 3)
    if (exercise.taskNumber === 1) {
      const isAdd = exercise.subOperation === 'addition';
      localizedTitle = isAdd
        ? t.task1TitleAdd.replace('{dim}', exercise.dimension)
        : t.task1TitleSub.replace('{dim}', exercise.dimension);
      localizedQuestion = isAdd
        ? t.task1QuestionAdd.replace('{dim}', exercise.dimension)
        : t.task1QuestionSub.replace('{dim}', exercise.dimension);
    } else if (exercise.taskNumber === 2) {
      localizedTitle = t.task2Title.replace('{dim}', exercise.dimension);
      localizedQuestion = t.task2Question.replace('{scalar}', exercise.scalar);
    } else if (exercise.taskNumber === 3) {
      localizedTitle = t.task3Title.replace('{dim}', exercise.dimension);
      localizedQuestion = t.task3Question;
      localizedNote = t.task3Note;
    }
  }

  // Hinweistexte für den "Hint ?"-Button
  let hint1Text = '';
  if (exercise.inputType === 'matrix') {
    if (exercise.taskNumber === 1 || exercise.taskNumber === 4) {
      hint1Text = exercise.subOperation === 'addition' ? t.task1Hint1Add : t.task1Hint1Sub;
    } else if (exercise.taskNumber === 2 || exercise.taskNumber === 5) {
      hint1Text = t.task2Hint1;
    } else if (exercise.taskNumber === 3 || exercise.taskNumber === 6) {
      hint1Text = t.task3Hint1;
    }
  } else {
    if (exercise.taskNumber === 1) {
      hint1Text = exercise.subOperation === 'addition' ? t.task1Hint1Add : t.task1Hint1Sub;
    } else if (exercise.taskNumber === 2) {
      hint1Text = t.task2Hint1;
    } else if (exercise.taskNumber === 3) {
      hint1Text = t.task3Hint1;
    }
  }

  let hint2Text = '';
  if (exercise.inputType === 'matrix') {
    if ((exercise.taskNumber === 1 || exercise.taskNumber === 4) && exercise.inputs?.A && exercise.inputs?.B) {
      const op = exercise.operator || '+';
      hint2Text = lang === 'en'
        ? `Cell C₁₁: ${exercise.inputs.A[0][0]} ${op} (${exercise.inputs.B[0][0]}) = ${exercise.expectedResult[0][0]}`
        : `Zelle C₁₁: ${exercise.inputs.A[0][0]} ${op} (${exercise.inputs.B[0][0]}) = ${exercise.expectedResult[0][0]}`;
    } else if ((exercise.taskNumber === 2 || exercise.taskNumber === 5) && exercise.inputs?.A && exercise.inputs?.B) {
      const rA = exercise.inputs.A[0];
      const cB = exercise.inputs.B.map((row: number[]) => row[0]);
      const terms = rA.map((val: number, i: number) => `${val} · (${cB[i]})`).join(' + ');
      hint2Text = lang === 'en'
        ? `Cell C₁₁ (Row 1 of A · Col 1 of B): ${terms} = ${exercise.expectedResult[0][0]}`
        : `Zelle C₁₁ (Zeile 1 von A · Spalte 1 von B): ${terms} = ${exercise.expectedResult[0][0]}`;
    } else if (exercise.taskNumber === 3 || exercise.taskNumber === 6) {
      hint2Text = lang === 'en'
        ? 'A · I₂ = A. In transpose Aᵀ, row 1 becomes column 1, and row 2 becomes column 2.'
        : 'A · I₂ = A. Beim Transponieren Aᵀ wird Zeile 1 zu Spalte 1 und Zeile 2 zu Spalte 2.';
    }
  } else {
    if (exercise.taskNumber === 1 && exercise.inputs?.v1 && exercise.inputs?.v2) {
      const op = exercise.operator || '+';
      hint2Text = lang === 'en'
        ? `Component 1: ${exercise.inputs.v1[0]} ${op} (${exercise.inputs.v2[0]}) = ${exercise.expectedResult[0]}`
        : `Zeile 1: ${exercise.inputs.v1[0]} ${op} (${exercise.inputs.v2[0]}) = ${exercise.expectedResult[0]}`;
    } else if (exercise.taskNumber === 2 && exercise.inputs?.vector) {
      hint2Text = lang === 'en'
        ? `Component 1: ${exercise.scalar} · (${exercise.inputs.vector[0]}) = ${exercise.expectedResult[0]}`
        : `Zeile 1: ${exercise.scalar} · (${exercise.inputs.vector[0]}) = ${exercise.expectedResult[0]}`;
    } else if (exercise.taskNumber === 3 && exercise.inputs?.vector) {
      const sqSum = exercise.inputs.vector.map((x: number) => x * x).reduce((a: number, b: number) => a + b, 0);
      hint2Text = lang === 'en'
        ? `Sum of squares: ${exercise.inputs.vector.map((x: number) => `(${x})²`).join(' + ')} = ${sqSum}`
        : `Summe der Quadrate: ${exercise.inputs.vector.map((x: number) => `(${x})²`).join(' + ')} = ${sqSum}`;
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs">
      {/* Kopfbereich: Aufgabe & Punkte */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
            {localizedTitle}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {t.valueLabel.replace('{points}', exercise.points)}
          </span>
          {isAlreadyScored && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.alreadyScored} ({exercise.points}/{exercise.points} {lang === 'en' ? 'pts' : 'Pkt'})
            </span>
          )}
        </div>

        {/* 2D / 3D Umschalter bei Vektoraufgaben 1, 2, 3 */}
        {onDimensionChange && exercise.dimension && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
            <button
              onClick={() => onDimensionChange(2)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                exercise.dimension === 2
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D (xy)
            </button>
            <button
              onClick={() => onDimensionChange(3)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                exercise.dimension === 3
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D (xyz)
            </button>
          </div>
        )}

        {/* 2x2 / 3x3 Umschalter bei Matrizenaufgabe 1 (vormals 4) */}
        {onMatrixSizeChange && (exercise.taskNumber === 1 || exercise.taskNumber === 4) && exercise.inputType === 'matrix' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
            <button
              onClick={() => onMatrixSizeChange(2)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                exercise.rows === 2
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="2×2 Matrizen"
            >
              2×2
            </button>
            <button
              onClick={() => onMatrixSizeChange(3)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                exercise.rows === 3
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="3×3 Matrizen"
            >
              3×3
            </button>
          </div>
        )}

        {/* Preset Umschalter bei Matrizenmultiplikation Aufgabe 2 (vormals 5) */}
        {onMatrixPresetChange && (exercise.taskNumber === 2 || exercise.taskNumber === 5) && exercise.inputType === 'matrix' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
            <button
              onClick={() => onMatrixPresetChange({ rowsA: 2, colsA: 2, rowsB: 2, colsB: 2, label: '2×2 mal 2×2' })}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                exercise.colsA === 2
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="2×2 · 2×2 Matrizen"
            >
              2×2 · 2×2
            </button>
            <button
              onClick={() => onMatrixPresetChange({ rowsA: 2, colsA: 3, rowsB: 3, colsB: 2, label: '2×3 mal 3×2' })}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                exercise.colsA === 3
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="2×3 · 3×2 Matrizen"
            >
              2×3 · 3×2
            </button>
          </div>
        )}
      </div>

      {/* Aufgabenstellung */}
      <div className="mt-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {localizedQuestion.replace(/\\vec\{([a-zA-Z])\}/g, '→$1').replace(/\\times/g, '×')}
        </h2>
        {exercise.formulaHint && (
          <p className="text-xs font-mono text-blue-700 mt-1">{exercise.formulaHint}</p>
        )}
        {localizedNote && (
          <p className="text-xs text-slate-500 mt-1">{localizedNote}</p>
        )}
      </div>

      {/* Hauptbereich: Rechnerische Darstellung (+ Grafische Darstellung für A1, A2, A3) */}
      <div className={`my-6 ${hasGraph ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-center' : 'flex flex-col items-center'}`}>
        {/* Mathematische Terme */}
        <div className={`p-5 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col items-center justify-center min-h-[240px] gap-6 ${hasGraph ? 'w-full' : 'max-w-2xl w-full'}`}>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono self-start">
            {t.givenValues}
          </span>

          {/* Vektoraufgabe 1 (App 1): Addition oder Subtraktion */}
          {exercise.taskNumber === 1 && exercise.inputType === 'vector' && (
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <VectorView vector={exercise.inputs.v1} label="a" />
              <span className="text-2xl font-bold text-slate-700 font-mono">{exercise.operator}</span>
              <VectorView vector={exercise.inputs.v2} label="b" />
            </div>
          )}

          {/* Vektoraufgabe 2 (App 1): Skalarmultiplikation */}
          {exercise.taskNumber === 2 && exercise.inputType === 'vector' && (
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <span className="font-mono text-2xl font-bold text-slate-900">
                {exercise.scalar} <span className="text-slate-400">·</span>
              </span>
              <VectorView vector={exercise.inputs.vector} label="v" />
            </div>
          )}

          {/* Vektoraufgabe 3 (App 1): Betrag mit Bezug zum Koordinatensystem */}
          {exercise.taskNumber === 3 && exercise.inputType === 'scalar' && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <VectorView vector={exercise.inputs.vector} label="v" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 text-center max-w-sm space-y-1.5 shadow-2xs">
                <span className="font-bold text-blue-700 block text-xs">
                  {exercise.dimension === 2 ? t.pythagorasFormula : t.pythagoras3DFormula}
                </span>
                <span className="text-slate-500 text-[11px] block leading-relaxed">
                  {lang === 'en'
                    ? 'In the coordinate system on the right: See the right triangle formed by coordinates on the axes!'
                    : 'Im Koordinatensystem rechts: Siehe das rechtwinklige Dreieck an den Koordinatenachsen!'}
                </span>
              </div>
            </div>
          )}

          {/* Aufgabe 1 (in App 2) bzw. 4: Matrizenaddition / -subtraktion */}
          {(exercise.taskNumber === 1 || exercise.taskNumber === 4) && exercise.inputType === 'matrix' && (
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <MatrixView matrix={exercise.inputs.A} label="A" />
              <span className="text-2xl font-bold text-slate-700 font-mono">{exercise.operator}</span>
              <MatrixView matrix={exercise.inputs.B} label="B" />
            </div>
          )}

          {/* Aufgabe 2 (in App 2) bzw. 5: Matrizenmultiplikation */}
          {(exercise.taskNumber === 2 || exercise.taskNumber === 5) && exercise.inputType === 'matrix' && (
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <MatrixView matrix={exercise.inputs.A} label="A" />
              <span className="text-xl font-bold text-slate-400">·</span>
              <MatrixView matrix={exercise.inputs.B} label="B" />
            </div>
          )}

          {/* Aufgabe 3 (in App 2) bzw. 6: 2x2 Matrix * Einheitsmatrix transponiert */}
          {(exercise.taskNumber === 3 || exercise.taskNumber === 6) && exercise.inputType === 'matrix' && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <MatrixView matrix={exercise.inputs.A} label="A" />
                <span className="text-xl font-bold text-slate-400">·</span>
                <MatrixView matrix={exercise.inputs.I} label="I₂" />
              </div>
              <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                {t.task3Subtext || t.task6Subtext}
              </span>
            </div>
          )}
        </div>

        {/* Grafische Darstellung (Aufgabe 1, 2 und 3) */}
        {hasGraph && (
          <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center min-h-[240px]">
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 font-mono flex items-center gap-1.5">
                <LineChart className="w-3.5 h-3.5 text-blue-600" />
                {is3D ? t.coordSystem3D : t.coordSystem2D}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {exercise.taskNumber === 3
                  ? (lang === 'en' ? 'Pythagorean triangle' : 'Pythagoras-Dreieck')
                  : is2D
                  ? t.interactiveHint
                  : t.rotatableHint}
              </span>
            </div>

            {is2D && (
              <CoordinateSystem2D
                vectors={vectorsFor2D}
                userVector={parsedUserVector2D}
                onSetUserVector={exercise.inputType === 'vector' ? handleGraphical2DSet : undefined}
                interactive={exercise.inputType === 'vector'}
                operation={exercise.taskNumber === 1 ? exercise.subOperation : undefined}
                rawInputs={exercise.inputs}
                pythagorasVector={exercise.taskNumber === 3 ? exercise.inputs?.vector : null}
                showResult={hasChecked || showHint || isAlreadyScored}
                lang={lang}
              />
            )}

            {is3D && (
              <CoordinateSystem3D
                vectors={vectorsFor3D}
                userVector={parsedUserVector3D}
                pythagorasVector={exercise.taskNumber === 3 ? exercise.inputs?.vector : null}
                showResult={hasChecked || showHint || isAlreadyScored}
                lang={lang}
              />
            )}
          </div>
        )}
      </div>

      {/* Eingabebereich für die Lösung */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          {hasGraph ? t.enterSolutionOrGraph : t.enterSolution}
        </label>

        {exercise.inputType === 'vector' && (
          <VectorInputGrid
            values={vectorInput}
            onChange={handleVectorChange}
            cellMatches={cellMatches}
            hasChecked={hasChecked}
            label="c"
          />
        )}

        {exercise.inputType === 'matrix' && (
          <MatrixInputGrid
            rows={exercise.inputShape[0]}
            cols={exercise.inputShape[1]}
            values={matrixInput}
            onChange={handleMatrixChange}
            cellMatches={cellMatches}
            hasChecked={hasChecked}
            label="C"
          />
        )}

        {exercise.inputType === 'scalar' && (
          <ScalarInput
            value={scalarInput}
            onChange={handleScalarChange}
            onSubmit={handleCheck}
            isCorrect={isCorrect}
            hasChecked={hasChecked}
            label="||v||"
            unitHint={lang === 'en' ? 'Integer (e.g. 5 or 13)' : 'Ganze Zahl (z.B. 5 oder 13)'}
          />
        )}
      </div>

      {/* Aktionsleiste: Prüfen, "Hint ?", Nächste Aufgabe */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCheck}
            className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.checkAnswer}</span>
          </button>

          {/* Der frühere "Lösung anzeigen" Button wurde wie gewünscht durch "Hint ?" ersetzt */}
          <button
            onClick={() => setShowHint((prev) => !prev)}
            className={`px-3.5 py-2.5 rounded-lg border font-medium text-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
              showHint
                ? 'bg-amber-100 border-amber-300 text-amber-900 ring-1 ring-amber-300'
                : 'border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>{lang === 'en' ? 'Hint ?' : 'Tipp ?'}</span>
          </button>
        </div>

        <button
          onClick={onNextExercise}
          className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <span>{t.nextTask}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Feedback-Meldung */}
      {hasChecked && (
        <div
          className={`mt-5 p-4 rounded-lg border transition-all ${
            isCorrect
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
              : 'bg-rose-50/80 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold">
                  {isCorrect ? t.correctTitle : t.incorrectTitle}
                </h4>
                {isCorrect && pointsGainedThisSubmit !== null && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-950">
                    {pointsGainedThisSubmit > 0
                      ? t.pointsAwarded.replace('{points}', String(pointsGainedThisSubmit))
                      : t.alreadyScoredNotice
                          .replace('{task}', String(exercise.taskNumber))
                          .replace('{points}', String(exercise.points))}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">{feedbackText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hint-Bereich (wird eingeblendet bei Klick auf "Hint ?") */}
      {showHint && (
        <div className="mt-5 p-4 sm:p-5 border border-amber-200 bg-amber-50/70 rounded-lg space-y-3 transition-all animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{lang === 'en' ? 'Method & Concept Hint:' : 'Rechenweg & Konzept-Tipp:'}</span>
          </div>

          <div className="p-3 bg-white border border-amber-200 rounded-md text-xs sm:text-sm text-slate-700 leading-relaxed">
            {hint1Text}
          </div>

          {hint2Text && (
            <div className="p-3 bg-white/80 border border-amber-200/80 rounded-md text-xs sm:text-sm text-blue-900 font-mono">
              <span className="font-semibold block mb-0.5 text-slate-600 font-sans text-xs">
                {lang === 'en' ? 'Partial Calculation:' : 'Zwischenschritt:'}
              </span>
              {hint2Text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
