import { Link } from 'react-router';
import { ArrowUpLeft } from 'lucide-react';
import { Modal } from '../common/Modal';
export const navigation = [
  { label: 'جدیدترین‌ها', to: '/products?new=true' },
  { label: 'زنانه', to: '/products?category=women' },
  { label: 'مردانه', to: '/products?category=men' },
  { label: 'اکسسوری', to: '/products?category=accessories' },
  { label: 'کفش', to: '/products?category=shoes' },
  { label: 'پرفروش‌ترین‌ها', to: '/products?sort=best' },
  { label: 'فروش ویژه', to: '/products?sale=true' },
];
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="رَوا" drawer>
      <nav className="mobile-navigation">
        {navigation.map((item) => (
          <Link key={item.to} to={item.to} onClick={onClose}>
            {item.label}
            <ArrowUpLeft size={18} />
          </Link>
        ))}
        <Link to="/products?favorites=true" onClick={onClose}>
          علاقه‌مندی‌های من <ArrowUpLeft size={18} />
        </Link>
      </nav>
      <p className="menu-tagline">
        کمتر، اما بهتر.
        <br />
        پوشاکی برای خودِ واقعی تو.
      </p>
    </Modal>
  );
}
