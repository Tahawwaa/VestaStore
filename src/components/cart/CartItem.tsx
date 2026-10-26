import { Link } from 'react-router';
import { Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/cart';
import { useCart } from '../../hooks/useCart';
import { PriceDisplay } from '../common/PriceDisplay';
import { QuantityStepper } from './QuantityStepper';
export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem, setOpen } = useCart();
  return (
    <article className="cart-item">
      <Link to={`/products/${item.product.id}`} onClick={() => setOpen(false)}>
        <img src={item.product.images[0]} alt={item.product.title} width={96} height={128} />
      </Link>
      <div className="cart-item-content">
        <Link to={`/products/${item.product.id}`} onClick={() => setOpen(false)}>
          <h3>{item.product.title}</h3>
        </Link>
        <p>
          سایز {item.selectedSize} <span> / </span> {item.selectedColor.name}
        </p>
        <PriceDisplay price={item.product.price} />
        <div className="cart-item-actions">
          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) => updateQuantity(item.key, quantity)}
            label={item.product.title}
          />
          <button
            className="icon-button"
            aria-label={`حذف ${item.product.title}`}
            onClick={() => removeItem(item.key)}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
