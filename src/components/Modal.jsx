// src/components/Modal.jsx
import { InkCross } from './icons/AntiqueIcons';

export default function Modal({ title, onClose, children, closeLabel = 'Schließen', bodyBg }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label={closeLabel}>
            <InkCross size={20} />
          </button>
        </div>
        <div className="modal-body">
          {bodyBg && <img src={bodyBg} alt="" className="modal-body-bg" aria-hidden="true" />}
          {children}
        </div>
      </div>
    </div>
  );
}
