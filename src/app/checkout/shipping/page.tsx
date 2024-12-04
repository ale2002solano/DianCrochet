"use client";

import ShippingForm from "../components/posts/ShippingForm";


export default function ShippingCart() {
    return (
      <main className="flex lg:h-screen w-full flex-col bg-slate-50 overflow-hidden">
        
        <section className="imagen relative flex lg:h-[92%] w-full items-center justify-center mt-16">
          <ShippingForm />
         
        </section>
      </main>
    );
  }
  