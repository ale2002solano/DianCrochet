"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0); // Cantidad total de productos

  // Función para obtener la cantidad del carrito desde el backend
  const fetchCartCount = async (correo) => {
    try {
      if (!correo) return;

      const response = await fetch(
        "https://deploybackenddiancrochet.onrender.com/factura/carrito/obtener", // Ruta para obtener el carrito
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo }),
        }
      );

      const data = await response.json();
      if (data.codigo === 200) {
        const total = data.carrito.reduce(
          (acc, item) => acc + item.cantidad,
          0
        ); // Suma todas las cantidades
        setCartCount(total);
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
