"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CartItem {
  id_producto: number;
  nombre_prod: string;
  cantidad_compra: number;
  talla: string | null;
  grosor: string | null;
  precio?: number;
}

interface CartContextProps {
  carrito: CartItem[];
  totalCantidad: number;
  agregarProducto: (producto: CartItem) => void;
  actualizarCarrito: (nuevoCarrito: CartItem[]) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Marca que ahora estamos en el cliente
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedCarrito = localStorage.getItem("carrito");
      setCarrito(storedCarrito ? JSON.parse(storedCarrito) : []);
    }
  }, [isClient]);

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
    if (isClient) {
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    }
  };

  const actualizarCarrito = (nuevoCarrito: CartItem[]) => {
    setCarrito(nuevoCarrito);
    if (isClient) {
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    }
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
