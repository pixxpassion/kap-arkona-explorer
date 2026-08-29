// Erzeugt Umgebungsgeräusche für die Dispatch-Note rein per Web Audio API -
// keine Audio-Datei nötig, funktioniert also auch offline/bei schwachem
// Empfang am Kap. Der AudioContext wird erst bei der ersten Nutzer-Geste
// angelegt (Browser-Autoplay-Regeln verlangen das ohnehin).

let audioCtx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Erzwingt das Anlegen/Fortsetzen des AudioContext - gedacht zum Aufruf
// aus einem echten Klick-/Touch-Handler heraus (siehe audioUnlock.js),
// da Browser einen AudioContext sonst im "suspended"-Zustand belassen.
export function unlockAudioContext() {
  getContext();
}

// Dezentes, endlos loopendes Meeresrauschen - läuft während Schilling
// "schreibt" (ersetzt den früheren Tippgeräusch-Klick, der als störend
// empfunden wurde). Gefiltertes Rauschen statt echter Oszillatoren, mit
// einer langsam schwellenden Lautstärke für das "Wellen rollen an"-Gefühl.
// Nur eine Instanz gleichzeitig - erneuter Aufruf während des Laufens tut
// nichts, stopOceanAmbience() muss explizit aufgerufen werden.
let ambience = null;

function createNoiseBuffer(ctx) {
  const seconds = 3;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function startOceanAmbience() {
  const ctx = getContext();
  if (!ctx || ambience) return;

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx);
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 700;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.025, now + 0.6); // sanftes Einblenden

  // Langsame Lautstärke-Schwankung simuliert an- und abschwellende Wellen.
  const swell = ctx.createOscillator();
  swell.frequency.value = 0.15;
  const swellGain = ctx.createGain();
  swellGain.gain.value = 0.012;
  swell.connect(swellGain).connect(gain.gain);

  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start();
  swell.start();

  ambience = { noise, swell, gain };
}

export function stopOceanAmbience() {
  if (!ambience) return;
  const ctx = getContext();
  const { noise, swell, gain } = ambience;
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.4); // sanftes Ausblenden statt Knacken
  noise.stop(now + 0.45);
  swell.stop(now + 0.45);
  ambience = null;
}
