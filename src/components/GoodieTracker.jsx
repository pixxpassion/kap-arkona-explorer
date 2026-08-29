// src/components/GoodieTracker.jsx
import { useState, useEffect } from 'react';
import { InkChest, InkCheck, InkSeal } from './icons/AntiqueIcons';
import { goodieMilestones } from '../data/stations';

const STORAGE_KEY = 'kapArkonaGoodiesRedeemed';

export default function GoodieTracker({ completedCount }) {
  const [redeemed, setRedeemed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(redeemed));
  }, [redeemed]);

  const milestoneIds = Object.keys(goodieMilestones).map(Number).sort((a, b) => a - b);
  const reachedIds = milestoneIds.filter((id) => completedCount >= id);

  if (reachedIds.length === 0) return null;

  const confirmRedeem = (id) => {
    setRedeemed((prev) => ({ ...prev, [id]: new Date().toLocaleDateString('de-DE') }));
    setConfirmingId(null);
  };

  return (
    <div className="goodie-tracker">
      <h3><InkChest size={20} /> Deine Goodies</h3>
      <div className="goodie-list">
        {reachedIds.map((id) => {
          const redeemedAt = redeemed[id];
          return (
            <div key={id} className={`goodie-item ${redeemedAt ? 'is-redeemed' : ''}`}>
              <div className="goodie-item-head">
                <strong>Etappe {id}</strong>
                {redeemedAt ? (
                  <span className="goodie-redeemed-tag">
                    <InkCheck size={14} /> eingelöst am {redeemedAt}
                  </span>
                ) : (
                  <span className="goodie-open-tag">bereit zur Einlösung</span>
                )}
              </div>

              {!redeemedAt && confirmingId === id && (
                <div className="goodie-confirm">
                  <p>
                    <InkSeal size={17} style={{ verticalAlign: '-3px' }} /> Nur vom{' '}
                    <strong>Personal vor Ort</strong> zu bestätigen - erst danach gilt das
                    Goodie als eingelöst und kann nicht erneut ausgegeben werden.
                  </p>
                  <div className="goodie-confirm-actions">
                    <button className="btn-submit" onClick={() => confirmRedeem(id)}>
                      Einlösung bestätigen
                    </button>
                    <button className="btn-reset-subtle" onClick={() => setConfirmingId(null)}>
                      Abbrechen
                    </button>
                  </div>
                </div>
              )}

              {!redeemedAt && confirmingId !== id && (
                <button className="btn-scan" onClick={() => setConfirmingId(id)}>
                  Jetzt einlösen
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
