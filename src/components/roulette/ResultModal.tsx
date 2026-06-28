import Confetti from '../common/Confetti';

interface Props {
  emoji: string;
  title: string;
  subtitle?: string;
  stage: 1 | 2;
  onAccept: () => void;
  onReject: () => void;
}

export default function ResultModal({ emoji, title, subtitle, stage, onAccept, onReject }: Props) {
  return (
    <div className="modal-backdrop">
      <Confetti />

      <div
        className="gold-card bounce-in"
        style={{ width: '100%', maxWidth: 380, padding: '32px 24px', textAlign: 'center' }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--neon-blue)', marginBottom: 8, fontFamily: 'VT323, monospace', letterSpacing: '0.15em' }}>
          {stage === 1 ? '✦ ETAPA 1 — CATEGORIA ✦' : '✦ ETAPA 2 — INGREDIENTE ✦'}
        </div>

        <div
          style={{ fontSize: '5rem', lineHeight: 1, marginBottom: 12, filter: 'drop-shadow(0 0 16px rgba(255,215,0,0.5))' }}
        >
          {emoji}
        </div>

        <h2 className="font-display gold-glow" style={{ fontSize: '2.2rem', color: 'var(--gold)', marginBottom: 4 }}>
          {title}
        </h2>

        {subtitle && (
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', marginBottom: 16 }}>{subtitle}</p>
        )}

        <p className="blink font-vt" style={{ fontSize: '1.4rem', color: 'var(--neon-pink)', marginBottom: 24 }}>
          ★ E AÍ, BORA?! ★
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-danger" style={{ flex: 1 }} onClick={onReject}>
            😤 Girar de Novo
          </button>
          <button className="btn-success" style={{ flex: 1 }} onClick={onAccept}>
            ✅ Aceitar!
          </button>
        </div>
      </div>
    </div>
  );
}
