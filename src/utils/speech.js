// src/utils/speech.js
//
// Liest Schillings Logbuch-Texte per Web Speech API (SpeechSynthesis) vor,
// parallel zum Schreibmaschinen-Effekt und den Tippgeräuschen. Läuft rein
// lokal im Browser (kein externer Dienst, keine Netzwerkanfrage) - Auswahl
// und Klangqualität der Stimme hängen vom jeweiligen Gerät/Browser ab.

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Chrome/Edge und viele mobile Browser liefern getVoices() beim ersten
// Aufruf noch eine leere Liste und reichen die Stimmen erst kurz darauf per
// 'voiceschanged'-Event nach. Ohne das würde die allererste Station mit
// irgendeiner Default-Stimme (oft nicht mal Deutsch) vorgelesen. Deshalb:
// Stimmen zentral cachen, auf 'voiceschanged' aktualisieren und eine noch
// leere erste Ausgabe kurz aufschieben, bis die deutsche Stimme da ist.
let cachedVoices = [];

function refreshVoices() {
  if (!isSpeechSupported()) return cachedVoices;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  return cachedVoices;
}

if (isSpeechSupported()) {
  // Modul-weiter Listener für die gesamte App-Laufzeit - wird nicht wieder
  // entfernt (Singleton).
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
  refreshVoices(); // Versuch beim Import - manche Browser haben sie sofort.
}

function pickGermanVoice(voices) {
  const german = voices.filter((v) => v.lang?.toLowerCase().startsWith('de'));
  if (!german.length) return null;
  // Grobe Heuristik für eine männlichere Stimme, passend zum alten
  // Leuchtturmwärter - funktioniert nur, wenn der Stimmenname es hergibt
  // (variiert stark je Gerät); sonst einfach die erste deutsche Stimme.
  const male = german.find((v) => /male|männlich/i.test(v.name) && !/female|weiblich/i.test(v.name));
  return male || german[0];
}

// Wird bei jedem speakText()/stopSpeech() hochgezählt; eine noch wartende,
// aufgeschobene Ausgabe erkennt daran, dass sie überholt wurde, und startet
// dann nicht mehr.
let speakGeneration = 0;

export function speakText(text) {
  if (!isSpeechSupported() || !text) return;
  const synth = window.speechSynthesis;
  const myGeneration = ++speakGeneration;

  synth.cancel(); // vorherige Sprachausgabe sofort abbrechen

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.95;
  utterance.pitch = 0.85;

  const voice = pickGermanVoice(refreshVoices());
  if (voice) {
    utterance.voice = voice;
    synth.speak(utterance);
    return;
  }

  // getVoices() ist noch leer: einmal auf 'voiceschanged' warten (mit
  // Timeout-Fallback, falls das Event nie kommt), dann mit der dann
  // verfügbaren deutschen Stimme sprechen.
  let started = false;
  const start = () => {
    if (started || myGeneration !== speakGeneration) return;
    started = true;
    clearTimeout(timer);
    synth.removeEventListener?.('voiceschanged', onVoicesChanged);
    const readyVoice = pickGermanVoice(refreshVoices());
    if (readyVoice) utterance.voice = readyVoice;
    synth.speak(utterance);
  };
  const onVoicesChanged = () => {
    if (window.speechSynthesis.getVoices().length) start();
  };

  synth.addEventListener?.('voiceschanged', onVoicesChanged);
  const timer = setTimeout(start, 1000);
}

export function stopSpeech() {
  if (isSpeechSupported()) {
    speakGeneration++; // invalidiert eine noch wartende, aufgeschobene Ausgabe
    window.speechSynthesis.cancel();
  }
}

// Spricht eine lautlose Leer-Utterance, um die Sprachausgabe für den Rest
// der Sitzung freizuschalten - gedacht zum Aufruf aus einem echten Klick-/
// Touch-Handler heraus (siehe audioUnlock.js), da mobile Browser
// SpeechSynthesis sonst stumm ignorieren, solange noch keine
// Nutzer-Geste stattgefunden hat. Gute Gelegenheit, auch die Stimmenliste
// anzustoßen.
export function unlockSpeech() {
  if (!isSpeechSupported()) return;
  refreshVoices();
  const utterance = new SpeechSynthesisUtterance('');
  utterance.volume = 0;
  window.speechSynthesis.speak(utterance);
}
