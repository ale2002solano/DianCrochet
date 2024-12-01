"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextProps {
  cantidadProductos: number;
  setCantidadProductos: (cantidad: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cantidadProductos, setCantidadProductos] = useState<number>(0);

  useEffect(() => {
    // Inicializar con el valor del localStorage
    const cantidad = localStorage.getItem('cantidadProductosCarrito');
    if (cantidad) {
      setCantidadProductos(parseInt(cantidad, 10));
    }

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      const updatedCantidad = localStorage.getItem('cantidadProductosCarrito');
      if (updatedCantidad) {
        setCantidadProductos(parseInt(updatedCantidad, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
