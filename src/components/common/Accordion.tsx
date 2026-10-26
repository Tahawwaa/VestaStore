import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
export function Accordion({ title, children }: { title: string; children: ReactNode }) { const [open,setOpen] = useState(false); const id=useId(); return <div className="accordion"><button aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{title}{open ? <Minus size={17}/> : <Plus size={17}/>}</button><AnimatePresence>{open && <motion.div id={id} initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><div className="accordion-content">{children}</div></motion.div>}</AnimatePresence></div>; }
