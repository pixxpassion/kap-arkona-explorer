// src/components/CertificateModal.jsx
//
// "Chronisten-Urkunde": Nach allen 15 Stationen fertigt Leuchtturmwärter
// Schilling ein Königlich-Preußisches Patent von 1875 aus. Das Zertifikat
// wird komplett lokal auf einem <canvas> gezeichnet (keine Bilddatei, keine
// Server-Anfrage), lässt sich optional mit einem Namen personalisieren und
// per Web Share API teilen bzw. als PNG herunterladen.
//
// Der eingegebene Name wird nur zur Laufzeit auf den Canvas gezeichnet -
// nicht gespeichert, nicht übertragen (analog zu Standort/Kamerabild, siehe
// LegalModal.jsx).
//
// Props:
//   onClose()        — Modal schließen
//   completedCount   — Anzahl gemeisterter Stationen (Default 15)

import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { InkQuill, InkSeal } from './icons/AntiqueIcons';
import { sfx, triggerHaptic } from '../utils/sfxSynthesizer';

const CANVAS_W = 1200;
const CANVAS_H = 1600;
const PLAYFAIR = '"Playfair Display", Georgia, "Times New Roman", serif';
const COURIER = '"Courier Prime", "Courier New", monospace';
const FALLBACK_NAME = 'ein wackerer Entdecker';

// Die Farbwerte stammen aus dem Theme (@theme in maritime-journal.css legt
// sie als CSS-Variablen auf :root ab). Canvas kann kein var() - daher einmal
// auslesen, mit den kanonischen Werten als Rückfall.
function themeColors() {
  const s = getComputedStyle(document.documentElement);
  const v = (name, fallback) => s.getPropertyValue(name).trim() || fallback;
  return {
    parchment: v('--color-parchment-50', '#faf3e0'),
    ink: v('--color-ink', '#003153'),
    inkSoft: v('--color-ink-soft', '#1d4e73'),
    brass: v('--color-brass', '#c5a059'),
    brassDark: v('--color-brass-dark', '#8a6b33'),
    wax: v('--color-wax', '#8b1e1e'),
    waxLight: v('--color-wax-light', '#b33636'),
    waxDark: v('--color-wax-dark', '#5c1212'),
    cream: v('--color-cream', '#fbf3df'),
  };
}

// Größte Schriftgröße finden, bei der `text` noch in `maxW` passt.
function fitFont(ctx, text, maxW, style, startPx, minPx) {
  let px = startPx;
  ctx.font = `${style} ${px}px ${PLAYFAIR}`;
  while (px > minPx && ctx.measureText(text).width > maxW) {
    px -= 2;
    ctx.font = `${style} ${px}px ${PLAYFAIR}`;
  }
  return px;
}

function drawStar(ctx, cx, cy, spikes, outer, inner) {
  let rot = -Math.PI / 2;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
  for (let i = 0; i < spikes; i += 1) {
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
  }
  ctx.closePath();
  ctx.fill();
}

function drawCertificate(ctx, c, rawName, count) {
  const W = CANVAS_W;
  const H = CANVAS_H;
  const name = (rawName || '').trim() || FALLBACK_NAME;

  ctx.clearRect(0, 0, W, H);

  // --- Pergament-Grund + Alters-/Lichtflecken ---
  ctx.fillStyle = c.parchment;
  ctx.fillRect(0, 0, W, H);

  const stain = (x, y, r, col) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };
  stain(W * 0.16, H * 0.12, 520, 'rgba(138,107,51,0.14)');
  stain(W * 0.86, H * 0.9, 620, 'rgba(138,107,51,0.12)');
  stain(W * 0.5, H * 0.52, 900, 'rgba(184,152,95,0.10)');

  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.72);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(74,54,20,0.22)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  // --- Messing-Doppelrahmen + Eck-Ornamente ---
  ctx.strokeStyle = c.brassDark;
  ctx.lineWidth = 14;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.strokeStyle = c.brass;
  ctx.lineWidth = 4;
  ctx.strokeRect(70, 70, W - 140, H - 140);

  ctx.strokeStyle = c.brassDark;
  ctx.lineWidth = 3;
  const corner = (x, y, sx, sy) => {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * 48);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * 48, y);
    ctx.moveTo(x + sx * 15, y + sy * 15);
    ctx.lineTo(x + sx * 33, y + sy * 33);
    ctx.stroke();
  };
  corner(98, 98, 1, 1);
  corner(W - 98, 98, -1, 1);
  corner(98, H - 98, 1, -1);
  corner(W - 98, H - 98, -1, -1);

  // --- Kopf ---
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = c.ink;
  const titlePx = fitFont(ctx, 'KÖNIGLICH PREUSSISCHES PATENT', W - 200, '700', 56, 34);
  ctx.font = `700 ${titlePx}px ${PLAYFAIR}`;
  ctx.fillText('KÖNIGLICH PREUSSISCHES PATENT', W / 2, 234);

  ctx.fillStyle = c.inkSoft;
  ctx.font = `italic 700 30px ${PLAYFAIR}`;
  ctx.fillText('Kap Arkona · Expeditions-Nachweis von 1875', W / 2, 292);

  ctx.strokeStyle = c.brass;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 260, 340);
  ctx.lineTo(W / 2 + 260, 340);
  ctx.stroke();
  ctx.fillStyle = c.brassDark;
  drawStar(ctx, W / 2, 340, 4, 13, 4);

  // --- Fließtext ---
  ctx.fillStyle = c.ink;
  ctx.font = `400 32px ${PLAYFAIR}`;
  ctx.fillText('Hiermit wird beurkundet, daß', W / 2, 456);

  ctx.fillStyle = c.wax;
  const namePx = fitFont(ctx, name, W - 260, 'italic 700', 60, 30);
  ctx.font = `italic 700 ${namePx}px ${PLAYFAIR}`;
  ctx.fillText(name, W / 2, 560);

  ctx.fillStyle = c.ink;
  ctx.font = `400 31px ${PLAYFAIR}`;
  const lines = [
    `sämtliche ${count} Stationen rund um das Kap Arkona`,
    'mit Scharfsinn und Ausdauer erkundet, jedes Rätsel',
    'gelöst und alles im Logbuch verzeichnet hat.',
  ];
  lines.forEach((line, i) => ctx.fillText(line, W / 2, 656 + i * 52));

  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  ctx.fillStyle = c.inkSoft;
  ctx.font = `400 26px ${COURIER}`;
  ctx.fillText(`Ausgestellt am Kap Arkona, den ${today}`, W / 2, 892);

  // --- Wachssiegel ---
  const R = 118;
  ctx.save();
  ctx.translate(W / 2, 1180);

  ctx.beginPath();
  for (let a = 0; a < Math.PI * 2 + 0.001; a += Math.PI / 18) {
    const rr = R + Math.sin(a * 7) * 6 + Math.cos(a * 3) * 4;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    if (a === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const waxFill = ctx.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.2, 0, 0, R * 1.1);
  waxFill.addColorStop(0, c.waxLight);
  waxFill.addColorStop(0.55, c.wax);
  waxFill.addColorStop(1, c.waxDark);
  ctx.fillStyle = waxFill;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = c.waxDark;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, R - 22, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(251,243,223,0.5)';
  ctx.stroke();

  ctx.fillStyle = c.cream;
  ctx.font = `700 25px ${PLAYFAIR}`;
  ctx.fillText('KAP ARKONA', 0, -12);
  ctx.font = `700 34px ${PLAYFAIR}`;
  ctx.fillText('1875', 0, 32);
  drawStar(ctx, -72, 4, 5, 12, 5);
  drawStar(ctx, 72, 4, 5, 12, 5);
  ctx.restore();

  // --- Unterschrift ---
  ctx.strokeStyle = c.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 230, 1408);
  ctx.lineTo(W / 2 + 230, 1408);
  ctx.stroke();
  ctx.fillStyle = c.inkSoft;
  ctx.font = `italic 700 25px ${PLAYFAIR}`;
  ctx.fillText('Leuchtturmwärter Schilling · Chronist vom Kap', W / 2, 1442);
}

export default function CertificateModal({ onClose, completedCount = 15 }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef(null);
  const openedRef = useRef(false);

  // Schiffsglocke + festliches Vibrationsmuster beim Öffnen. Das Modal wird
  // nur nach einer Nutzer-Geste gemountet (Finale-Effekt bzw. Button), daher
  // wird navigator.vibrate hier nicht stumm verworfen. Der Ref-Guard hält es
  // im React-StrictMode (Dev-Doppelmount) bei einem Läuten.
  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    sfx.playBell();
    triggerHaptic([100, 50, 100, 50, 200]);
  }, []);

  // Urkunde (neu) zeichnen - bei Namensänderung. Wartet auf die lokal
  // eingebundene Playfair-Display-Schrift, sonst zeichnet Canvas mit einer
  // Fallback-Serife und der Name "springt" beim späteren Nachladen.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const colors = themeColors();

    let cancelled = false;
    const paint = () => {
      if (!cancelled) drawCertificate(ctx, colors, name, completedCount);
    };

    if (document.fonts?.load) {
      Promise.all([
        document.fonts.load(`700 56px ${PLAYFAIR}`),
        document.fonts.load(`italic 700 60px ${PLAYFAIR}`),
        document.fonts.load(`400 32px ${PLAYFAIR}`),
        document.fonts.load(`400 26px ${COURIER}`),
      ]).then(paint, paint);
    } else {
      paint();
    }

    return () => { cancelled = true; };
  }, [name, completedCount]);

  const handleShare = () => {
    const canvas = canvasRef.current;
    if (!canvas || busy) return;
    setBusy(true);

    canvas.toBlob(async (blob) => {
      try {
        if (!blob) return;
        const file = new File([blob], 'Kap-Arkona-Urkunde-1875.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Königlich Preußisches Patent – Kap Arkona 1875',
              text: 'Ich habe alle Stationen am Kap Arkona erkundet.',
              files: [file],
            });
            return;
          } catch (err) {
            // Vom Nutzer abgebrochen: nichts weiter tun. Sonst: Download.
            if (err && err.name === 'AbortError') return;
          }
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Kap-Arkona-Urkunde-1875.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } finally {
        setBusy(false);
      }
    }, 'image/png');
  };

  const shownName = name.trim() || FALLBACK_NAME;

  return (
    <Modal
      title={<><InkQuill size={20} style={{ verticalAlign: '-4px', marginRight: '6px' }} />Chronisten-Urkunde</>}
      onClose={onClose}
      closeLabel="Urkunde schließen"
    >
      <p className="certificate-intro">
        Trag deinen Namen ein, dann setzt der Chronist ihn ins Patent - ohne
        Eintrag lautet es auf &bdquo;{FALLBACK_NAME}&ldquo;. Alles bleibt auf
        deinem Ger&auml;t.
      </p>

      <label className="certificate-field">
        <span>Name f&uuml;r die Urkunde</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={32}
          placeholder={'z. B. „Wilhelmine Kruse“'}
          autoComplete="off"
        />
      </label>

      <div className="certificate-canvas-frame">
        <canvas
          ref={canvasRef}
          className="certificate-canvas"
          role="img"
          aria-label={`Urkunde: ${shownName} hat alle ${completedCount} Stationen am Kap Arkona gemeistert.`}
        />
      </div>

      <div className="certificate-actions">
        <button type="button" className="btn-next" onClick={handleShare} disabled={busy}>
          <InkSeal size={18} style={{ verticalAlign: '-3px', marginRight: '6px' }} />
          {busy ? 'einen Moment …' : 'Urkunde sichern & teilen'}
        </button>
      </div>
    </Modal>
  );
}
