export interface Bill{
    id_factura:number
    codigo_fact:string
    total:number
    fecha_fact:string
    productos: string
}

export interface FullBill{
    codigo_fact:string
    total:number
    fecha_fact:string
    nombre_prod: string
    precio_prod: number
    impuesto: number
    precio_envio: number
    subtotal: number
}