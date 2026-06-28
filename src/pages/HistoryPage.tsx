import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { subscribeHistory } from '../firebase/db';
import { isFirebaseConfigured } from '../firebase/config';
import RatingStars from '../components/common/RatingStars';
import type { HistoryEntry } from '../types';

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const date = new Date(entry.date);
  const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="history-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '1.4rem' }}>{entry.categoryEmoji}</span>
            <span className="font-display gold-text" style={{ fontSize: '1.2rem' }}>{entry.category}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: '1rem' }}>{entry.flavorEmoji}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{entry.flavor}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="font-righteous" style={{ color: 'var(--neon-blue)', fontSize: '1rem' }}>{dateStr}</p>
          <p className="font-righteous" style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{timeStr}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--gold-dark)' }}>📍 {entry.restaurant}</p>
          {entry.price > 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              💰 R$ {entry.price.toFixed(2)}
            </p>
          )}
        </div>
        <RatingStars value={entry.rating} readonly size="1.1rem" />
      </div>

      {entry.participants && (
        <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
          {entry.participants.map((p) => (
            <span
              key={p}
              style={{ fontSize: '0.7rem', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 12, padding: '2px 8px', color: 'var(--gold-dark)' }}
            >
              {p === 'mateus' ? '👨 Mateus' : '👩 Amanda'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { history, setHistory } = useStore();

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = subscribeHistory((entries) => setHistory(entries));
    return unsub;
  }, [setHistory]);

  const avgRating = history.length > 0
    ? (history.reduce((s, e) => s + e.rating, 0) / history.length).toFixed(1)
    : '—';

  const totalSpent = history.reduce((s, e) => s + (e.price || 0), 0);

  return (
    <div className="scroll-area" style={{ flex: 1, padding: '12px 16px 16px' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div className="gold-card" style={{ flex: 1, padding: '10px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Pedidos</p>
          <p className="font-righteous gold-text" style={{ fontSize: '2rem' }}>{history.length}</p>
        </div>
        <div className="gold-card" style={{ flex: 1, padding: '10px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Nota Média</p>
          <p className="font-righteous gold-text" style={{ fontSize: '2rem' }}>{avgRating}</p>
        </div>
        <div className="gold-card" style={{ flex: 1, padding: '10px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Total Gasto</p>
          <p className="font-righteous gold-text" style={{ fontSize: '1.4rem' }}>
            R${totalSpent.toFixed(0)}
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: 12 }}>🍽️</div>
          <p className="font-display" style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>
            Nenhum registro ainda!
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: 6 }}>
            Gire a roleta e registre seus pedidos aqui.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.map((entry) => (
            <HistoryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
