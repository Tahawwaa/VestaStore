import { ArrowLeft, ArrowDownLeft, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
export function Hero() {
  return (
    <section className="hero">
      <div className="hero-photo">
        <img
          src="/images/hero.jpg"
          alt="استایل مینیمال زنانه از مجموعه پاییز روا"
          width={1600}
          height={2000}
          fetchPriority="high"
        />
        <div className="hero-photo-caption">
          <span>زیبایی در جزئیات ساده است.</span>
          <span className="editorial-index">مجموعه ۰۱</span>
        </div>
        <Link to="/products/linen-blazer" className="hero-product-note">
          <span className="hero-plus">
            <Plus size={18} />
          </span>
          <span>
            فراتر از یک فصل<small>کشف انتخاب‌های ماندگار</small>
          </span>
          <ArrowUpLeftSmall />
        </Link>
      </div>
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow">
            <span /> مجموعه پاییز و زمستان ۱۴۰۵
          </div>
          <h1>
            سادگی،
            <br />
            <span>امضای توست.</span>
          </h1>
          <p>
            لباس‌هایی برای خودِ واقعی تو.
            <br />
            طراحی ماندگار، کیفیتی که حس می‌کنی.
          </p>
          <Link to="/products?new=true" className="button button-primary hero-cta">
            کشف مجموعه جدید <ArrowLeft size={19} />
          </Link>
          <div className="hero-footnote">
            <span className="short-rule" />
            کمتر، اما بهتر.
          </div>
        </motion.div>
        <div className="hero-bottom">
          <span>برای روزهایی که خودت هستی</span>
          <ArrowDownLeft size={23} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
}
function ArrowUpLeftSmall() {
  return <ArrowLeft size={17} className="-rotate-45" />;
}
