import { useRef, useState, useCallback } from 'react';
import SpinWheel, { type SpinWheelRef, type WheelItem } from '../components/roulette/SpinWheel';
import ResultModal from '../components/roulette/ResultModal';
import EntryForm from '../components/roulette/EntryForm';
import { useStore } from '../store/useStore';
import { FOOD_CATEGORIES } from '../data/foods';
import { saveWeights, addHistoryEntry } from '../firebase/db';
import type { FoodCategory, Flavor, ProfileName, HistoryEntry } from '../types';

type RangeSliderProps = {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: [number, number];
  onChange: (v: [number, number]) => void;
};

function RangeSlider({ label, leftLabel, rightLabel, value, onChange }: RangeSliderProps) {
  const [min, max] = value;
  const pctMin = ((min - 1) / 4) * 100;
  const pctMax = ((max - 1) / 4) * 100;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ color: 'var(--gold)', fontSize: '0.85rem', fontFamily: 'Righteous, sans-serif' }}>{label}</span>
        <span style={{ color: 'var(--neon-blue)', fontSize: '0.8rem', fontFamily: 'VT323, monospace' }}>
          {min} – {max}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', minWidth: 36 }}>{leftLabel}</span>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="range" min={1} max={5} step={1} value={min}
            style={{ '--pct': `${pctMin}%` } as React.CSSProperties}
            onChange={(e) => { const v = +e.target.value; onChange([Math.min(v, max), max]); }}
          />
          <input
            type="range" min={1} max={5} step={1} value={max}
            style={{ '--pct': `${pctMax}%`, marginTop: 4 } as React.CSSProperties}
            onChange={(e) => { const v = +e.target.value; onChange([min, Math.max(v, min)]); }}
          />
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', minWidth: 36, textAlign: 'right' }}>{rightLabel}</span>
      </div>
    </div>
  );
}

export default function RoulettePage() {
  const {
    participants, setParticipants,
    priceRange, setPriceRange,
    healthRange, setHealthRange,
    profiles,
    categoryWeights, flavorWeights,
    decreaseCategoryWeight, decreaseFlavorWeight,
    resetWeights,
    addLocalHistory,
  } = useStore();

  const catWheelRef = useRef<SpinWheelRef>(null);
  const flavWheelRef = useRef<SpinWheelRef>(null);

  const [stage, setStage] = useState<'idle' | 'cat-spinning' | 'cat-result' | 'flav-spinning' | 'flav-result' | 'entry'>('idle');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showFlav, setShowFlav] = useState(false);

  // ── Filtering ─────────────────────────────────────────────────────────────

  const combinedDislikes = useCallback(() => {
    const set = new Set<string>();
    participants.forEach((p) => profiles[p].dislikes.forEach((id) => set.add(id)));
    return set;
  }, [participants, profiles]);

  const eligibleCategories = useCallback((): FoodCategory[] => {
    const dislikes = combinedDislikes();
    return FOOD_CATEGORIES.filter((cat) => {
      if (cat.priceLevel < priceRange[0] || cat.priceLevel > priceRange[1]) return false;
      if (cat.healthLevel < healthRange[0] || cat.healthLevel > healthRange[1]) return false;
      if (cat.relatedIngredients.some((id) => dislikes.has(id))) return false;
      return true;
    });
  }, [combinedDislikes, priceRange, healthRange]);

  const catWheelItems = useCallback((): WheelItem[] => {
    return eligibleCategories().map((cat) => ({
      id: cat.id,
      name: cat.name,
      emoji: cat.emoji,
      weight: categoryWeights[cat.id] ?? 1,
    }));
  }, [eligibleCategories, categoryWeights]);

  const eligibleFlavors = useCallback((cat: FoodCategory): Flavor[] => {
    const dislikes = combinedDislikes();
    return cat.flavors.filter((f) => !f.ingredients.some((id) => dislikes.has(id)));
  }, [combinedDislikes]);

  const flavWheelItems = useCallback((cat: FoodCategory): WheelItem[] => {
    return eligibleFlavors(cat).map((f) => ({
      id: f.id,
      name: f.name,
      emoji: f.emoji,
      weight: flavorWeights[cat.id]?.[f.id] ?? 1,
    }));
  }, [eligibleFlavors, flavorWeights]);

  // ── Weighted random selection ──────────────────────────────────────────────

  const pickWinner = (items: WheelItem[]): WheelItem => {
    const total = items.reduce((s, i) => s + i.weight, 0);
    let r = Math.random() * total;
    for (const item of items) { r -= item.weight; if (r <= 0) return item; }
    return items[items.length - 1];
  };

  // ── Spin category ──────────────────────────────────────────────────────────

  const spinCategory = () => {
    const items = catWheelItems();
    if (items.length === 0) return;
    setStage('cat-spinning');
    setSpinning(true);
    const winner = pickWinner(items);
    setTimeout(() => catWheelRef.current?.spin(winner.id), 50);
  };

  const onCategoryResult = (item: WheelItem) => {
    setSpinning(false);
    const cat = FOOD_CATEGORIES.find((c) => c.id === item.id)!;
    setSelectedCategory(cat);
    setStage('cat-result');
  };

  // ── Spin flavor ────────────────────────────────────────────────────────────

  const spinFlavor = () => {
    if (!selectedCategory) return;
    const items = flavWheelItems(selectedCategory);
    if (items.length === 0) return;
    setStage('flav-spinning');
    setShowFlav(true);
    setSpinning(true);
    const winner = pickWinner(items);
    setTimeout(() => flavWheelRef.current?.spin(winner.id), 50);
  };

  const onFlavorResult = (item: WheelItem) => {
    setSpinning(false);
    const flavor = selectedCategory!.flavors.find((f) => f.id === item.id)!;
    setSelectedFlavor(flavor);
    setStage('flav-result');
  };

  // ── Accept / Reject ────────────────────────────────────────────────────────

  const acceptCategory = () => {
    if (!selectedCategory) return;
    decreaseCategoryWeight(selectedCategory.id);
    saveWeights(
      { ...categoryWeights, [selectedCategory.id]: Math.max(0.05, (categoryWeights[selectedCategory.id] ?? 1) * 0.5) },
      flavorWeights
    ).catch(() => {});
    spinFlavor();
  };

  const rejectCategory = () => {
    setStage('idle');
    setSelectedCategory(null);
  };

  const acceptFlavor = () => {
    if (!selectedCategory || !selectedFlavor) return;
    decreaseFlavorWeight(selectedCategory.id, selectedFlavor.id);
    saveWeights(categoryWeights, {
      ...flavorWeights,
      [selectedCategory.id]: {
        ...flavorWeights[selectedCategory.id],
        [selectedFlavor.id]: Math.max(0.05, (flavorWeights[selectedCategory.id]?.[selectedFlavor.id] ?? 1) * 0.5),
      },
    }).catch(() => {});
    setStage('entry');
  };

  const rejectFlavor = () => {
    setShowFlav(false);
    setStage('idle');
    setSelectedFlavor(null);
  };

  const handleSaveEntry = async (entry: Omit<HistoryEntry, 'id'>) => {
    try {
      const id = await addHistoryEntry(entry);
      addLocalHistory({ ...entry, id });
    } catch {
      const id = crypto.randomUUID();
      addLocalHistory({ ...entry, id });
    }
    setStage('idle');
    setSelectedCategory(null);
    setSelectedFlavor(null);
    setShowFlav(false);
  };

  const handleReset = () => {
    resetWeights();
    saveWeights(
      Object.fromEntries(Object.keys(categoryWeights).map((k) => [k, 1])),
      Object.fromEntries(Object.entries(flavorWeights).map(([k, v]) => [k, Object.fromEntries(Object.keys(v).map((f) => [f, 1]))]))
    ).catch(() => {});
  };

  // ── Participant toggle ──────────────────────────────────────────────────────

  const toggleParticipant = (p: ProfileName) => {
    if (participants.includes(p)) {
      if (participants.length === 1) return;
      setParticipants(participants.filter((x) => x !== p));
    } else {
      setParticipants([...participants, p]);
    }
  };

  const catItems = catWheelItems();
  const flavItems = selectedCategory ? flavWheelItems(selectedCategory) : [];

  // Wheel to show: after cat accepted, show flavor wheel
  const showCatWheel = !showFlav;

  return (
    <div
      className="scroll-area"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px 16px', gap: 12, overflowY: 'auto' }}
    >
      {/* Participant selector */}
      <div className="gold-card" style={{ padding: '10px 14px' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--gold-dark)', marginBottom: 6, fontFamily: 'Righteous, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Participantes
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['matheus', 'amanda'] as ProfileName[]).map((p) => (
            <button
              key={p}
              className={`participant-btn ${participants.includes(p) ? 'active' : ''}`}
              onClick={() => toggleParticipant(p)}
            >
              {p === 'matheus' ? '👨 Matheus' : '👩 Amanda'}
            </button>
          ))}
          <button
            className={`participant-btn ${participants.length === 2 ? 'active' : ''}`}
            onClick={() => setParticipants(['matheus', 'amanda'])}
          >
            👫 Ambos
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="gold-card" style={{ padding: '10px 14px' }}>
        <RangeSlider
          label="💰 Preço"
          leftLabel="Barato"
          rightLabel="Caro"
          value={priceRange}
          onChange={setPriceRange}
        />
        <RangeSlider
          label="🥗 Saúde"
          leftLabel="Pesado"
          rightLabel="Saudável"
          value={healthRange}
          onChange={setHealthRange}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
          {catItems.length} opções disponíveis
        </p>
      </div>

      {/* Wheel */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: '0.7rem', fontFamily: 'VT323, monospace', color: 'var(--neon-blue)', letterSpacing: '0.2em' }}>
          {showCatWheel ? '▼ ETAPA 1: CATEGORIA ▼' : '▼ ETAPA 2: SABOR ▼'}
        </div>

        {/* Stage label above wheel */}
        {selectedCategory && showFlav && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.3rem' }}>{selectedCategory.emoji}</span>
            <span className="gold-text font-display" style={{ fontSize: '1.1rem', marginLeft: 6 }}>
              {selectedCategory.name}
            </span>
          </div>
        )}

        <div
          className="scanlines"
          style={{
            borderRadius: '50%',
            border: '4px solid var(--gold-dark)',
            boxShadow: '0 0 30px rgba(255,215,0,0.2)',
            overflow: 'visible',
            position: 'relative',
          }}
        >
          {showCatWheel ? (
            <SpinWheel
              ref={catWheelRef}
              items={catItems}
              onResult={onCategoryResult}
              size={Math.min(window.innerWidth - 64, 320)}
            />
          ) : (
            <SpinWheel
              ref={flavWheelRef}
              items={flavItems}
              onResult={onFlavorResult}
              size={Math.min(window.innerWidth - 64, 320)}
            />
          )}
        </div>

        {catItems.length === 0 && (
          <p style={{ color: 'var(--neon-pink)', fontFamily: 'Righteous, sans-serif', textAlign: 'center', fontSize: '0.9rem' }}>
            Nenhuma opção com esses filtros! Ajuste os sliders.
          </p>
        )}
      </div>

      {/* Spin button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button
          className="btn-spin"
          disabled={spinning || catItems.length === 0}
          onClick={stage === 'idle' || stage === 'cat-result' ? spinCategory : spinFlavor}
        >
          {spinning ? '⏳ Girando…' : '🎰 GIRAR!'}
        </button>

        <button className="btn-outline" onClick={handleReset} style={{ fontSize: '0.85rem', padding: '6px 18px' }}>
          🔄 Resetar Probabilidades
        </button>
      </div>

      {/* Category result modal */}
      {stage === 'cat-result' && selectedCategory && (
        <ResultModal
          stage={1}
          emoji={selectedCategory.emoji}
          title={selectedCategory.name}
          onAccept={acceptCategory}
          onReject={rejectCategory}
        />
      )}

      {/* Flavor result modal */}
      {stage === 'flav-result' && selectedCategory && selectedFlavor && (
        <ResultModal
          stage={2}
          emoji={selectedFlavor.emoji}
          title={selectedFlavor.name}
          subtitle={`Sabor de ${selectedCategory.name}`}
          onAccept={acceptFlavor}
          onReject={rejectFlavor}
        />
      )}

      {/* Entry form */}
      {stage === 'entry' && selectedCategory && selectedFlavor && (
        <EntryForm
          category={selectedCategory}
          flavor={selectedFlavor}
          participants={participants}
          onSave={handleSaveEntry}
          onCancel={() => { setStage('idle'); setSelectedCategory(null); setSelectedFlavor(null); setShowFlav(false); }}
        />
      )}
    </div>
  );
}
