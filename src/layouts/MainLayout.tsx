import { useEffect } from 'react';
import { Outlet,useLocation } from 'react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Toast } from '../components/common/Toast';
export function MainLayout(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo({top:0});document.title=pathname==='/checkout'?'ثبت سفارش | رَوا':pathname.startsWith('/products')?'فروشگاه | رَوا':'رَوا | سادگی، امضای توست';},[pathname]);return <><a className="skip-link" href="#main">رفتن به محتوای اصلی</a><Navbar/><main id="main"><Outlet/></main><Footer/><CartDrawer/><Toast/></>;}
