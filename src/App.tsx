import { BrowserRouter } from 'react-router';
import { MotionConfig } from 'framer-motion';
import { CartProvider } from './providers/CartProvider';
import { AppRoutes } from './routes/AppRoutes';
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
