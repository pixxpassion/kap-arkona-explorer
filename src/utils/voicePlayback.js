// src/utils/voicePlayback.js
//
// Stellt sicher, dass immer nur EINE vertonte Schilling-Ausgabe gleichzeitig
// läuft. Ohne das würden sich z. B. der Stationstext und ein frisch
// geöffneter Logbuch-Eintrag gegenseitig übertönen - beide mounten eine
// eigene SchillingDialogue-Instanz mit eigenem <audio> bzw. Web-Speech.
//
// Wer zuerst spielt, behält die Stimme; ein zweiter Startversuch wird
// abgewiesen (die Notiz erscheint dann still, nur mit Schreibmaschinen-
// Effekt), bis der erste Sprecher fertig ist oder abbricht.

let holder = null;

// Versucht, die Stimme für `token` zu belegen. true, wenn sie frei war
// (oder bereits von `token` selbst gehalten wird - StrictMode-Doppelmount),
// sonst false.
export function acquireVoice(token) {
  if (holder !== null && holder !== token) return false;
  holder = token;
  return true;
}

// Gibt die Stimme frei - aber nur, wenn `token` sie auch hält. So bleibt ein
// verspäteter Aufruf einer bereits abgelösten Instanz folgenlos.
export function releaseVoice(token) {
  if (holder === token) holder = null;
}

export function isVoiceBusy() {
  return holder !== null;
}
