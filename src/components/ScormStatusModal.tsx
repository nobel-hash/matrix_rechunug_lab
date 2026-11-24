/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Layers, CheckCircle2, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { scormService } from '../services/scormService.js';

interface ScormStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  maxScore?: number;
}

export const ScormStatusModal: React.FC<ScormStatusModalProps> = ({
  isOpen,
  onClose,
  currentScore,
  maxScore = 30,
}) => {
  const [copied, setCopied] = useState(false);
  const diag = scormService.getDiagnosticInfo();

  if (!isOpen) return null;

  const sampleManifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="LA_Anwendung2_Matrizen" version="1.2"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_la2">
    <organization identifier="org_la2">
      <title>Lineare Algebra - Anwendung 2: Matrizenrechnung (Aufgaben 4 bis 6)</title>
      <item identifier="item_la_matrices" identifierref="res_la_matrices">
        <title>Aufgaben 4-6: Matrizenaddition/-subtraktion, Matrizenmultiplikation &amp; Transposition</title>
        <adlcp:masteryscore>60</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res_la_matrices" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html" />
    </resource>
  </resources>
</manifest>`;

  const copyManifest = () => {
    navigator.clipboard.writeText(sampleManifest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              SCORM 1.2 & Moodle-Kompatibilität
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* Status Box */}
          <div
            className={`p-4 rounded-lg border flex items-start gap-3 ${
              diag.isLmsAvailable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {diag.isLmsAvailable ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-bold text-sm">
                {diag.isLmsAvailable
                  ? 'SCORM 1.2 LMS (Moodle) erkannt und initialisiert'
                  : 'Standalone-Browser-Modus (Kein aktives LMS)'}
              </h3>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                {diag.isLmsAvailable
                  ? 'Die App kommuniziert via window.API direkt mit Moodle. Punktestand und Abschlussstatus werden automatisch synchronisiert.'
                  : 'Das Modul scormService.js ist vollständig vorbereitet. Da die Anwendung aktuell im normalen Browser ausgeführt wird, arbeitet das Modul im sicheren No-Op Fallback-Modus.'}
              </p>
            </div>
          </div>

          {/* Technische Spezifikationen */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Bereitgestellte Konfigurationen</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-400 block text-[11px]">Vite Relative Pfade</span>
                <span className="font-semibold text-blue-700">base: './' (aktiv)</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-400 block text-[11px]">Standard-Standard</span>
                <span className="font-semibold text-slate-800">SCORM 1.2 (ADL)</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-400 block text-[11px]">Punktestand Übertragung</span>
                <span className="font-semibold text-blue-700">cmi.core.score.raw ({currentScore} / {maxScore})</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-400 block text-[11px]">Status Mapping</span>
                <span className="font-semibold text-slate-800">cmi.core.lesson_status</span>
              </div>
            </div>
          </div>

          {/* Anleitung zum Moodle-Upload */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              Schritte zum Erstellen des Moodle-SCORM-Pakets
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 pl-1 leading-relaxed">
              <li>
                Erstelle den Produktions-Build mit <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">npm run build</code>.
              </li>
              <li>
                Platziere die Datei <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">imsmanifest.xml</code> direkt in den erzeugten Ordner <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">dist/</code>.
              </li>
              <li>
                Zippe alle Dateien innerhalb von <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">dist/</code> zu einer ZIP-Datei (z.B. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">la-uebung.zip</code>).
              </li>
              <li>
                In Moodle: <em>Aktivität anlegen → Lernpaket (SCORM)</em> auswählen und die ZIP-Datei hochladen. Fertig!
              </li>
            </ol>
          </div>

          {/* imsmanifest.xml Vorlage */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">
                SCORM 1.2 Manifest-Vorlage (imsmanifest.xml)
              </span>
              <button
                onClick={copyManifest}
                className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-800 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopiert!' : 'Kopieren'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-md text-[11px] font-mono overflow-x-auto max-h-36">
              {sampleManifest}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};
