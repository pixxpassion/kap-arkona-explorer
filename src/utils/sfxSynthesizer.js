// src/utils/sfxSynthesizer.js
//
// Web-Audio-Synthesizer für kurze UI-Klänge - keine Sample-Dateien,
// offline-fest. Ein einziger AudioContext; alles läuft über duckingNode ->
// destination, damit setDucking() (z. B. während Schilling spricht) die
// komplette Untermalung um 70 % dämpfen kann. Die Ozean-Atmosphäre aus
// typewriterSound.js hängt sich an denselben Knoten (siehe dort).
//
// Aufbau je Effekt: eine öffentliche play*()-Methode löst synchron die
// Haptik aus und delegiert die reine Klang-Synthese an eine render*Audio()-
// Hilfsmethode. Der Klang folgt dem Schalter localStorage
// "kapArkonaSchillingSound"; die Vibration folgt "prefers-reduced-motion".
// Die Haptik läuft bewusst VOR dem Ton-Gate: Wer den Ton stumm geschaltet
// hat (oder gehörlos ist), soll das Feedback trotzdem spüren.

const SOUND_PREF_KEY = 'kapArkonaSchillingSound';

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

// Löst navigator.vibrate synchron zum jeweiligen Klang aus - nur wenn das
// Gerät vibrieren kann und keine reduzierte Bewegung eingestellt ist.
export function triggerHaptic(pattern) {
  if (prefersReducedMotion()) return;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* von der Plattform blockiert (z. B. keine Nutzer-Geste) - ignorieren */
  }
}

class SFXEngine {
  constructor() {
    this.ctx = null;
    this.duckingNode = null;
  }

  // Aus einer echten Nutzer-Geste heraus aufrufen (audioUnlock.js), sonst
  // bleibt der Context auf manchen Browsern "suspended".
  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) return;
      this.ctx = new AudioContextCtor();
      this.duckingNode = this.ctx.createGain();
      this.duckingNode.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.duckingNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  _ready() {
    this.init();
    return Boolean(this.ctx) && soundEnabled();
  }

  // --- 1. Rätsel gelöst: mechanisches Messingschloss ---
  playLatch() {
    // Erst der kurze metallische Klick, dann nach 20 ms der schwere
    // Gehäuse-Impuls.
    triggerHaptic([12, 20, 45]);
    if (!this._ready()) return;
    this.renderLatchAudio(this.ctx.currentTime);
  }

  renderLatchAudio(t) {
    // metallischer Anschlag (Transient)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(1200, t);
    osc1.frequency.exponentialRampToValueAtTime(120, t + 0.04);
    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc1.connect(gain1).connect(this.duckingNode);
    osc1.start(t);
    osc1.stop(t + 0.04);

    // tiefer Riegel-Thunk (Schloss-Gehäuse)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(180, t + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    gain2.gain.setValueAtTime(0.6, t + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc2.connect(gain2).connect(this.duckingNode);
    osc2.start(t + 0.02);
    osc2.stop(t + 0.15);
  }

  // --- 2. Kompass-Rastpunkt: Ticken einer alten Taschenuhr ---
  playClockTick(isSubtle = true) {
    triggerHaptic(6); // winziger Impuls je Rastpunkt
    if (!this._ready()) return;
    this.renderTickAudio(this.ctx.currentTime, isSubtle);
  }

  renderTickAudio(t, isSubtle) {
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * 0.015));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2800;
    filter.Q.value = 5;

    const gain = this.ctx.createGain();
    const peak = isSubtle ? 0.12 : 0.2;
    gain.gain.setValueAtTime(peak, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    noise.connect(filter).connect(gain).connect(this.duckingNode);
    noise.start(t);
  }

  // --- 3. Station erreicht / Meilenstein: Schiffsglocke ---
  playBell() {
    // kräftiger Anschlag, dann zwei sanfte Nachbeben.
    triggerHaptic([50, 40, 20, 30, 10]);
    if (!this._ready()) return;
    this.renderBellAudio(this.ctx.currentTime);
  }

  renderBellAudio(t) {
    const harmonics = [
      { f: 440, g: 0.5, d: 1.8 },
      { f: 880, g: 0.3, d: 1.2 },
      { f: 1235, g: 0.2, d: 0.8 },
      { f: 1760, g: 0.1, d: 0.4 },
    ];
    for (const { f, g, d } of harmonics) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(g, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d);
      osc.connect(gain).connect(this.duckingNode);
      osc.start(t);
      osc.stop(t + d);
    }
  }

  // Untermalung (Atmosphäre + SFX) während Sprache um 70 % dämpfen.
  setDucking(enable) {
    if (!this.ctx || !this.duckingNode) return;
    const now = this.ctx.currentTime;
    const target = enable ? 0.3 : 1.0;
    this.duckingNode.gain.cancelScheduledValues(now);
    this.duckingNode.gain.setValueAtTime(this.duckingNode.gain.value, now);
    this.duckingNode.gain.linearRampToValueAtTime(target, now + 0.3);
  }
}

export const sfx = new SFXEngine();
