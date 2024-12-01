"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id_producto: string;
  nombre_prod: string;
  cantidad_compra: number;
  talla: string | null;
  grosor: string | null;
  precio: number;
}

interface CartContextProps {
  carrito: CartItem[];
  totalCantidad: number;
  agregarProducto: (producto: CartItem) => void;
  actualizarCarrito: (nuevoCarrito: CartItem[]) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<CartItem[]>(() => {
    const storedCarrito = localStorage.getItem("carrito");
    return storedCarrito ? JSON.parse(storedCarrito) : [];
  });

  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad_compra, 0);

  const agregarProducto = (producto: CartItem) => {
    const index = carrito.findIndex(
      (item) =>
        item.id_producto === producto.id_producto &&
        item.talla === producto.talla &&
        item.grosor === producto.grosor
    );

    const nuevoCarrito = [...carrito];
    if (index !== -1) {
      nuevoCarrito[index].cantidad_compra += producto.cantidad_compra;
    } else {
      nuevoCarrito.push(producto);
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const actualizarCarrito = (nuevoCarrito: CartItem[]) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  return (
    <CartContext.Provider value={{ carrito, totalCantidad, agregarProducto, actualizarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export default CartContext;
