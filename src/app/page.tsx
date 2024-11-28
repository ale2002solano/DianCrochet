'use client';

import Navbar from 'components/navbar';
import SliderVideo from './landing/components/SliderVideo';
import Footer from 'components/Footer';
import Carrusel from './landing/components/Carrusel';
import CarruselKit from './landing/components/CarruselKit';
import BackendKeepAlive from "../components/BackendKeepAlive";

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">
      <BackendKeepAlive /> {/* Mantiene el backend activo */}
      <Navbar />  
      <main className="bg-slate-50 flex-grow w-full mt-10">
        <div className="flex justify-center">
          <SliderVideo />
        </div>
        
        <div className="container mx-auto px-4 py-10">
          <section>
            <div>
              <Carrusel /> 
            </div>
          </section>

          <section className="mt-12">
            <div>
              <CarruselKit/> 
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
