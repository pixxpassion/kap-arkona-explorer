// src/utils/audioUnlock.js
//
// Browser-Autoplay-Regeln blockieren Web Audio API, SpeechSynthesis UND
// echte <audio>-Wiedergabe, solange noch keine einzige Nutzer-Geste auf
// der Seite stattgefunden hat. Dieses Modul verfolgt zentral, ob das
// bereits passiert ist ("hasGestured"/"onFirstGesture"), damit Schillings
// allererster Dialogtext (der sonst automatisch UND ohne vorherigen Klick
// erscheinen würde - v.a. bei wiederkehrenden Besuchen, wenn das
// Onboarding-Modal längst weggetippt wurde) bewusst auf die erste Geste
// wartet, statt eine garantiert blockierte Wiedergabe zu versuchen (siehe
// SchillingDialogue.jsx). Für alle späteren Dialoge (nach Stations-
// Wechsel per Button-Klick) ist "hasGestured()" dann schon true, die
// starten also weiterhin sofort automatisch.

import { unlockAudioContext } from './typewriterSound';
import { unlockSpeech } from './speech';
import { sfx } from './sfxSynthesizer';

// Kurzes, fast lautloses WAV (1 Sample Stille) rein zum "Anspielen" - MP3-
// Decoding ist unnötig, jeder Browser kann dieses winzige Daten-URI-WAV
// sofort abspielen.
const SILENT_AUDIO =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

function primeHtmlAudio() {
  const audio = new Audio(SILENT_AUDIO);
  audio.volume = 0;
  audio.play().catch(() => {});
}

let gestured = false;
const gestureListeners = new Set();

export function hasGestured() {
  return gestured;
}

// Ruft "callback" beim nächsten Antippen/Tastendruck auf (sofort, falls
// bereits geschehen). Gibt eine Abmeldefunktion zurück.
export function onFirstGesture(callback) {
  if (gestured) {
    callback();
    return () => {};
  }
  gestureListeners.add(callback);
  return () => gestureListeners.delete(callback);
}

function markGestured() {
  if (gestured) return;
  gestured = true;
  gestureListeners.forEach((cb) => cb());
  gestureListeners.clear();
}

export function installAudioUnlock() {
  if (typeof document === 'undefined') return;

  const unlock = () => {
    unlockAudioContext();
    unlockSpeech();
    sfx.init();
    primeHtmlAudio();
    markGestured();
    document.removeEventListener('click', unlock);
    document.removeEventListener('keydown', unlock);
  };

  // "click" (nicht "pointerdown"!) ist laut User-Activation-Spezifikation
  // das zuverlässige Signal für Browser-Autoplay-Freigaben - ein Finger,
  // der den Bildschirm berührt, zählt noch nicht als abgeschlossene
  // Geste, erst das Loslassen (click/touchend) tut das.
  document.addEventListener('click', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
}
