// src/utils/speech.js
//
// Liest Schillings Logbuch-Texte per Web Speech API (SpeechSynthesis) vor,
// parallel zum Schreibmaschinen-Effekt und den Tippgeräuschen. Läuft rein
// lokal im Browser (kein externer Dienst, keine Netzwerkanfrage) - Auswahl
// und Klangqualität der Stimme hängen vom jeweiligen Gerät/Browser ab.

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickGermanVoice() {
  const voices = window.speechSynthesis.getVoices();
  const german = voices.filter((v) => v.lang?.toLowerCase().startsWith('de'));
  if (!german.length) return null;
  // Grobe Heuristik für eine männlichere Stimme, passend zum alten
  // Leuchtturmwärter - funktioniert nur, wenn der Stimmenname es hergibt
  // (variiert stark je Gerät); sonst einfach die erste deutsche Stimme.
  const male = german.find((v) => /male|männlich/i.test(v.name) && !/female|weiblich/i.test(v.name));
  return male || german[0];
}

export function speakText(text) {
  if (!isSpeechSupported() || !text) return;
  window.speechSynthesis.cancel(); // vorherige Sprachausgabe sofort abbrechen

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.95;
  utterance.pitch = 0.85;

  const voice = pickGermanVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

// Spricht eine lautlose Leer-Utterance, um die Sprachausgabe für den Rest
// der Sitzung freizuschalten - gedacht zum Aufruf aus einem echten Klick-/
// Touch-Handler heraus (siehe audioUnlock.js), da mobile Browser
// SpeechSynthesis sonst stumm ignorieren, solange noch keine
// Nutzer-Geste stattgefunden hat.
export function unlockSpeech() {
  if (!isSpeechSupported()) return;
  const utterance = new SpeechSynthesisUtterance('');
  utterance.volume = 0;
  window.speechSynthesis.speak(utterance);
}
