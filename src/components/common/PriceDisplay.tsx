import { formatPrice } from '../../utils/formatPrice';
export function PriceDisplay({
  price,
  compareAtPrice,
  large = false,
}: {
  price: number;
  compareAtPrice?: number;
  large?: boolean;
}) {
  return (
    <div className={`price ${large ? 'price-large' : ''}`}>
      <span>
        {formatPrice(price)} <span className="currency">تومان</span>
      </span>
      {compareAtPrice && <del aria-label="قیمت قبلی">{formatPrice(compareAtPrice)}</del>}
    </div>
  );
}
