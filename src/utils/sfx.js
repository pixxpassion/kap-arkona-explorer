// src/utils/sfx.js
//
// Kurze haptisch-akustische UI-Effekte, rein per Web Audio API erzeugt
// (kein Sample, offline-fest) - parallel zu typewriterSound.js. Gedacht
// für Bestätigungsmomente: ein Rätsel rastet ein ("Schloss-Einrasten"),
// eine Etappe ist geschafft ("Schiffsglocke").
//
// Respektiert denselben Ton-Schalter wie Schillings Dialoge
// (localStorage "kapArkonaSchillingSound"); der Vibrationsimpuls
// unterbleibt bei "prefers-reduced-motion". Der AudioContext wird erst
// bei Bedarf angelegt - für zuverlässige Wiedergabe unlockSfx() aus einer
// echten Nutzer-Geste heraus aufrufen (siehe audioUnlock.js).

const SOUND_PREF_KEY = 'kapArkonaSchillingSound';

let audioCtx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function unlockSfx() {
  getCtx();
}

function soundEnabled() {
  try {
    return localStorage.getItem(SOUND_PREF_KEY) !== 'false';
  } catch {
    return true;
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function haptic(pattern) {
  if (prefersReducedMotion()) return;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* von der Plattform blockiert - ignorieren */
  }
}

// "Schloss rastet ein": zwei knappe, hochpassgefilterte Klick-Transienten
// plus ein tiefer Riegel-Thunk.
export function playLatch() {
  haptic([12, 20, 28]);
  if (!soundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const click = (t, freq, peak) => {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + 0.03);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 900;

    osc.connect(hp).connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  };

  click(now, 320, 0.14);
  click(now + 0.05, 220, 0.2);

  const thunk = ctx.createOscillator();
  thunk.type = 'sine';
  thunk.frequency.setValueAtTime(140, now + 0.05);
  thunk.frequency.exponentialRampToValueAtTime(70, now + 0.18);

  const thunkGain = ctx.createGain();
  thunkGain.gain.setValueAtTime(0.0001, now + 0.05);
  thunkGain.gain.exponentialRampToValueAtTime(0.18, now + 0.07);
  thunkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

  thunk.connect(thunkGain).connect(ctx.destination);
  thunk.start(now + 0.05);
  thunk.stop(now + 0.28);
}

// "Schiffsglocke": ein paar verstimmte Sinus-Partiale, harter Anschlag,
// langer exponentieller Ausklang.
export function playBell() {
  haptic([30, 40, 60]);
  if (!soundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const base = 523.25; // C5
  const partials = [
    { ratio: 1, peak: 0.22, decay: 1.8 },
    { ratio: 2.76, peak: 0.12, decay: 1.1 },
    { ratio: 5.4, peak: 0.06, decay: 0.7 },
    { ratio: 1.19, peak: 0.05, decay: 1.4 },
  ];

  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  for (const { ratio, peak, decay } of partials) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = base * ratio;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(peak, now + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(env).connect(master);
    osc.start(now);
    osc.stop(now + decay + 0.05);
  }
}
