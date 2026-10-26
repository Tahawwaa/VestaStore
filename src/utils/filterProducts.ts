import type { Product } from '../types/product';
import type { Filters } from '../components/products/Filters';
export function filterProducts(products:Product[],filters:Filters,favorites:string[]){
  const query=filters.query.trim().toLocaleLowerCase('fa').replace(/ي/g,'ی').replace(/ك/g,'ک');
  return products.filter(product=>(!filters.category||product.category===filters.category)&&(!filters.size||product.sizes.some(size=>size===filters.size))&&(!filters.color||product.colors.some(color=>color.value===filters.color))&&product.price<=filters.maxPrice&&(!filters.available||product.isAvailable)&&(!filters.isNew||product.isNew)&&(!filters.sale||Boolean(product.compareAtPrice))&&(!filters.favorites||favorites.includes(product.id))&&(!query||[product.title,product.description,...product.tags,...product.colors.map(c=>c.name)].join(' ').toLocaleLowerCase('fa').includes(query))).sort((a,b)=>filters.sort==='low'?a.price-b.price:filters.sort==='high'?b.price-a.price:filters.sort==='best'?Number(Boolean(b.isBestSeller))-Number(Boolean(a.isBestSeller))||b.reviewCount-a.reviewCount:Number(Boolean(b.isNew))-Number(Boolean(a.isNew)));
}
