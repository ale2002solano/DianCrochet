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
    // Función para cargar y actualizar la cantidad de productos desde el localStorage
    const updateCantidadProductos = () => {
      const carrito = localStorage.getItem('carrito');
      if (carrito) {
        const productosCarrito = JSON.parse(carrito); // Obtener los productos del carrito
        const cantidadTotal = productosCarrito.reduce((total: number, producto: { cantidad_compra: number }) => total + producto.cantidad_compra, 0); // Sumar las cantidades de productos
        setCantidadProductos(cantidadTotal); // Actualizar el estado con la cantidad total
      }
    };

    // Inicializar con el valor del carrito al cargar la vista
    updateCantidadProductos();

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      updateCantidadProductos();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta

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
