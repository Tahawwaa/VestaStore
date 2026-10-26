import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  ArrowUpLeft,
  Truck,
  ShieldCheck,
  RefreshCcw,
  CreditCard,
  Check,
} from 'lucide-react';
import { Hero } from '../components/layout/Hero';
import { ProductGrid } from '../components/products/ProductGrid';
import { CategoryCard } from '../components/products/CategoryCard';
import { products } from '../data/products';
import type { ProductCategory } from '../types/product';
const tabs: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'همه محصولات', value: 'all' },
  { label: 'زنانه', value: 'women' },
  { label: 'مردانه', value: 'men' },
  { label: 'اکسسوری', value: 'accessories' },
  { label: 'کفش', value: 'shoes' },
];
const services = [
  { icon: Truck, title: 'ارسال سریع', copy: 'تا درِ خانه، با خیال راحت' },
  { icon: ShieldCheck, title: 'کیفیتی که می‌ماند', copy: 'انتخاب دقیق پارچه و دوخت' },
  { icon: RefreshCcw, title: '۷ روز امکان تعویض', copy: 'برای انتخابی مطمئن‌تر' },
  { icon: CreditCard, title: 'پرداخت امن', copy: 'خریدی آسوده، در هر قدم' },
];
export default function HomePage() {
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [subscribed, setSubscribed] = useState(false);
  const shown =
    category === 'all'
      ? products.filter((p) => p.isNew).slice(0, 4)
      : products.filter((p) => p.category === category);
  return (
    <>
      <Hero />
      <div className="brand-strip">
        <span>طراحی برای زندگی، نه فقط یک فصل</span>
        <span className="strip-star">✳</span>
        <span>پارچه‌های منتخب</span>
        <span className="strip-star">✳</span>
        <span>جزئیات سنجیده</span>
        <span className="strip-star">✳</span>
        <span>زیباییِ بی‌تکلف</span>
        <span className="strip-star">✳</span>
        <span>سبکی برای خودِ تو</span>
      </div>
      <section className="container section arrivals">
        <div className="section-heading">
          <div>
            <span className="section-kicker">تازه رسیده‌اند</span>
            <h2>فصل تازه، انتخاب‌های تازه</h2>
          </div>
          <Link to="/products?new=true" className="text-link">
            مشاهده همه محصولات <ArrowLeft size={17} />
          </Link>
        </div>
        <div className="product-tabs" role="group" aria-label="دسته‌بندی محصولات تازه">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              aria-pressed={category === tab.value}
              className={category === tab.value ? 'active' : ''}
              onClick={() => setCategory(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ProductGrid products={shown} />
      </section>
      <section className="container section categories-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">جهانِ رَوا</span>
            <h2>سبک خودت را پیدا کن</h2>
          </div>
          <p className="section-description">انتخاب‌هایی فکرشده، برای هر روزِ تو.</p>
        </div>
        <div className="category-grid">
          <CategoryCard
            title="زنانه"
            subtitle="رها، ساده، به سبک تو"
            image="/images/hero.jpg"
            to="/products?category=women"
          />
          <CategoryCard
            title="مردانه"
            subtitle="تعریف تازه‌ای از اصالت"
            image="/images/category-men.jpg"
            to="/products?category=men"
          />
          <CategoryCard
            title="جزئیاتِ کامل‌کننده"
            subtitle="اکسسوری‌های دوست‌داشتنی"
            image="/images/bag.jpg"
            to="/products?category=accessories"
          />
        </div>
        <div className="category-links">
          <Link to="/products?category=shoes">
            قدم‌های تازه، کفش‌های تازه <ArrowUpLeft size={17} />
          </Link>
          <Link to="/products?new=true">
            لباس‌های جدید این فصل <ArrowUpLeft size={17} />
          </Link>
        </div>
      </section>
      <section className="editorial-banner">
        <div className="editorial-image">
          <img
            src="/images/category-men.jpg"
            alt="استایل روزمره با رنگ‌های طبیعی و لباس‌های ماندگار"
            width={1600}
            height={1100}
            loading="lazy"
          />
          <span>داستانِ یک انتخاب خوب</span>
        </div>
        <div className="editorial-copy">
          <span className="section-kicker">به وقتِ آرام‌تر زندگی کردن</span>
          <h2>
            ترندها می‌آیند و می‌روند.
            <br />
            سبک تو می‌ماند.
          </h2>
          <p>
            ما به کمدی کوچک‌تر و انتخاب‌هایی بهتر باور داریم.
            <br />
            لباس‌هایی که امروز دوستشان داری،
            <br />و فردا هم سراغشان می‌روی.
          </p>
          <Link to="/products?sale=true" className="text-link">
            انتخاب‌های ویژه این فصل <ArrowLeft size={18} />
          </Link>
          <span className="editorial-watermark" aria-hidden="true">
            رَوا
          </span>
        </div>
      </section>
      <section className="container section bestsellers">
        <div className="section-heading">
          <div>
            <span className="section-kicker">محبوبِ شما</span>
            <h2>انتخاب‌هایی که دوست داشته‌اید</h2>
          </div>
          <Link to="/products?sort=best" className="text-link">
            همه پرفروش‌ها <ArrowLeft size={17} />
          </Link>
        </div>
        <ProductGrid products={products.filter((p) => p.isBestSeller).slice(0, 4)} />
      </section>
      <section className="services container" aria-label="مزایای خرید">
        {services.map((service) => (
          <div key={service.title}>
            <service.icon size={29} strokeWidth={1.2} />
            <h3>{service.title}</h3>
            <p>{service.copy}</p>
          </div>
        ))}
      </section>
      <section className="newsletter">
        <div className="container newsletter-inner">
          <div>
            <span className="section-kicker">کمی نزدیک‌تر به رَوا</span>
            <h2>از تازه‌ها، زودتر باخبر شو.</h2>
            <p>مجموعه‌های جدید، پیشنهادهای ویژه و کمی الهام برای روزمره.</p>
          </div>
          {subscribed ? (
            <div className="newsletter-success" role="status">
              <Check size={25} />
              <div>
                خوش آمدی به دنیای رَوا.<small>عضویت نمایشی شما ثبت شد؛ ایمیلی ارسال نمی‌شود.</small>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubscribed(true);
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                آدرس ایمیل
              </label>
              <div className="newsletter-input">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  placeholder="آدرس ایمیل شما"
                  required
                  autoComplete="email"
                />
                <button type="submit" aria-label="عضویت در خبرنامه">
                  عضویت <ArrowLeft size={19} />
                </button>
              </div>
              <span>با عضویت، شرایط حریم خصوصی رَوا را می‌پذیرید.</span>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
