import React from 'react';
import Image from "next/legacy/image";

export default function Product({ nombre, precio, imagen }: { nombre: string; precio: string; imagen: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-full">
      <div className='w-[100%] h-[83%] relative overflow-hidden'>
        <Image
          src={imagen}
          alt={nombre}
          layout='fill'
          sizes="260px" // Esto hace que la imagen ocupe todo el espacio disponible
          className="rounded-t-lg object-cover"
          priority // Ajusta la imagen al contenedor sin distorsionar
        />
      </div>
      <div className="p-2 text-left flex justify-between lg:block ">
        <h3 className="text-sm font-koulen text-gray-800">{nombre}</h3>
        <p className="text-sm font-koulen text-gray-500 mt-1">{precio}</p>
      </div>
    </div>
  );
}
