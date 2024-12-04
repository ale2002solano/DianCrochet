'use client'

import Navbar from 'components/navbar';
import Footer from 'components/Footer';

import { useProducto } from '@services/product';
import ProductDetail from '../components/ProductDetail';

import PantallaCarga from '../components/pantallacarga';
import CarruselProductoRelacionado from '../components/CarruselProductoRelacionado';


export default function ProductDetailPageDinamic() {
  const producto = useProducto();

  if (!producto) {
    return <PantallaCarga/>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 " >
      <Navbar />
      <main className="bg-slate-50 flex-grow container mx-auto px-4 py-10">
      <div className="container mx-auto px-4 pt-10">
      <section className='flex justify-center mt-[5%]'>
        <ProductDetail producto={producto} />
      </section>
      </div>
      <div className="container mx-auto px-4 py-10">
        <section>
        <CarruselProductoRelacionado/>
        </section>
      </div>
      </main>
      <Footer />
    </div>
  );
}