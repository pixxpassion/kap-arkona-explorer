// src/components/LandmarkSketch.jsx
//
// Einfache, tintenstrich-artige SVG-Skizzen der sechs Logbuch-Landmarken.
// Bewusst reduziert im Stil einer schnellen Reisezeichnung gehalten,
// nicht fotorealistisch - passend zum "1875er Forscher-Tagebuch"-Look.
// currentColor wird für den Strich genutzt, damit die Farbe (Preußischblau
// Tinte) von außen per CSS "color" gesteuert werden kann.

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

function Schinkelturm() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path {...strokeProps} d="M46 100 L42 40 Q60 30 78 40 L74 100 Z" />
      <path {...strokeProps} d="M42 55 H78 M44 72 H76 M46 88 H74" />
      <path {...strokeProps} d="M50 40 V26 M70 40 V26" />
      <path {...strokeProps} d="M60 26 V16 M55 16 H65" />
      <path {...strokeProps} strokeDasharray="1 5" d="M20 105 Q60 112 100 105" />
    </svg>
  );
}

function Peilturm() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path {...strokeProps} d="M48 100 L44 48 Q60 38 76 48 L72 100 Z" />
      <path {...strokeProps} d="M44 48 Q60 58 76 48" />
      <path {...strokeProps} d="M52 30 Q60 18 68 30 Q60 40 52 30 Z" />
      <path {...strokeProps} d="M46 68 H74 M48 85 H72" />
      <path {...strokeProps} strokeDasharray="1 5" d="M22 105 Q60 112 98 105" />
    </svg>
  );
}

function Vitt() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path {...strokeProps} d="M18 78 Q30 55 42 78 Z" />
      <path {...strokeProps} d="M22 78 V98 H38 V78" />
      <path {...strokeProps} d="M46 82 Q58 62 70 82 Z" />
      <path {...strokeProps} d="M50 82 V98 H66 V82" />
      <path {...strokeProps} d="M76 86 Q86 68 96 86 Z" />
      <path {...strokeProps} d="M79 86 V98 H93 V86" />
      <path {...strokeProps} strokeDasharray="1 5" d="M10 104 Q60 114 110 104" />
      <path {...strokeProps} d="M84 92 L100 88 L98 94" />
    </svg>
  );
}

function Jaromarsburg() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path {...strokeProps} d="M14 96 Q60 60 106 96" />
      <path {...strokeProps} d="M28 90 Q60 66 92 90" />
      <path {...strokeProps} d="M50 66 L50 48 L58 40 L58 58" />
      <path {...strokeProps} strokeDasharray="1 5" d="M8 100 Q60 110 112 100" />
    </svg>
  );
}

function Bunker() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path {...strokeProps} d="M18 98 Q18 62 60 58 Q102 62 102 98 Z" />
      <path {...strokeProps} d="M50 98 V80 H70 V98" />
      <path {...strokeProps} d="M60 58 V38 M52 40 H68" />
      <path {...strokeProps} strokeDasharray="1 5" d="M10 102 Q60 112 110 102" />
    </svg>
  );
}

function Leuchtturm() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path {...strokeProps} d="M52 104 L46 34 Q60 24 74 34 L68 104 Z" />
      <path {...strokeProps} d="M48 60 H72 M50 80 H70" />
      <path {...strokeProps} d="M46 34 H74 M50 24 H70" />
      <path {...strokeProps} d="M60 24 V12" />
      <path {...strokeProps} d="M60 30 L20 14 M60 30 L100 14 M60 30 L18 40 M60 30 L102 40" opacity="0.55" />
      <path {...strokeProps} strokeDasharray="1 5" d="M18 108 Q60 118 102 108" />
    </svg>
  );
}

const SKETCHES = {
  schinkelturm: Schinkelturm,
  peilturm: Peilturm,
  vitt: Vitt,
  jaromarsburg: Jaromarsburg,
  bunker: Bunker,
  leuchtturm: Leuchtturm
};

export default function LandmarkSketch({ id, className = '', style }) {
  const Sketch = SKETCHES[id];
  if (!Sketch) return null;
  return (
    <div className={`mj-sketch ${className}`} style={style}>
      <Sketch />
    </div>
  );
}
