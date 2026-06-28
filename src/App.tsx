import { useEffect } from 'react';
import { useStore } from './store/useStore';
import StarField from './components/common/StarField';
import RoulettePage from './pages/RoulettePage';
import ProfilesPage from './pages/ProfilesPage';
import HistoryPage from './pages/HistoryPage';
import { subscribeProfiles, subscribeWeights, loadHistory } from './firebase/db';
import { isFirebaseConfigured } from './firebase/config';

type Page = 'roulette' | 'profiles' | 'history';

const NAV_ITEMS: { id: Page; label: string; emoji: string }[] = [
  { id: 'roulette', label: 'Roleta', emoji: '🎰' },
  { id: 'profiles', label: 'Perfis', emoji: '👤' },
  { id: 'history', label: 'Histórico', emoji: '📋' },
];

export default function App() {
  const { currentPage, setCurrentPage, setProfiles, setWeights, setHistory } = useStore();

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubProfiles = subscribeProfiles((p) => setProfiles(p));
    const unsubWeights = subscribeWeights((w) => setWeights(w.categories, w.flavors));

    loadHistory().then((h) => { if (h.length > 0) setHistory(h); }).catch(() => {});

    return () => {
      unsubProfiles();
      unsubWeights();
    };
  }, [setProfiles, setWeights, setHistory]);

  return (
    <div
      className="scanlines"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #06061a 0%, #0d0d2e 50%, #06061a 100%)',
        position: 'relative',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <StarField />

      {/* Header */}
      <header
        className="header-bar scanlines"
        style={{ padding: '10px 16px', flexShrink: 0, zIndex: 10, position: 'relative' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1
              className="font-display gold-glow"
              style={{ fontSize: '1.4rem', lineHeight: 1, color: 'var(--gold)', margin: 0 }}
            >
              🎰 Peão da Janta Própria
            </h1>
            <p
              className="font-vt blink"
              style={{ fontSize: '0.9rem', color: 'var(--neon-pink)', letterSpacing: '0.1em', marginTop: 1 }}
            >
              ★ SORTEIE SUA JANTA ★
            </p>
          </div>
          {!isFirebaseConfigured && (
            <span
              style={{
                fontSize: '0.65rem',
                background: 'rgba(255,45,120,0.2)',
                border: '1px solid var(--neon-pink)',
                borderRadius: 4,
                padding: '2px 6px',
                color: 'var(--neon-pink)',
                fontFamily: 'VT323, monospace',
              }}
            >
              MODO LOCAL
            </span>
          )}
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 5 }}>
        {currentPage === 'roulette' && <RoulettePage />}
        {currentPage === 'profiles' && <ProfilesPage />}
        {currentPage === 'history' && <HistoryPage />}
      </main>

      {/* Bottom navigation */}
      <nav
        className="nav-bar"
        style={{ display: 'flex', flexShrink: 0, zIndex: 10, position: 'relative' }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="nav-icon">{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
