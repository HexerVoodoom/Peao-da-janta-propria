import { useState } from 'react';
import RatingStars from '../common/RatingStars';
import type { FoodCategory, Flavor, ProfileName, HistoryEntry } from '../../types';

interface Props {
  category: FoodCategory;
  flavor: Flavor;
  participants: ProfileName[];
  onSave: (entry: Omit<HistoryEntry, 'id'>) => void;
  onCancel: () => void;
}

export default function EntryForm({ category, flavor, participants, onSave, onCancel }: Props) {
  const [restaurant, setRestaurant] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: new Date().toISOString(),
      participants,
      category: category.name,
      categoryEmoji: category.emoji,
      flavor: flavor.name,
      flavorEmoji: flavor.emoji,
      restaurant: restaurant.trim() || 'Não informado',
      price: parseFloat(price) || 0,
      rating,
    });
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        className="gold-card reveal"
        style={{ width: '100%', maxWidth: 420, padding: 24 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>
            {category.emoji} → {flavor.emoji}
          </div>
          <p className="font-display gold-text" style={{ fontSize: '1.3rem', marginTop: 6 }}>
            {category.name} · {flavor.name}
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: 4 }}>
            Registre o pedido!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', color: 'var(--gold)', fontSize: '0.9rem', marginBottom: 4 }}>
              📍 Onde pediu?
            </label>
            <input
              className="game-input"
              type="text"
              placeholder="Nome do restaurante…"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              maxLength={80}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--gold)', fontSize: '0.9rem', marginBottom: 4 }}>
              💰 Valor (R$)
            </label>
            <input
              className="game-input"
              type="number"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--gold)', fontSize: '0.9rem', marginBottom: 8 }}>
              ⭐ Avaliação
            </label>
            <RatingStars value={rating} onChange={setRating} size="2rem" />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-success" style={{ flex: 2 }} disabled={rating === 0}>
              💾 Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
