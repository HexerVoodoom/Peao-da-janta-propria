interface Props {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: string;
}

export default function RatingStars({ value, onChange, readonly = false, size = '1.4rem' }: Props) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= value ? 'active' : ''}`}
          style={{ fontSize: size, cursor: readonly ? 'default' : 'pointer' }}
          onClick={() => !readonly && onChange?.(n)}
          disabled={readonly}
        >
          ★
        </button>
      ))}
    </div>
  );
}
