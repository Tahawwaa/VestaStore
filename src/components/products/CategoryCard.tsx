import { ArrowUpLeft } from 'lucide-react';
import { Link } from 'react-router';
export function CategoryCard({title,subtitle,image,to}:{title:string;subtitle:string;image:string;to:string}) {return <Link to={to} className="category-card"><img src={image} alt={`مجموعه ${title}`} loading="lazy" width={600} height={700}/><div><span><h3>{title}</h3><p>{subtitle}</p></span><span className="category-arrow"><ArrowUpLeft size={23}/></span></div></Link>;}
