import { Producto } from "@interfaces/product";
export const GetKitsPopulares = async (): Promise<Producto[]> => {
    try {
      const response = await fetch('https://vercel-dianas.vercel.app/producto/filtro/popularidad/2');
      const data = await response.json();
      return data.populares; 
    } catch (error) {
      console.error('Error al obtener productos populares:', error);
      return []; 
    }
  };
  