import { useState } from 'react';
import { useStore } from '../store/useStore';
import { INGREDIENTS, INGREDIENT_CATEGORY_LABELS } from '../data/ingredients';
import { saveProfiles } from '../firebase/db';
import type { ProfileName, IngredientCategory } from '../types';

const PROFILES: { id: ProfileName; label: string; emoji: string }[] = [
  { id: 'mateus', label: 'Mateus', emoji: '👨' },
  { id: 'amanda', label: 'Amanda', emoji: '👩' },
];

const CATEGORIES = Object.keys(INGREDIENT_CATEGORY_LABELS) as IngredientCategory[];

export default function ProfilesPage() {
  const { profiles, toggleIngredientPreference } = useStore();
  const [activeProfile, setActiveProfile] = useState<ProfileName>('mateus');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const profile = profiles[activeProfile];

  const toggle = (type: 'likes' | 'dislikes', id: string) => {
    toggleIngredientPreference(activeProfile, type, id);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfiles(profiles);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="scroll-area" style={{ flex: 1, padding: '12px 16px 16px' }}>
      {/* Profile tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: -2 }}>
        {PROFILES.map((p) => (
          <button
            key={p.id}
            className={`profile-tab ${activeProfile === p.id ? 'active' : ''}`}
            onClick={() => setActiveProfile(p.id)}
          >
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      <div className="gold-card" style={{ padding: 16, borderTopLeftRadius: activeProfile === 'mateus' ? 0 : 12 }}>
        {/* Summary */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 140, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '8px 12px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--neon-green)', marginBottom: 4 }}>✅ Gosta</p>
            <p className="font-righteous" style={{ fontSize: '1.6rem', color: 'var(--neon-green)' }}>
              {profile.likes.length}
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 140, background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: 8, padding: '8px 12px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--neon-pink)', marginBottom: 4 }}>❌ Não gosta</p>
            <p className="font-righteous" style={{ fontSize: '1.6rem', color: 'var(--neon-pink)' }}>
              {profile.dislikes.length}
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 12 }}>
          Clique nos ingredientes: <span style={{ color: 'var(--neon-green)' }}>verde = gosta</span> · <span style={{ color: 'var(--neon-pink)' }}>rosa = não gosta</span>
        </p>

        {/* Ingredients by category */}
        {CATEGORIES.map((cat) => {
          const items = INGREDIENTS.filter((i) => i.category === cat);
          return (
            <div key={cat} style={{ marginBottom: 16 }}>
              <p className="cat-header">{INGREDIENT_CATEGORY_LABELS[cat]}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {items.map((ing) => {
                  const isLiked = profile.likes.includes(ing.id);
                  const isDisliked = profile.dislikes.includes(ing.id);

                  return (
                    <div key={ing.id} style={{ display: 'flex', gap: 3 }}>
                      <button
                        className={`chip chip-likes ${isLiked ? 'active' : ''}`}
                        onClick={() => toggle('likes', ing.id)}
                        title="Marcar como gosta"
                      >
                        {ing.emoji} {isLiked ? '✓' : '+'} {ing.name}
                      </button>
                      {isLiked && (
                        <button
                          className={`chip chip-dislikes`}
                          onClick={() => toggle('dislikes', ing.id)}
                          title="Marcar como não gosta"
                          style={{ padding: '5px 8px' }}
                        >
                          ✕
                        </button>
                      )}
                      {!isLiked && (
                        <button
                          className={`chip chip-dislikes ${isDisliked ? 'active' : ''}`}
                          onClick={() => toggle('dislikes', ing.id)}
                          title="Marcar como não gosta"
                          style={{ padding: '5px 8px' }}
                        >
                          {isDisliked ? '✕' : '–'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Save */}
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <button className={saved ? 'btn-success' : 'btn-gold'} onClick={handleSave} disabled={saving}>
            {saving ? '⏳ Salvando…' : saved ? '✅ Salvo!' : '💾 Salvar Preferências'}
          </button>
        </div>
      </div>
    </div>
  );
}
