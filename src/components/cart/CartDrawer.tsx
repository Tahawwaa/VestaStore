import { Link } from 'react-router';
import { ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { CartItem } from './CartItem';
import { formatPrice, formatNumber } from '../../utils/formatPrice';
import { shippingCost } from '../../utils/cart';
export function CartDrawer() {
  const { isOpen, setOpen, items, count, subtotal } = useCart();
  const shipping = shippingCost(subtotal);
  return (
    <Modal
      open={isOpen}
      onClose={() => setOpen(false)}
      title={`سبد خرید شما (${formatNumber(count)})`}
      drawer
      className="cart-drawer"
    >
      {items.length ? (
        <>
          <div className="shipping-notice">
            <Truck size={18} />
            {subtotal >= 3000000
              ? 'ارسال سفارش شما رایگان است.'
              : `تا ارسال رایگان ${formatPrice(3000000 - subtotal)} تومان باقی مانده`}
          </div>
          <div className="cart-items">
            {items.map((item) => (
              <CartItem item={item} key={item.key} />
            ))}
          </div>
          <div className="cart-summary">
            <div>
              <span>جمع محصولات</span>
              <span>{formatPrice(subtotal)} تومان</span>
            </div>
            <div>
              <span>هزینه ارسال عادی</span>
              <span>{shipping ? `${formatPrice(shipping)} تومان` : 'رایگان'}</span>
            </div>
            <div className="summary-total">
              <strong>مبلغ قابل پرداخت</strong>
              <strong>{formatPrice(subtotal + shipping)} تومان</strong>
            </div>
            <Link
              className="button button-primary w-full"
              to="/checkout"
              onClick={() => setOpen(false)}
            >
              ادامه و ثبت سفارش <ArrowLeft size={18} />
            </Link>
            <button className="button button-text w-full" onClick={() => setOpen(false)}>
              ادامه خرید
            </button>
          </div>
        </>
      ) : (
        <EmptyState
          title="سبد خریدتان خالی است"
          description="انتخاب‌های تازه‌ای برای شما آماده کرده‌ایم."
        >
          <Link to="/products" className="button button-primary" onClick={() => setOpen(false)}>
            کشف محصولات <ArrowLeft size={17} />
          </Link>
        </EmptyState>
      )}
    </Modal>
  );
}
