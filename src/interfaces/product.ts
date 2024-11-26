// Definimos la interfaz ProductoPopular
export interface Producto {
    ID_PRODUCTO: number;
    NOMBRE_PROD: string;
    PRECIO_VENTA: number;
    URL: string | null; // Ahora incluye la URL de la imagen
  }

  export interface ProductoDetalle {
    id_producto: number;
    nombre_prod: string;
    precio_venta: number;
    descripcion: string;
    cantidad_disp: number;
    tipo_prod: string;
    color: string;
    tallas: string[] | null;
    precios_tallas: number[] | null;
    cantidad_por_talla: number[] | null;
    imagen_principal: string;
    imagenes_extra: string[];
    grosores: (string | null)[];
    precios_grosores: number[] | null;
    cantidad_por_grosor: number[] | null;
    nombre_marca: string;
  }
  

  export interface ProductoSimilar {
    ID_PRODUCTO: number;
    NOMBRE_PROD: string;
    PRECIO_VENTA: number;
    IMG_PRINCIPAL: string | null; // Ahora incluye la URL de la imagen
  }

  export interface FullProduct{
    id_producto: number;
    nombre_prod: string;
    precio_venta: number;
    imagen_principal: string
  }

  export interface CarritoRequest {
    correo: string;
    idProducto: string;
    cantidadCompra: number;
    talla: string | null;
    grosor: string | null
  }
  export interface FullMaterial{
    id_producto: number;
    nombre_prod: string;
    precio_venta: number;
    imagen_principal: string
  }

  export interface Filtered{
    categorias: string[] | null;
    min_precio: number | null;
    max_precio: number | null;
    columna_ordenamiento: string | null;
    direccion_ordenamiento: string | null;
  }

  export interface Categories{
    ID_CATEGORIA:number;
    CATEGORIA: string
  }

  export interface DetalleMaterial {
    id_producto: number;
    nombre_prod: string;
    precio_venta: number;
    descripcion: string;
    cantidad_disp: number;
    tipo_prod: string;
    color: string;
    tallas: (string | null)[];
    imagen_principal: string;
    imagenes_extra: string[];
    grosores: (string | null)[];
    cantidad_por_grosor: number[];
    nombre_marca: string;
  }

  export interface CarritoRequestMaterial {
    correo: string;
    idProducto: string;
    cantidadCompra: string;
    grosores: string | null;
    tallas: string | null;
  }
