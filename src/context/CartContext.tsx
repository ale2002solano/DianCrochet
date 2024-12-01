"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextProps {
  cantidadProductos: number;
  setCantidadProductos: (cantidad: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cantidadProductos, setCantidadProductos] = useState<number>(0);

  // Este useEffect inicializa la cantidadProductos desde localStorage
  useEffect(() => {
    const cantidad = localStorage.getItem('cantidadProductosCarrito');
    if (cantidad) {
      setCantidadProductos(parseInt(cantidad, 10));
    }
  }, []);

  // Este useEffect actualiza localStorage cuando cantidadProductos cambia
  useEffect(() => {
    if (cantidadProductos >= 0) { // Verifica que la cantidad sea válida
      localStorage.setItem('cantidadProductosCarrito', cantidadProductos.toString());
    }
  }, [cantidadProductos]);

  useEffect(() => {
    console.log('Cantidad de productos:', cantidadProductos);
  }, [cantidadProductos]);

  return (
    <CartContext.Provider value={{ cantidadProductos, setCantidadProductos }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
