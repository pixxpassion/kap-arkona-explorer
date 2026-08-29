// src/components/icons/AntiqueIcons.jsx
//
// Handgezeichnete, tintenstrich-artige Ersatz-Icons für die generischen
// lucide-react-Piktogramme innerhalb des antiken 1875er-Themas (Dispatch-
// Note, Logbuch, Rätsel-UI, Goodie-Tracker, Onboarding). Gleiche Stil-Idee
// wie LandmarkSketch.jsx: nur Strich (currentColor), keine Füllflächen,
// runde Kappen/Ecken statt cleaner Vektor-Geometrie - wirkt eher wie eine
// Kupferstich-/Radierlinie als ein modernes Flat-Icon.
//
// Bewusst NICHT verwendet für Header/DesktopNotice (bleiben laut
// CI-Entscheidung beim echten Marken-Look, siehe CLAUDE.md-Kontext dieses
// Projekts nicht - hier: App.jsx-Header ist bewusst kein Theme-Element).

const strokeBase = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

function Icon({ size = 18, strokeWidth = 1.7, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
      <g {...strokeBase} strokeWidth={strokeWidth}>
        {children}
      </g>
    </svg>
  );
}

// Kompassrose - ersetzt "Compass" (Onboarding-Titel)
export function InkCompass(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.3 V5.6 M12 18.4 V20.7 M3.3 12 H5.6 M18.4 12 H20.7" />
      <path d="M14.6 9.4 L12.3 13.7 L9.4 14.6 L11.7 10.3 Z" strokeWidth="1.4" />
    </Icon>
  );
}

// Kartennadel - ersetzt "MapPin" (Ziel/Standort)
export function InkMapPin(props) {
  return (
    <Icon {...props}>
      <path d="M12 3.2 C8 3.2 5.3 6.1 5.3 9.5 C5.3 14 12 20.5 12 20.5 C12 20.5 18.7 14 18.7 9.5 C18.7 6.1 16 3.2 12 3.2 Z" />
      <circle cx="12" cy="9.4" r="2.1" />
    </Icon>
  );
}

// Altes Vorhängeschloss - ersetzt "Lock" und das 🔒-Emoji im Wachssiegel
export function InkLock(props) {
  return (
    <Icon {...props}>
      <rect x="5.8" y="11" width="12.4" height="9" rx="1.2" />
      <path d="M8.2 11 V7.6 A3.8 3.8 0 0 1 15.8 7.6 V11" />
      <path d="M12 14.3 V17" strokeWidth="2" />
    </Icon>
  );
}

// Seemannskiste - ersetzt "Gift" (Goodies)
export function InkChest(props) {
  return (
    <Icon {...props}>
      <path d="M4.2 10.8 C4.2 8.3 6.2 6.8 9 6.8 H15 C17.8 6.8 19.8 8.3 19.8 10.8 V19.2 H4.2 Z" />
      <path d="M4.2 13.6 H19.8" />
      <path d="M10.5 13.6 V11.9 A1.5 1.5 0 0 1 13.5 11.9 V13.6" />
      <path d="M9 6.8 Q12 4 15 6.8" />
    </Icon>
  );
}

// Aufgeschlagenes Journal - ersetzt "BookOpen" (Entdecker-Logbuch)
export function InkBook(props) {
  return (
    <Icon {...props}>
      <path d="M12 6.8 C9.9 5.3 7 5 4.6 5.6 V18 C7 17.4 9.9 17.7 12 19.2 C14.1 17.7 17 17.4 19.4 18 V5.6 C17 5 14.1 5.3 12 6.8 Z" />
      <path d="M12 6.8 V19.2" />
    </Icon>
  );
}

// Feder-Häkchen - ersetzt "Check" (eingelöstes Goodie)
export function InkCheck(props) {
  return (
    <Icon {...props}>
      <path d="M4.6 12.6 L9.4 17.4 L19.4 6.6" strokeWidth="2" />
    </Icon>
  );
}

// Wachssiegel-Stempel - ersetzt "ShieldCheck" (Vor-Ort-Bestätigung)
export function InkSeal(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="9.8" r="6.2" />
      <path d="M9.3 9.6 L11.1 11.7 L14.8 7.4" strokeWidth="1.5" />
      <path d="M8.4 15.3 L6.7 20.4 L9.8 18.8 L12 20.9 L14.2 18.8 L17.3 20.4 L15.6 15.3" />
    </Icon>
  );
}

// Amtliche Schriftrolle mit Ausrufezeichen - ersetzt "ShieldAlert" (Hinweis)
export function InkScrollAlert(props) {
  return (
    <Icon {...props}>
      <path d="M6.3 4.6 H16.2 A1.4 1.4 0 0 1 17.6 6 V18.5 A1.4 1.4 0 0 1 16.2 19.9 H6.3" />
      <path d="M6.3 4.6 A1.4 1.4 0 0 0 6.3 7.4 M6.3 17.1 A1.4 1.4 0 0 0 6.3 19.9" />
      <path d="M12 9.2 V13.6" strokeWidth="2" />
      <circle cx="12" cy="16.4" r="0.6" fill="currentColor" stroke="none" />
    </Icon>
  );
}

// Einfache Schleifen-Pfeil - ersetzt "RefreshCw" (Cache leeren)
export function InkLoop(props) {
  return (
    <Icon {...props}>
      <path d="M5.2 12 A6.8 6.8 0 1 1 8.1 17.3" />
      <path d="M4.2 14.1 L5.2 17.8 L8.7 16.6" />
    </Icon>
  );
}

// Schiffsglocke an - ersetzt "Volume2" (Ton an)
export function InkBell(props) {
  return (
    <Icon {...props}>
      <path d="M12 5.2 C9.7 5.2 8.3 7 8.3 9.8 C8.3 13.6 6.9 15 6.9 15 H17.1 C17.1 15 15.7 13.6 15.7 9.8 C15.7 7 14.3 5.2 12 5.2 Z" />
      <path d="M10.1 17.6 A1.9 1.9 0 0 0 13.9 17.6" />
      <path d="M4.8 9.3 Q3.9 11.6 4.8 13.9" opacity="0.65" />
      <path d="M19.2 9.3 Q20.1 11.6 19.2 13.9" opacity="0.65" />
    </Icon>
  );
}

// Schiffsglocke aus - ersetzt "VolumeX" (Ton aus)
export function InkBellOff(props) {
  return (
    <Icon {...props}>
      <path d="M12 5.2 C9.7 5.2 8.3 7 8.3 9.8 C8.3 12.2 7.7 13.6 7.2 14.4" />
      <path d="M15.7 9.8 C15.7 7 14.3 5.2 12 5.2" opacity="0.45" />
      <path d="M6.9 15 H17.1 C17.1 15 15.7 13.6 15.7 9.8" />
      <path d="M10.1 17.6 A1.9 1.9 0 0 0 13.9 17.6" />
      <path d="M4 4 L20 20" strokeWidth="1.8" />
    </Icon>
  );
}

// Schwungfeder - ersetzt "Feather" (Logbuch-Label)
export function InkQuill(props) {
  return (
    <Icon {...props}>
      <path d="M19 5 C13.3 6 8.6 10.7 7.1 16.8" />
      <path d="M19 5 C17.2 8 15.4 8.5 13.5 9 M19 5 C16.7 6.6 16.2 8.4 15.7 10.4" opacity="0.65" />
      <path d="M7.1 16.8 L5.2 18.7" strokeWidth="1.4" />
    </Icon>
  );
}

// Feder-gezogenes Kreuz - ersetzt "X" (Modal schließen)
export function InkCross(props) {
  return (
    <Icon {...props}>
      <path d="M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5" strokeWidth="1.8" />
    </Icon>
  );
}

// Signalfackel/Feuerwerk - ersetzt "PartyPopper" (Finale)
export function InkBurst(props) {
  return (
    <Icon {...props}>
      <path d="M12 2.6 V6.4 M12 21.4 V17.6 M2.6 12 H6.4 M21.4 12 H17.6 M5.4 5.4 L8 8 M18.6 5.4 L16 8 M5.4 18.6 L8 16 M18.6 18.6 L16 16" />
      <circle cx="12" cy="12" r="2.6" />
    </Icon>
  );
}

// Alte Balgenkamera - ersetzt "QrCode"/"InkQrFrame" (Foto-Nachweis statt
// QR-Scan als Alternative zur GPS-Freischaltung)
export function InkCamera(props) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="8" width="17" height="11" rx="1.4" />
      <path d="M8.6 8 L9.8 5.6 H14.2 L15.4 8" />
      <circle cx="12" cy="13.4" r="3.5" />
      <circle cx="12" cy="13.4" r="1.4" />
      <path d="M6.5 10.4 H7.6" strokeWidth="1.4" />
    </Icon>
  );
}

// Gefaltete Seekarte mit Routen-Linie - zum gezielten Ein-/Ausblenden der
// eingebetteten Karte (statt der generischen "MapPin"-Standortnadel, die
// an anderer Stelle schon für "Ziel erreicht" steht)
export function InkFoldedMap(props) {
  return (
    <Icon {...props}>
      <path d="M4 6.5 L9 4.5 L15 6.5 L20 4.5 V17.5 L15 19.5 L9 17.5 L4 19.5 Z" />
      <path d="M9 4.5 V17.5 M15 6.5 V19.5" opacity="0.6" />
      <path d="M6.3 9.6 Q10 11.2 13 9.2 T17.6 10.2" strokeWidth="1.3" strokeDasharray="1.6 1.6" />
    </Icon>
  );
}
