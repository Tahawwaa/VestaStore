import { Minus, Plus } from 'lucide-react';
import { formatNumber } from '../../utils/formatPrice';
import { MAX_QUANTITY } from '../../utils/cart';
export function QuantityStepper({
  value,
  onChange,
  label = 'تعداد',
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}) {
  return (
    <div className="quantity-stepper" role="group" aria-label={label}>
      <button
        aria-label={`افزایش ${label}`}
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        <Plus size={15} />
      </button>
      <span aria-live="polite">{formatNumber(value)}</span>
      <button
        aria-label={`کاهش ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        type="button"
      >
        <Minus size={15} />
      </button>
    </div>
  );
}
