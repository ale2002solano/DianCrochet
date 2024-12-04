import Image from 'next/image';

export default function Kit({ nombre, pdf, imagen }: { nombre: string; pdf: string; imagen: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-full cursor-pointer">
      <div className='w-full h-[75%] relative overflow-hidden'>
        <Image
          src={imagen}
          alt={nombre}
          layout="fill" // Hace que la imagen ocupe todo el espacio disponible
          className="rounded-t-lg object-cover" // Ajusta la imagen al contenedor sin distorsionar
        />
      </div>
      <div className="p-1 px-2 text-left h-[25%] flex flex-col">
        <h3 className="text-sm font-koulen text-[#424242]">{nombre}</h3>
        <div className="flex items-center">
          <a href={pdf} download className="text-sm font-koulen text-gray-500 mt-1 hover:underline"
          >
            Descargar patron
          </a>
        </div>
      </div>
    </div>
  );
}


