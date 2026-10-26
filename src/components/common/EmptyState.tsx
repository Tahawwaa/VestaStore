import { ShoppingBag } from 'lucide-react';
import type { ReactNode } from 'react';
export function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) { return <div className="empty-state"><ShoppingBag size={40} strokeWidth={1}/><h2>{title}</h2><p>{description}</p>{children}</div>; }
