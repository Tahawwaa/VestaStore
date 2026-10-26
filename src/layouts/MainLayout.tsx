import { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Toast } from '../components/common/Toast';
export function MainLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title =
      pathname === '/checkout'
        ? 'ثبت سفارش | رَوا'
        : pathname.startsWith('/products')
          ? 'فروشگاه | رَوا'
          : 'رَوا | سادگی، امضای توست';
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        رفتن به محتوای اصلی
      </a>
      <Navbar />
      <motion.main
        id="main"
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Suspense fallback={<LoadingSkeleton />}>
          <Outlet />
        </Suspense>
      </motion.main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
