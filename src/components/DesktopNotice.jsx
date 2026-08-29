// src/components/DesktopNotice.jsx
import { Smartphone } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

export default function DesktopNotice() {
  return (
    <div className="desktop-notice">
      <img src={assetUrl('icon-192.png.png')} alt="Kap Arkona" className="desktop-notice-logo" />
      <Smartphone size={48} />
      <h1>Nur auf dem Smartphone</h1>
      <p>
        Der Kap Arkona Entdecker nutzt GPS und die Kamera, um Stationen direkt vor Ort
        freizuschalten. Das funktioniert nur auf einem Smartphone, das du während der Tour
        dabei hast - nicht an einem Desktop-Rechner.
      </p>
      <p>Bitte öffne diese Seite auf deinem Handy, während du am Kap Arkona unterwegs bist.</p>
    </div>
  );
}
