import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Heart, Star, ShoppingBag, Truck, RefreshCcw, Ruler, Check } from 'lucide-react';
import { products, categoryNames } from '../data/products';
import type { Product, ProductColor } from '../types/product';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGallery } from '../components/products/ProductGallery';
import { SizeSelector, ColorSelector } from '../components/products/Selectors';
import { QuantityStepper } from '../components/cart/QuantityStepper';
import { PriceDisplay } from '../components/common/PriceDisplay';
import { Badge } from '../components/common/Badge';
import { Accordion } from '../components/common/Accordion';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { ProductGrid } from '../components/products/ProductGrid';
import { useCart } from '../hooks/useCart';
import { formatNumber } from '../utils/formatPrice';
export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  return product ? (
    <ProductDetail key={product.id} product={product} />
  ) : (
    <EmptyState
      title="این محصول پیدا نشد"
      description="شاید آدرس تغییر کرده باشد. انتخاب‌های دیگر ما را ببینید."
    >
      <Link to="/products" className="button button-primary">
        بازگشت به فروشگاه
      </Link>
    </EmptyState>
  );
}
function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState('');
  const [color, setColor] = useState<ProductColor>();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, favorites, toggleFavorite, setOpen } = useCart();
  const favorite = favorites.includes(product.id);
  const galleryColor = product.imagesByColor ? color ?? product.colors[0] : undefined;
  const galleryImages =
    (galleryColor && product.imagesByColor?.[galleryColor.value]) ?? product.images;
  const galleryTitle = galleryColor
    ? `${product.title}؛ رنگ ${galleryColor.name}`
    : product.title;
  function add() {
    if (!size || !color) {
      setError('لطفاً سایز و رنگ دلخواه خود را انتخاب کنید.');
      return;
    }
    if (addItem(product, size, color, quantity)) {
      setError('');
      setAdded(true);
    }
  }
  return (
    <div className="container detail-page">
      <Breadcrumbs
        items={[
          { label: 'فروشگاه', to: '/products' },
          { label: categoryNames[product.category], to: `/products?category=${product.category}` },
          { label: product.title },
        ]}
      />
      <div className="detail-layout">
        <ProductGallery key={galleryImages[0]} images={galleryImages} title={galleryTitle} />
        <div className="product-details">
          <div className="detail-kicker">
            <span>{categoryNames[product.category]} / مجموعه رَوا</span>
            {product.isNew && <Badge>تازه رسیده</Badge>}
          </div>
          <h1>{product.title}</h1>
          <div className="rating">
            <Star size={15} fill="currentColor" />
            <span>{formatNumber(product.rating)}</span>
            <span className="muted">از {formatNumber(product.reviewCount)} دیدگاه</span>
          </div>
          <div className="detail-price">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} large />
            {product.compareAtPrice && (
              <Badge sale>
                {formatNumber(Math.round((1 - product.price / product.compareAtPrice) * 100))}٪
                تخفیف
              </Badge>
            )}
          </div>
          <p className="product-description">{product.description}</p>
          <div className={`availability ${!product.isAvailable ? 'unavailable' : ''}`}>
            <span />
            {product.isAvailable ? 'موجود و آماده ارسال' : 'در حال حاضر ناموجود'}
          </div>
          <div className="size-heading">
            <span>یک انتخاب، درست برای شما</span>
            <button onClick={() => setGuide(true)}>
              <Ruler size={16} />
              راهنمای سایز
            </button>
          </div>
          <SizeSelector
            sizes={product.sizes}
            value={size}
            onChange={(value) => {
              setSize(value);
              setAdded(false);
            }}
          />
          <ColorSelector
            colors={product.colors}
            value={color}
            onChange={(value) => {
              setColor(value);
              setAdded(false);
            }}
          />
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="detail-add-row">
            <QuantityStepper
              value={quantity}
              onChange={(value) => {
                setQuantity(value);
                setAdded(false);
              }}
            />
            <button className="button button-primary" disabled={!product.isAvailable} onClick={add}>
              <ShoppingBag size={18} />
              {product.isAvailable ? 'افزودن به سبد خرید' : 'ناموجود'}
            </button>
            <button
              className={`detail-favorite icon-button ${favorite ? 'is-favorite' : ''}`}
              aria-label={favorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              aria-pressed={favorite}
              onClick={() => toggleFavorite(product.id)}
            >
              <Heart size={21} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          {added && (
            <div className="added-feedback" role="status">
              <Check size={17} />
              به سبد خرید اضافه شد.<button onClick={() => setOpen(true)}>مشاهده سبد خرید</button>
            </div>
          )}
          <div className="detail-services">
            <span>
              <Truck size={18} />
              ارسال رایگان بالای ۳ میلیون تومان
            </span>
            <span>
              <RefreshCcw size={17} />۷ روز امکان تعویض
            </span>
          </div>
          <Accordion title="جزئیات و نگهداری">
            <p>{product.description}</p>
            <p>
              برای حفظ کیفیت، مطابق برچسب داخل محصول نگهداری کنید. پوشاک را با آب سرد و شوینده ملایم
              بشویید و از خشک‌کن استفاده نکنید. محصولات چرمی را با دستمال نرم تمیز کنید.
            </p>
          </Accordion>
          <Accordion title="ارسال و تعویض">
            <p>
              ارسال عادی در ۳ تا ۵ روز کاری و ارسال سریع در ۱ تا ۲ روز کاری انجام می‌شود. کالای
              استفاده‌نشده با برچسب اصلی تا ۷ روز قابل تعویض است. این فروشگاه نمایشی است و ارسال
              واقعی ندارد.
            </p>
          </Accordion>
        </div>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">کنار هم، زیباتر</span>
            <h2>شاید این‌ها را هم دوست داشته باشید</h2>
          </div>
        </div>
        <ProductGrid products={products.filter((p) => p.id !== product.id).slice(0, 4)} />
      </section>
      <Modal open={guide} onClose={() => setGuide(false)} title="راهنمای انتخاب سایز">
        {product.category === 'accessories' ? (
          <p className="info-copy">
            این محصول تک‌سایز است. برای اطلاعات بیشتر، توضیحات محصول را مطالعه کنید.
          </p>
        ) : product.category === 'shoes' ? (
          <>
            <p className="info-copy">طول پای خود را از پاشنه تا بلندترین انگشت اندازه بگیرید.</p>
            <table className="size-table">
              <thead>
                <tr>
                  <th>سایز</th>
                  <th>طول پا (سانتی‌متر)</th>
                </tr>
              </thead>
              <tbody>
                {['37', '38', '39', '40', '41', '42', '43'].map((s, i) => (
                  <tr key={s}>
                    <td>{formatNumber(Number(s))}</td>
                    <td>{formatNumber(23.5 + i * 0.5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <p className="info-copy">
              اندازه‌ها بر حسب سانتی‌متر و تقریبی هستند. برای فرم آزادتر، یک سایز بزرگ‌تر انتخاب
              کنید.
            </p>
            <table className="size-table">
              <thead>
                <tr>
                  <th>سایز</th>
                  <th>دور سینه</th>
                  <th>دور کمر</th>
                </tr>
              </thead>
              <tbody>
                {['XS', 'S', 'M', 'L', 'XL'].map((s, i) => (
                  <tr key={s}>
                    <td>{s}</td>
                    <td>{formatNumber(84 + i * 6)}</td>
                    <td>{formatNumber(66 + i * 6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Modal>
    </div>
  );
}
