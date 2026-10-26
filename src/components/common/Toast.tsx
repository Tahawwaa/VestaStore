import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
export function Toast() {
  const { toast, dismissToast } = useCart();
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(dismissToast,4000); return () => window.clearTimeout(timer); }, [toast,dismissToast]);
  return <div className="toast-region" role="status" aria-live="polite"><AnimatePresence>{toast && <motion.div key={toast} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="toast"><Check size={19}/><span>{toast}</span><button onClick={dismissToast} aria-label="بستن پیام" className="icon-button"><X size={17}/></button></motion.div>}</AnimatePresence></div>;
}
