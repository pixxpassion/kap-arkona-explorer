// src/components/puzzles/ScratchReveal.jsx
//
// "Verwitterte Inschrift freilegen": über der eingemeißelten Inschrift
// liegt eine undurchsichtige Flechten-/Verwitterungsschicht auf einem
// <canvas>. Mit dem Finger (Pointer Events, funktioniert auch mit Maus)
// wird sie weggekratzt. Ist ein Schwellenwert an freigelegter Fläche
// erreicht, gilt die Inschrift als lesbar (onReveal) und der Rest der
// Schicht blendet weg. Während des Kratzens gibt es kurze haptische Ticks,
// beim Freilegen einen kräftigeren Impuls (navigator.vibrate) - beides nur,
// wenn das Gerät vibrieren kann und keine reduzierte Bewegung eingestellt
// ist.
//
// Motorik-Fallback: ein Button legt die Inschrift direkt frei (für Personen,
// die nicht kratzen können, oder bei prefers-reduced-motion).
//
// Props:
//   revealText — die eingemeißelte Inschrift (kurzer Text)
//   threshold  — freizulegender Flächenanteil 0..1 (Default 0.6)
//   prompt     — optionaler Hinweistext über dem Feld
//   onReveal   — Callback, sobald die Inschrift lesbar ist

import { useCallback, useEffect, useRef, useState } from 'react';

const SAMPLE_STEP = 8; // nur jeden n-ten Pixel für die Fortschrittsmessung prüfen
const SCRATCH_RADIUS = 22; // CSS-Pixel

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function vibrate(pattern) {
  if (prefersReducedMotion()) return;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* von der Plattform blockiert - ignorieren */
  }
}

export default function ScratchReveal({ revealText, threshold = 0.6, prompt, onReveal }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const lastTickRef = useRef(0);
  const rafRef = useRef(0);
  const revealedRef = useRef(false);

  const [progress, setProgress] = useState(0); // 0..1 relativ zum threshold
  const [done, setDone] = useState(false);

  // --- Canvas einrichten (StrictMode-sicher: canvas.width zurücksetzen
  //     setzt auch die Transform-Matrix zurück, deshalb hier alles zusammen) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;

    // Grundfläche: mattes Moosgrün-Braun
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#6b5836';
    ctx.fillRect(0, 0, rect.width, rect.height);
    // unregelmäßige Flecken für den Verwitterungs-Look
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const r = 5 + Math.random() * 24;
      const g1 = 40 + ((Math.random() * 60) | 0);
      const g2 = 45 + ((Math.random() * 55) | 0);
      const g3 = 22 + ((Math.random() * 32) | 0);
      ctx.fillStyle = `rgba(${g1}, ${g2}, ${g3}, ${(0.2 + Math.random() * 0.45).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const doReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setProgress(1);
    setDone(true);
    vibrate([35, 45, 70]);
    onReveal?.();
  }, [onReveal]);

  const measure = useCallback(
    (immediate) => {
      if (rafRef.current && !immediate) return;
      const run = () => {
        rafRef.current = 0;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clear = 0;
        let total = 0;
        for (let i = 3; i < data.length; i += 4 * SAMPLE_STEP) {
          total += 1;
          if (data[i] === 0) clear += 1;
        }
        const frac = total ? clear / total : 0;
        setProgress(Math.min(frac / threshold, 1));
        if (frac >= threshold) doReveal();
      };
      if (immediate) run();
      else rafRef.current = requestAnimationFrame(run);
    },
    [threshold, doReveal],
  );

  const eraseAt = (x, y) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    const last = lastPointRef.current;
    if (last) {
      ctx.lineWidth = SCRATCH_RADIUS * 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    lastPointRef.current = { x, y };
  };

  const pointFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    if (revealedRef.current) return;
    drawingRef.current = true;
    lastPointRef.current = null;
    canvasRef.current.setPointerCapture?.(e.pointerId);
    const { x, y } = pointFromEvent(e);
    eraseAt(x, y);
  };

  const handlePointerMove = (e) => {
    if (!drawingRef.current || revealedRef.current) return;
    const { x, y } = pointFromEvent(e);
    eraseAt(x, y);

    const now = performance.now();
    if (now - lastTickRef.current > 180) {
      lastTickRef.current = now;
      vibrate(6);
    }
    measure(false);
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    measure(true);
  };

  return (
    <div className="scratch-puzzle-container">
      {prompt && <p className="scratch-puzzle-prompt">{prompt}</p>}

      <div className="scratch-stage">
        <div className="scratch-inscription" aria-hidden={!done}>
          <span>{revealText}</span>
        </div>
        <canvas
          ref={canvasRef}
          className={`scratch-canvas ${done ? 'is-cleared' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
          onPointerCancel={endStroke}
        />
      </div>

      <div
        className="scratch-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Freigelegte Fläche"
      >
        <div className="scratch-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {!done && (
        <button type="button" className="btn-reset-subtle" onClick={doReveal}>
          Nicht lesbar? Inschrift direkt freilegen
        </button>
      )}
    </div>
  );
}
