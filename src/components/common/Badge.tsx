import type { ReactNode } from 'react';
export function Badge({ children, sale = false }: { children: ReactNode; sale?: boolean }) { return <span className={`badge ${sale ? 'badge-sale' : ''}`}>{children}</span>; }
