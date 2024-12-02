'use client'

import { useProducto } from '@services/product';
import ProductDetail from '../components/ProductDetail';
import CarruselProductoRelacionado from '../components/CarruselProductoRelacionado';
import PantallaCarga from '../components/pantallacarga';


export default function ProductDetailPageDinamic() {
  const producto = useProducto();

  if (!producto) {
    return <PantallaCarga/>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">
      
      <main className="bg-slate-50 flex-grow w-full">
      <div className="min-w-screen text-black bg-slate-50 flex items-center ml-24 mr-24 mt-[6%]">
      <ProductDetail producto={producto} />
      </div>
      <div className="ml-24 max-w-full mr-24 mb-[5%]">
        <CarruselProductoRelacionado/>
      </div>
      </main>
      
    </div>
  );
}