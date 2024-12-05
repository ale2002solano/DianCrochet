import { CarritoRequest } from "@interfaces/product";

export const agregarAlCarrito = async (data: CarritoRequest) => {
  // console.log('antes de enviar al carrito:', data)
    try {
      const response = await fetch('https://deploybackenddiancrochet.onrender.com/factura/carrito/insertar/actualizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Error al agregar al carrito service');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Hubo un problema con la solicitud');
    }
  };