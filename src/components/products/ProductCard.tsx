import { Link } from 'react-router';
import { Heart, ArrowUpLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../../types/product';
import { useCart } from '../../hooks/useCart';
import { Badge } from '../common/Badge';
import { PriceDisplay } from '../common/PriceDisplay';
import { categoryNames } from '../../data/products';
export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite } = useCart();
  const favorite = favorites.includes(product.id);
  return (
    <motion.article
      layout
      className="product-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="product-image-wrap">
        <Link
          to={`/products/${product.id}`}
          className="product-image-link"
          aria-label={`مشاهده ${product.title}`}
        >
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            width="600"
            height="800"
          />
          <span className="product-quick-view">
            مشاهده جزئیات <ArrowUpLeft size={17} />
          </span>
        </Link>
        <div className="product-badges">
          {!product.isAvailable ? (
            <Badge>ناموجود</Badge>
          ) : product.isNew ? (
            <Badge>جدید</Badge>
          ) : product.compareAtPrice ? (
            <Badge sale>قیمت ویژه</Badge>
          ) : null}
        </div>
        <button
          className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={favorite}
          aria-label={`${favorite ? 'حذف از' : 'افزودن به'} علاقه‌مندی‌ها: ${product.title}`}
          title="علاقه‌مندی‌ها"
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      </div>
      <div className="product-meta">
        <span>{categoryNames[product.category]}</span>
        <div className="mini-swatches">
          {product.colors.map((color) => (
            <span key={color.value} style={{ backgroundColor: color.hex }} title={color.name} />
          ))}
        </div>
      </div>
      <h3>
        <Link to={`/products/${product.id}`}>{product.title}</Link>
      </h3>
      <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
    </motion.article>
  );
}
