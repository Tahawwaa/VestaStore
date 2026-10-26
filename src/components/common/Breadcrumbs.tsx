import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) { return <nav aria-label="مسیر صفحه" className="breadcrumbs"><Link to="/">خانه</Link>{items.map((item,i) => <span key={i}><ChevronLeft size={12}/>{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>; }
