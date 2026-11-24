/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen } from 'lucide-react';

interface FormulaReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaReferenceModal: React.FC<FormulaReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              Mathematische Formelsammlung · Vektoren & Matrizen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* 1. Vektoraddition */}
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
              1. Vektoraddition
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Zwei Vektoren gleicher Dimension werden komponentenweise addiert. Geometrisch entspricht dies dem Aneinanderhängen der Pfeile:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs sm:text-sm">
              \vec&#123;a&#125; + \vec&#123;b&#125; = (a₁ + b₁, a₂ + b₂, ..., a_n + b_n)ᵀ
            </div>
            <p className="text-xs text-slate-500">
              Eigenschaften: Kommutativ (\vec&#123;a&#125; + \vec&#123;b&#125; = \vec&#123;b&#125; + \vec&#123;a&#125;) und Assoziativ.
            </p>
          </section>

          {/* 2. Skalarmultiplikation */}
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
              2. Multiplikation mit einem Skalar
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Die Multiplikation eines Vektors mit einer reellen Zahl c streckt (|c| &gt; 1) oder staucht (|c| &lt; 1) den Vektor. Ist c negativ, kehrt sich die Orientierung um:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs sm:text-sm">
              c · \vec&#123;v&#125; = (c · v₁, c · v₂, ..., c · v_n)ᵀ
            </div>
          </section>

          {/* 3. Vektorbetrag */}
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
              3. Betrag eines Vektors (Euklidische Norm)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Der Betrag ||\vec&#123;v&#125;|| ist die euklidische Distanz des Vektorpfeils vom Ursprung (Satz des Pythagoras):
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs sm:text-sm">
              ||\vec&#123;v&#125;|| = √(v₁² + v₂² + ... + v_n²)
            </div>
            <p className="text-xs text-slate-500">
              Wichtig: Das Quadrat jeder reellen Zahl ist nichtnegativ; Vorzeichen heben sich beim Quadrieren auf (z.B. (-4)² = 16).
            </p>
          </section>

          {/* 4. Matrizenaddition */}
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
              4. Matrizenaddition
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Zwei Matrizen A und B können genau dann addiert werden, wenn sie denselben Typ (m Zeilen, n Spalten) besitzen:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs sm:text-sm">
              C = A + B   mit   c_ij = a_ij + b_ij
            </div>
          </section>

          {/* 5. Matrizenmultiplikation */}
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
              5. Matrizenmultiplikation (Falksches Schema)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Das Produkt A · B ist genau dann definiert, wenn die Spaltenanzahl von A gleich der Zeilenanzahl von B ist:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs sm:text-sm space-y-1">
              <div>A ∈ ℝ^(m × k)  und  B ∈ ℝ^(k × n)  ⇒  C = A · B ∈ ℝ^(m × n)</div>
              <div className="text-blue-700">c_ij = ∑_(l=1)^k  (a_il · b_lj)   [Zeile i von A · Spalte j von B]</div>
            </div>
            <p className="text-xs text-slate-500">
              Achtung: Die Matrizenmultiplikation ist im Allgemeinen <strong>nicht kommutativ</strong> (A · B ≠ B · A).
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
