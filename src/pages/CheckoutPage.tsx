import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Check, LockKeyhole, Truck } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { formatPrice, formatNumber } from '../utils/formatPrice';
import { shippingCost } from '../utils/cart';
import { validateCustomer } from '../utils/checkout';
import type { CustomerInfo } from '../utils/checkout';
const fields: {
  key: keyof CustomerInfo;
  label: string;
  placeholder: string;
  autoComplete: string;
  inputMode?: 'tel' | 'numeric';
}[] = [
  {
    key: 'name',
    label: 'نام و نام خانوادگی',
    placeholder: 'نام گیرنده سفارش',
    autoComplete: 'name',
  },
  {
    key: 'phone',
    label: 'شماره همراه',
    placeholder: '۰۹۱۲۳۴۵۶۷۸۹',
    autoComplete: 'tel',
    inputMode: 'tel',
  },
  { key: 'city', label: 'شهر', placeholder: 'شهر محل تحویل', autoComplete: 'address-level2' },
  {
    key: 'postalCode',
    label: 'کد پستی',
    placeholder: 'کد پستی ۱۰ رقمی',
    autoComplete: 'postal-code',
    inputMode: 'numeric',
  },
];
export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [info, setInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    city: '',
    address: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [express, setExpress] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [complete, setComplete] = useState(false);
  const [orderId] = useState(() => formatNumber(Date.now() % 1000000));
  const formRef = useRef<HTMLFormElement>(null);
  const shipping = shippingCost(subtotal, express);
  const reduction = discount ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - reduction + shipping;
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next = validateCustomer(info);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setComplete(true);
    clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (complete)
    return (
      <div className="container checkout-success">
        <span className="success-icon">
          <Check size={35} />
        </span>
        <span className="section-kicker">یک انتخاب خوب</span>
        <h1>سفارش نمایشی شما ثبت شد.</h1>
        <p>{info.name} عزیز، ممنون که رَوا را انتخاب کردید.</p>
        <div>
          شماره سفارش: <strong>{orderId}</strong>
        </div>
        <p className="muted">این خرید آزمایشی است؛ مبلغی دریافت نشده و کالایی ارسال نمی‌شود.</p>
        <Link to="/products" className="button button-primary">
          ادامه گشت‌وگذار <ArrowLeft size={18} />
        </Link>
      </div>
    );
  if (!items.length)
    return (
      <EmptyState
        title="هنوز چیزی انتخاب نکرده‌اید"
        description="برای ثبت سفارش، ابتدا محصولی به سبد خرید اضافه کنید."
      >
        <Link to="/products" className="button button-primary">
          رفتن به فروشگاه
        </Link>
      </EmptyState>
    );
  return (
    <div className="container checkout-page">
      <Breadcrumbs items={[{ label: 'فروشگاه', to: '/products' }, { label: 'ثبت سفارش' }]} />
      <div className="catalog-heading">
        <span className="section-kicker">یک قدم تا انتخاب‌های شما</span>
        <h1>تکمیل سفارش</h1>
        <p>این صفحه پیش‌نمایش است و هیچ پرداختی انجام نمی‌شود.</p>
      </div>
      <div className="checkout-layout">
        <form ref={formRef} onSubmit={submit} noValidate id="checkout-form">
          <section className="checkout-form-section">
            <h2>
              <span>۱</span>اطلاعات گیرنده
            </h2>
            <div className="form-grid">
              {fields.map((field) => (
                <div className="form-field" key={field.key}>
                  <label htmlFor={field.key}>
                    {field.label} <span>*</span>
                  </label>
                  <input
                    id={field.key}
                    name={field.key}
                    value={info[field.key]}
                    onChange={(event) =>
                      setInfo((previous) => ({ ...previous, [field.key]: event.target.value }))
                    }
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    aria-invalid={Boolean(errors[field.key])}
                    aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                    required
                  />
                  {errors[field.key] && (
                    <span id={`${field.key}-error`} className="form-error">
                      {errors[field.key]}
                    </span>
                  )}
                </div>
              ))}
              <div className="form-field full-width">
                <label htmlFor="address">
                  آدرس کامل <span>*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={info.address}
                  onChange={(event) =>
                    setInfo((previous) => ({ ...previous, address: event.target.value }))
                  }
                  placeholder="استان، خیابان، کوچه، پلاک و واحد"
                  autoComplete="street-address"
                  rows={3}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  required
                />
                {errors.address && (
                  <span id="address-error" className="form-error">
                    {errors.address}
                  </span>
                )}
              </div>
            </div>
          </section>
          <section className="checkout-form-section">
            <h2>
              <span>۲</span>روش ارسال
            </h2>
            <label className={`delivery-option ${!express ? 'selected' : ''}`}>
              <input
                type="radio"
                name="delivery"
                checked={!express}
                onChange={() => setExpress(false)}
              />
              <Truck size={23} />
              <span>
                <strong>ارسال عادی</strong>
                <small>۳ تا ۵ روز کاری</small>
              </span>
              <span>
                {shippingCost(subtotal) ? `${formatPrice(shippingCost(subtotal))} تومان` : 'رایگان'}
              </span>
            </label>
            <label className={`delivery-option ${express ? 'selected' : ''}`}>
              <input
                type="radio"
                name="delivery"
                checked={express}
                onChange={() => setExpress(true)}
              />
              <Truck size={23} />
              <span>
                <strong>ارسال سریع</strong>
                <small>۱ تا ۲ روز کاری</small>
              </span>
              <span>{formatPrice(shippingCost(subtotal, true))} تومان</span>
            </label>
          </section>
        </form>
        <aside className="order-summary">
          <h2>خلاصه سفارش</h2>
          {items.map((item) => (
            <div className="order-item" key={item.key}>
              <img src={item.product.images[0]} alt={item.product.title} width={64} height={80} />
              <div>
                <h3>{item.product.title}</h3>
                <p>
                  {item.selectedSize} / {item.selectedColor.name} / {formatNumber(item.quantity)}{' '}
                  عدد
                </p>
                <span>{formatPrice(item.product.price * item.quantity)} تومان</span>
              </div>
            </div>
          ))}
          <div className="discount-code">
            <label htmlFor="discount-code">کد تخفیف دارید؟</label>
            <div>
              <input
                id="discount-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="کد تخفیف"
                disabled={discount}
                dir="auto"
              />
              <button
                onClick={() => {
                  if (code.trim().toUpperCase() === 'RAVA10') {
                    setDiscount(true);
                    setCodeError('');
                  } else setCodeError('کد تخفیف معتبر نیست.');
                }}
                disabled={discount}
              >
                {discount ? 'اعمال شد' : 'اعمال'}
              </button>
            </div>
            {codeError && (
              <p role="alert" className="form-error">
                {codeError}
              </p>
            )}
            <small>
              {discount
                ? '۱۰٪ تخفیف روی محصولات اعمال شد.'
                : 'برای این خرید آزمایشی از کد RAVA10 استفاده کنید.'}
            </small>
          </div>
          <div className="cart-summary">
            <div>
              <span>جمع محصولات</span>
              <span>{formatPrice(subtotal)} تومان</span>
            </div>
            {discount && (
              <div className="discount-line">
                <span>تخفیف</span>
                <span>{formatPrice(reduction)} تومان</span>
              </div>
            )}
            <div>
              <span>ارسال</span>
              <span>{shipping ? `${formatPrice(shipping)} تومان` : 'رایگان'}</span>
            </div>
            <div className="summary-total">
              <strong>مبلغ نهایی</strong>
              <strong>{formatPrice(total)} تومان</strong>
            </div>
            <button className="button button-primary w-full" type="submit" form="checkout-form">
              ثبت سفارش آزمایشی <ArrowLeft size={17} />
            </button>
            <p className="secure-note">
              <LockKeyhole size={14} />
              بدون پرداخت واقعی؛ فقط پیش‌نمایش خرید
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
