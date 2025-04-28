const API_URL = "https://vercel-dianas.vercel.app/factura";

export const getFacturaFull = async(id:number)=>{
    const res = await fetch(`${API_URL}/detalle/${id}`);
    if (!res.ok) {
      throw new Error("Error al traer factura");
    }
    const data = await res.json();
    return data;
  }