import { lazy,Suspense } from 'react';
import { Routes,Route,Link } from 'react-router';
import { MainLayout } from '../layouts/MainLayout';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import HomePage from '../pages/HomePage';
const ProductsPage=lazy(()=>import('../pages/ProductsPage'));
const ProductDetailPage=lazy(()=>import('../pages/ProductDetailPage'));
const CheckoutPage=lazy(()=>import('../pages/CheckoutPage'));
export function AppRoutes(){return <Suspense fallback={<LoadingSkeleton/>}><Routes><Route element={<MainLayout/>}><Route index element={<HomePage/>}/><Route path="products" element={<ProductsPage/>}/><Route path="products/:id" element={<ProductDetailPage/>}/><Route path="checkout" element={<CheckoutPage/>}/><Route path="*" element={<EmptyState title="این صفحه پیدا نشد" description="به خانه برگردید و دوباره به دنیای روا قدم بگذارید."><Link to="/" className="button button-primary">بازگشت به خانه</Link></EmptyState>}/></Route></Routes></Suspense>;}
