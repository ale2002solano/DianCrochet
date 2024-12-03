export interface Producto {
    ID_PRODUCTO: number;
    NOMBRE_PROD: string;
    PRECIO_VENTA: number;
    URL: string | null; // Ahora incluye la URL de la imagen
}

export interface CarritoItem {
    id_factura: number;
    id_prod_fact: number;
    id_producto: number;
    nombre_prod: string;
    cantidad_compra: number;
    grosor: string | null; // Tipo `string | null` si puede ser nulo
    talla: string | null; 
    subtotal: number;
    url: string | null;
}

export interface Carrito {
    carrito: CarritoItem[];
}

export interface Departamento {
    ID_DEPARTAMENTO: number;
    DEPARTAMENTO: string;
  }
  
  export interface PhoneNumberInputProps {
    value: string; // Este es el valor del número de teléfono
    onChange: (phone: string) => void; // Esta es la función para manejar el cambio del teléfono
    error?: string; // Opcionalmente, para manejar errores de validación
  }

  // Definir interfaces para la respuesta
export interface PayPalLink {
    href: string;
    rel: string;
    method: string;
}

export interface PayPalResponse {
    data: {
        id: string;
        status: string;
        links: PayPalLink[];
    };
}