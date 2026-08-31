// src/utils/gameMode.js
//
// Spielmodus-Auswahl (Schritt 1: nur Auswahl + Speichern).
//
//   historian – die volle "Rätsel-Expedition" (Standard, aktuelles Spiel)
//   light     – geplante kompakte "Foto-Safari"
//
// Der Modus wird in localStorage gemerkt; ein "?mode="-Query-Parameter
// gewinnt pro Aufruf (praktisch für Test-Links). Das Gameplay wertet den
// Modus noch NICHT aus - GameContainer & Co. bleiben vorerst unverändert.

const STORAGE_KEY = 'kapArkonaGameMode';

export const GAME_MODES = {
  HISTORIAN: 'historian',
  LIGHT: 'light',
};

const VALID = new Set(Object.values(GAME_MODES));
const DEFAULT_MODE = GAME_MODES.HISTORIAN;

function fromQuery() {
  if (typeof window === 'undefined' || !window.location) return null;
  try {
    const q = new URLSearchParams(window.location.search).get('mode');
    return VALID.has(q) ? q : null;
  } catch {
    return null;
  }
}

function fromStorage() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VALID.has(v) ? v : null;
  } catch {
    return null;
  }
}

// Für die Erst-Auswahl in der UI: Query-Parameter vor gemerkter Wahl vor
// Standard.
export function getInitialGameMode() {
  return fromQuery() || fromStorage() || DEFAULT_MODE;
}

// Der zuletzt gespeicherte Modus (ohne Query-Parameter) - für spätere
// Gameplay-Auswertung.
export function getGameMode() {
  return fromStorage() || DEFAULT_MODE;
}

export function setGameMode(mode) {
  if (!VALID.has(mode)) return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* Speicher nicht verfügbar (Privat-Modus o. Ä.) - ignorieren */
  }
}
