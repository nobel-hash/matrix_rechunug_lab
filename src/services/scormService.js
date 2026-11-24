/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * scormService.js
 * Kapselung der SCORM-1.2-Schnittstelle für den späteren Moodle-Einsatz.
 * Bietet saubere Methoden für LMSInitialize, LMSSetValue, LMSCommit und LMSFinish.
 * Im Standalone-Modus (außerhalb eines LMS) fungiert das Modul als geräuschloser No-Op Fallback.
 */

class ScormService {
  constructor() {
    this.api = null;
    this.isInitialized = false;
    this.isLmsAvailable = false;
    this.logHistory = [];
  }

  _log(message, data = null) {
    const entry = { timestamp: new Date().toISOString(), message, data };
    this.logHistory.push(entry);
    // Silent in production, can be inspected via getLogs()
  }

  /**
   * Rekursive Suche nach dem SCORM-1.2-API-Objekt (window.API)
   * gemäß SCORM 1.2 Spezifikation in Parent-Frames und Opener.
   * @param {Window} win 
   * @returns {object|null}
   */
  findLMSAPI(win = window) {
    let attempts = 0;
    const maxAttempts = 10;
    let currentWin = win;

    while (currentWin && attempts < maxAttempts) {
      try {
        if (currentWin.API) {
          return currentWin.API;
        }
      } catch {
        // Cross-origin restriction
        break;
      }

      if (currentWin.parent && currentWin.parent !== currentWin) {
        currentWin = currentWin.parent;
      } else {
        break;
      }
      attempts++;
    }

    // Falls nicht im Parent gefunden, im Opener suchen
    if (win.opener) {
      try {
        if (win.opener.API) {
          return win.opener.API;
        }
      } catch {
        // ignore
      }
    }

    return null;
  }

  /**
   * Initialisiert die Verbindung zum LMS
   * @returns {boolean} true falls erfolgreich oder im Fallback-Modus
   */
  initialize() {
    if (this.isInitialized) return true;

    this.api = this.findLMSAPI(window);
    if (this.api && typeof this.api.LMSInitialize === 'function') {
      try {
        const result = this.api.LMSInitialize('');
        this.isInitialized = result === 'true' || result === true;
        this.isLmsAvailable = this.isInitialized;
        this._log('LMSInitialize aufgerufen', { result });
        return this.isInitialized;
      } catch (err) {
        this._log('Fehler bei LMSInitialize', err);
      }
    }

    this._log('Keine aktive SCORM 1.2 LMS-Umgebung gefunden (Standalone-Modus aktiv).');
    this.isInitialized = true;
    this.isLmsAvailable = false;
    return false;
  }

  /**
   * Überträgt den Punktestand an das LMS (cmi.core.score.raw)
   * @param {number} score Erreichte Punktzahl
   * @param {number} maxScore Maximalpunktzahl
   * @param {number} minScore Minimalpunktzahl
   * @returns {boolean}
   */
  setScore(score, maxScore = 100, minScore = 0) {
    this._log('setScore aufgerufen', { score, maxScore, minScore });

    if (!this.isLmsAvailable || !this.api) {
      return false;
    }

    try {
      this.api.LMSSetValue('cmi.core.score.raw', String(score));
      if (maxScore !== undefined) {
        this.api.LMSSetValue('cmi.core.score.max', String(maxScore));
      }
      if (minScore !== undefined) {
        this.api.LMSSetValue('cmi.core.score.min', String(minScore));
      }
      this.commit();
      return true;
    } catch (err) {
      this._log('Fehler bei LMSSetValue für Punktestand', err);
      return false;
    }
  }

  /**
   * Setzt den Bearbeitungsstatus (cmi.core.lesson_status)
   * Mögliche Werte: 'passed', 'completed', 'failed', 'incomplete', 'browsed'
   * @param {'passed'|'completed'|'failed'|'incomplete'} status 
   * @returns {boolean}
   */
  setStatus(status) {
    this._log('setStatus aufgerufen', { status });

    if (!this.isLmsAvailable || !this.api) {
      return false;
    }

    try {
      this.api.LMSSetValue('cmi.core.lesson_status', status);
      this.commit();
      return true;
    } catch (err) {
      this._log('Fehler bei LMSSetValue für Status', err);
      return false;
    }
  }

  /**
   * Speichert beliebige Fortschrittsdaten im cmi.suspend_data Feld
   * @param {any} data 
   * @returns {boolean}
   */
  setSuspendData(data) {
    if (!this.isLmsAvailable || !this.api) return false;
    try {
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      this.api.LMSSetValue('cmi.suspend_data', payload);
      this.commit();
      return true;
    } catch (err) {
      this._log('Fehler bei setSuspendData', err);
      return false;
    }
  }

  /**
   * Liest gespeicherte Daten aus dem LMS aus
   * @returns {string|null}
   */
  getSuspendData() {
    if (!this.isLmsAvailable || !this.api) return null;
    try {
      return this.api.LMSGetValue('cmi.suspend_data') || null;
    } catch (err) {
      this._log('Fehler bei getSuspendData', err);
      return null;
    }
  }

  /**
   * Bestätigt ausstehende Daten im LMS (LMSCommit)
   * @returns {boolean}
   */
  commit() {
    if (!this.isLmsAvailable || !this.api) return false;
    try {
      const result = this.api.LMSCommit('');
      return result === 'true' || result === true;
    } catch {
      return false;
    }
  }

  /**
   * Beendet die SCORM-Sitzung sauber (LMSFinish)
   * @returns {boolean}
   */
  finish() {
    if (!this.isLmsAvailable || !this.api) return true;
    try {
      this.commit();
      const result = this.api.LMSFinish('');
      this.isInitialized = false;
      return result === 'true' || result === true;
    } catch {
      return false;
    }
  }

  /**
   * Prüft, ob ein echtes SCORM 1.2 LMS erreichbar ist
   * @returns {boolean}
   */
  isAvailable() {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.isLmsAvailable;
  }

  /**
   * Gibt Diagnose- und Statusinformationen zurück
   */
  getDiagnosticInfo() {
    return {
      isInitialized: this.isInitialized,
      isLmsAvailable: this.isLmsAvailable,
      apiFound: !!this.api,
      logCount: this.logHistory.length,
      logs: this.logHistory.slice(-10),
    };
  }
}

// Singleton-Export für die gesamte App
export const scormService = new ScormService();
export default scormService;
