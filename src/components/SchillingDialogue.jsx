// src/components/SchillingDialogue.jsx
//
// Wiederverwendbare Dialog-Komponente: zeigt einen Text von Leuchtturmwärter
// Schilling, als wäre er auf eine Depeschen-Notiz getippt und auf eine
// Seekarte gepinnt worden. Der Text erscheint per Schreibmaschinen-Effekt,
// dazu läuft (per Nutzer:in umschaltbar, lokal gemerkt) ein dezentes
// Meeresrauschen, solange getippt wird. Ist "audioSrc" gesetzt, läuft
// zusätzlich eine echte (mit ElevenLabs vertonte) Aufnahme parallel; ohne
// "audioSrc" fällt die Komponente auf die geräteeigene Sprachausgabe (Web
// Speech API) zurück - alles über denselben Ton-Toggle gesteuert.
//
// Der allererste Dialog einer Sitzung würde ganz ohne vorherigen Klick
// erscheinen (v.a. bei wiederkehrenden Besuchen, wenn das Onboarding-Modal
// längst weggetippt wurde) - Browser blockieren dafür aber Audio/
// Sprachausgabe zuverlässig (Autoplay-Regeln). Statt das zu versuchen und
// zu scheitern, zeigt die äußere Gate-Komponente unten in dem Fall
// zunächst eine Antipp-Aufforderung und mountet "DispatchContent" (mit
// dem eigentlichen Tipp-Effekt) erst nach der ersten Geste irgendwo auf
// der Seite - ab dann garantiert erlaubt, und mit einer frischen
// Komponenten-Instanz startet useTypewriter ganz normal (der Hook ist
// bewusst nicht darauf ausgelegt, dass sich "text" an derselben Instanz
// nachträglich ändert - siehe useTypewriter.js). Alle späteren Dialoge
// (nach einem Stations-Wechsel per Button-Klick, selbst schon eine Geste)
// mounten "DispatchContent" direkt beim ersten Render, ganz ohne
// Aufforderung dazwischen.
//
// Nutzung:
//   <SchillingDialogue text={currentStation.schillingText} audioSrc={currentStation.schillingAudio} />
//
// Optionale Props:
//   speed       — ms pro Zeichen (Default 32)
//   avatarSrc   — abweichendes Portrait-Bild (Default: schilling-fernglas.webp)
//   audioSrc    — Pfad zu einer vertonten Aufnahme des Texts (public/audio/*.mp3);
//                 ohne diese Prop wird stattdessen die Web-Speech-API genutzt
//   label       — Beschriftung über dem Text (Default: Logbuch-Zeile)
//   className   — zusätzliche Klassen für den äußeren Rahmen

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { InkBell, InkBellOff, InkQuill } from './icons/AntiqueIcons';
import { useTypewriter } from '../hooks/useTypewriter';
import { startOceanAmbience, stopOceanAmbience } from '../utils/typewriterSound';
import { speakText, stopSpeech } from '../utils/speech';
import { sfx } from '../utils/sfxSynthesizer';
import { acquireVoice, releaseVoice } from '../utils/voicePlayback';
import { hasGestured, onFirstGesture } from '../utils/audioUnlock';
import { assetUrl } from '../utils/assetUrl';

const SOUND_PREF_KEY = 'kapArkonaSchillingSound';

function loadSoundPref() {
  try {
    const saved = localStorage.getItem(SOUND_PREF_KEY);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

export default function SchillingDialogue(props) {
  const { text, avatarSrc, label = 'Aus dem Logbuch des Leuchtturmwärters', className = '' } = props;

  // Lazy-Initializer: für den allerersten Dialog einer Sitzung false, für
  // alle späteren schon true, da bis dahin garantiert schon eine Geste
  // stattgefunden hat.
  const [ready, setReady] = useState(hasGestured);

  // "flushSync" erzwingt, dass das Mounten von DispatchContent (und damit
  // dessen erster audio.play()-Aufruf) NOCH SYNCHRON innerhalb desselben
  // Tastendruck-/Antipp-Ereignisses passiert, statt erst im nächsten,
  // leicht späteren Effekt-Durchlauf - manche mobilen Browser werten
  // sonst den Zeitpunkt nicht mehr als "echte" Nutzer-Geste, und die
  // Wiedergabe bleibt stumm blockiert.
  useEffect(() => {
    if (ready) return undefined;
    return onFirstGesture(() => flushSync(() => setReady(true)));
  }, [ready]);

  if (!text) return null;

  if (!ready) {
    return (
      <div
        className={`mj-dispatch-note ${className}`}
        onClick={() => flushSync(() => setReady(true))}
        role="button"
        aria-label="Logbucheintrag öffnen"
      >
        <span className="mj-dispatch-pin" aria-hidden="true" />
        <div className="mj-dispatch-head">
          <div className="mj-avatar-frame">
            <img
              src={avatarSrc || assetUrl('schilling-fernglas.webp')}
              alt="Leuchtturmwärter Schilling"
            />
          </div>
          <div className="mj-dispatch-label">
            <InkQuill size={14} />
            <span>{label}</span>
          </div>
        </div>
        <p className="mj-dispatch-text">Antippen, um den Logbucheintrag zu öffnen …</p>
      </div>
    );
  }

  return <DispatchContent {...props} />;
}

function DispatchContent({
  text,
  speed = 32,
  avatarSrc,
  audioSrc,
  label = 'Aus dem Logbuch des Leuchtturmwärters',
  className = '',
}) {
  const [soundOn, setSoundOn] = useState(loadSoundPref);
  const currentAudioRef = useRef(null);
  // Eindeutiges Token dieser Dialog-Instanz für die geteilte Stimm-Sperre
  // (voicePlayback.js): nur ein Schilling redet zur Zeit.
  const voiceTokenRef = useRef(null);
  if (voiceTokenRef.current === null) voiceTokenRef.current = Symbol('schilling-voice');
  // Hält diese Instanz gerade die Stimme? (steuert, ob handleSkip die Ausgabe
  // stoppen darf - eine stumm gebliebene Notiz soll fremde Ausgaben nicht
  // abwürgen).
  const holdsVoiceRef = useRef(false);

  const { displayed, isTyping, skip } = useTypewriter(text, { speed });

  // Dezentes Meeresrauschen, solange der Text noch "geschrieben" wird -
  // ersetzt den früheren Klick-Sound pro Zeichen, der als störend
  // empfunden wurde. Startet/stoppt automatisch mit isTyping bzw. beim
  // Ein-/Ausschalten des Tons (Cleanup greift auch beim Antippen zum
  // Überspringen, da "skip" isTyping auf false setzt).
  useEffect(() => {
    if (soundOn && isTyping) {
      startOceanAmbience();
      return () => stopOceanAmbience();
    }
    return undefined;
  }, [isTyping, soundOn]);

  // Spielt Schillings Stimme parallel zum Tipp-Effekt ab (nicht
  // zeichen-synchron - Sprachausgabe/Audio lässt sich nicht sinnvoll an
  // die Tippgeschwindigkeit koppeln). Mit "audioSrc" läuft die echte,
  // vertonte Aufnahme; ohne "audioSrc" die geräteeigene Sprachausgabe als
  // Rückfalllösung. "soundOn" in den Dependencies sorgt nebenbei dafür,
  // dass ein Umschalten des Ton-Toggles eine laufende Ausgabe sofort
  // stoppt (Cleanup) bzw. den aktuellen Text neu abspielt, wenn wieder
  // eingeschaltet wird. Da diese Komponente erst nach der ersten
  // Nutzer-Geste gemountet wird (siehe SchillingDialogue oben), sollte
  // audio.play() hier nie mehr durch Autoplay-Regeln blockiert werden.
  useEffect(() => {
    if (!soundOn) return undefined;

    // Läuft anderswo schon eine vertonte Schilling-Ausgabe (z. B. der
    // Stationstext, während man einen Logbuch-Eintrag öffnet)? Dann diese
    // Notiz still lassen - der Schreibmaschinen-Effekt läuft trotzdem.
    const token = voiceTokenRef.current;
    if (!acquireVoice(token)) return undefined;
    holdsVoiceRef.current = true;

    const release = () => {
      holdsVoiceRef.current = false;
      releaseVoice(token);
    };

    if (audioSrc) {
      const audio = new Audio(audioSrc);
      currentAudioRef.current = audio;
      // Untermalung dämpfen, solange die Aufnahme läuft (analog zu
      // speech.js für die Web-Speech-Ausgabe).
      const duckOn = () => sfx.setDucking(true);
      const finish = () => { sfx.setDucking(false); release(); };
      audio.addEventListener('playing', duckOn);
      audio.addEventListener('ended', finish);
      audio.addEventListener('pause', finish);
      audio.play().catch(finish);
      return () => {
        audio.pause();
        audio.removeEventListener('playing', duckOn);
        audio.removeEventListener('ended', finish);
        audio.removeEventListener('pause', finish);
        sfx.setDucking(false);
        release();
      };
    }

    speakText(text, release);
    return () => {
      stopSpeech();
      release();
    };
  }, [text, soundOn, audioSrc]);

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      try { localStorage.setItem(SOUND_PREF_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const handleSkip = () => {
    // Nur die eigene Ausgabe stoppen. Eine still gebliebene Notiz (Stimme
    // von woanders belegt) darf beim Antippen die fremde Ausgabe nicht
    // abbrechen - sie überspringt dann nur den Schreibmaschinen-Effekt.
    if (holdsVoiceRef.current) {
      stopSpeech();
      currentAudioRef.current?.pause();
    }
    skip();
  };

  return (
    <div
      className={`mj-dispatch-note ${className}`}
      onClick={handleSkip}
      role={isTyping ? 'button' : undefined}
      aria-label={isTyping ? 'Text vollständig anzeigen' : undefined}
    >
      <span className="mj-dispatch-pin" aria-hidden="true" />

      <button
        type="button"
        className="mj-sound-toggle"
        onClick={(e) => { e.stopPropagation(); toggleSound(); }}
        aria-label={soundOn ? 'Ton & Vorlesen ausschalten' : 'Ton & Vorlesen einschalten'}
        aria-pressed={soundOn}
      >
        {soundOn ? <InkBell size={17} /> : <InkBellOff size={17} />}
      </button>

      <div className="mj-dispatch-head">
        <div className="mj-avatar-frame">
          <img
            src={avatarSrc || assetUrl('schilling-fernglas.webp')}
            alt="Leuchtturmwärter Schilling"
          />
        </div>
        <div className="mj-dispatch-label">
          <InkQuill size={14} />
          <span>{label}</span>
        </div>
      </div>

      <p className="mj-dispatch-text">
        {displayed}
        {isTyping && <span className="mj-typewriter-cursor" aria-hidden="true">|</span>}
      </p>

      {isTyping && <span className="mj-dispatch-skip-hint">antippen zum Überspringen</span>}
    </div>
  );
}
