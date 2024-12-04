'use client';
import Image from "next/legacy/image";
import { useState, useEffect } from "react";
import { ProductoDetalle } from "@interfaces/product";
import { agregarAlCarrito } from "../post/agregarAlCarrito"; // Importa la función del POST
import { useBounce } from '../../../context/BounceContext';
import { useCart } from "context/CartContext";

// Definimos el tipo para los elementos del carrito
interface CarritoItem {
  id_producto: string;
  nombre_prod: string;
  cantidad_compra: number;
  talla: string | null;
  grosor: string | null;
  precio: number;
}

interface CartItem {
  id_producto: number; // Cambié el tipo a number para ser consistente
  nombre_prod: string;
  cantidad_compra: number;
  talla: string | null;
  grosor: string | null;
  precio: number;
}


interface ProductDetailProps {
  producto: ProductoDetalle;
}

const ProductDetail = ({ producto }: ProductDetailProps) => {
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [selectedGrosores, setSelectedGrosores] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string>(""); // Correo del usuario
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioActual, setPrecioActual] = useState<number>(producto.precio_venta);
  const { setIsBounce } = useBounce();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { agregarProducto, actualizarCarrito } = useCart();

  // Función para transformar el carrito
  const transformarCarrito = (carrito: CarritoItem[]): CartItem[] => {
    return carrito.map(item => ({
      id_producto: Number(item.id_producto), // Convertir a number
      nombre_prod: item.nombre_prod,
      cantidad_compra: item.cantidad_compra,
      talla: item.talla,
      grosor: item.grosor,
      precio: item.precio,
    }));
  };

  // Función para incrementar la cantidad
  const increaseQuantity = () => {
    setCantidad((prev) => prev + 1);
  };

  // Función para disminuir la cantidad
  const decreaseQuantity = () => {
    if (cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  };

  // Efecto para obtener el correo del usuario desde localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("loginResponse");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const storedCorreo = parsedData?.query_result?.CORREO;
      setCorreo(storedCorreo || "");
    }
  }, []);

  // Efecto para establecer la talla predeterminada
  useEffect(() => {
    if (producto.tallas && producto.tallas.filter((talla) => talla !== null).length > 0) {
      setSelectedTalla(producto.tallas[0]);
    }
  }, [producto.tallas]);

  // Efecto para establecer el grosor predeterminado
  useEffect(() => {
    if (producto.grosores && producto.grosores.filter((grosor) => grosor !== null).length > 0) {
      setSelectedGrosores(producto.grosores[0]);
    }
  }, [producto.grosores]);

  // Efecto para actualizar el precio dinámico
  useEffect(() => {
    if (selectedTalla && producto.tallas && producto.precios_tallas) {
      const index = producto.tallas.indexOf(selectedTalla);
      setPrecioActual(producto.precios_tallas[index]);
    } else if (selectedGrosores && producto.grosores && producto.precios_grosores) {
      const index = producto.grosores.indexOf(selectedGrosores);
      setPrecioActual(producto.precios_grosores[index]);
    } else {
      setPrecioActual(producto.precio_venta);
    }
  }, [selectedTalla, selectedGrosores, producto]);

  // Manejar el clic en miniaturas
  const handleThumbnailClick = (src: string) => {
    setZoomImage(src);
  };

  // Cerrar la vista de zoom
  const handleZoomClose = () => {
    setZoomImage(null);
  };

  // Manejar la acción de agregar al carrito
  const handleAddToCart = async () => {
    if (!correo) {
      setMensajeError("Inicia sesión para comprar");
      setTimeout(() => setMensajeError(null), 3000);
      return;
    }

    setIsBounce(true);
    setTimeout(() => setIsBounce(false), 2000);

    const idProducto = producto.id_producto.toString();
    const newProduct: CarritoItem = {
      id_producto: idProducto,
      nombre_prod: producto.nombre_prod,
      cantidad_compra: cantidad,
      talla: selectedTalla || null,
      grosor: selectedGrosores || null,
      precio: precioActual,
    };

    // Obtén el carrito del localStorage y asegura el tipo
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]") as CarritoItem[];
    const index = carrito.findIndex(
      (item: CarritoItem) =>
        item.id_producto === idProducto &&
        item.talla === selectedTalla &&
        item.grosor === selectedGrosores
    );

    if (index !== -1) {
      carrito[index].cantidad_compra += cantidad;
    } else {
      carrito.push(newProduct);
    }

    // Guarda el carrito actualizado en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // **Transforma el carrito antes de actualizarlo en el contexto**
    const carritoTransformado = transformarCarrito(carrito);
    actualizarCarrito(carritoTransformado);

    try {
      const result = await agregarAlCarrito({
        correo,
        idProducto,
        cantidadCompra: cantidad,
        talla: selectedTalla,
        grosor: selectedGrosores,
      });

      if (result.carrito && result.carrito.codigo === 4) {
        setMensajeError(result.carrito.mensaje);
        setTimeout(() => setMensajeError(null), 3000);
      } else {
        setMensajeExito("¡Producto agregado al carrito con éxito!");
        setTimeout(() => setMensajeExito(null), 3000);
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      setMensajeError("Hubo un problema con la solicitud");
      setTimeout(() => setMensajeError(null), 3000);
    }
  }

  return (
    
    <div className="relative grid grid-cols-1 md:grid-cols-2  p-8 justify-center">
        {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleZoomClose}
        >
          <Image
            src={zoomImage}
            alt="Zoom de imagen"
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
  )}

  {mensajeExito && (
    <div className="text-lg items-center w-1/4 flex justify-center font-lekton fixed bottom-5 right-5 bg-gray-200 opacity-70 text-purple-900 px-4 py-2 rounded-lg z-50">
      {mensajeExito}
    </div>
  )}

  {mensajeError && (
    <div className="text-lg items-center w-1/4 flex justify-center font-lekton fixed bottom-5 right-5 bg-gray-200 opacity-70 text-purple-900 px-4 py-2 rounded-lg z-50">
      {mensajeError}
    </div>
  )}

  <div className="flex flex-col space-y-4 mr-10">
    <div className="flex justify-center">
      {producto.imagen_principal ? (
        <Image
          src={producto.imagen_principal}
          alt={producto.nombre_prod}
          width={350}
          height={350}
          className="rounded-lg w-[450px]"
        />
      ) : (
        <div className="w-[350px] h-[350px] flex items-center justify-center bg-gray-200 rounded-lg">
          <p className="text-gray-500">Imagen no disponible</p>
        </div>
      )}
    </div>

    <div className="overflow-x-auto flex space-x-2 scrollbar-hide justify-center sp">
      {(producto.imagenes_extra || []).map((thumbnailSrc, index) => (
        <Image
          key={index}
          src={thumbnailSrc}
          alt={`Imagen adicional ${index + 1}`}
          width={112}
          height={112}
          className="w-28 h-28 rounded-lg border cursor-pointer flex-shrink-0 m-2"
          onClick={() => handleThumbnailClick(thumbnailSrc)}
        />
      ))}
    </div>

    <div className="max-w-full p-5">
      <p className="text-justify font-crimson text-[#727171]">{producto.descripcion}</p>
    </div>
  </div>

  <div className="flex flex-col space-y-4">
    <h1 className="text-5xl text-black font-koulen">{producto.nombre_prod}</h1>
    <p className="text-[#727171] font-robotoMono">L{precioActual.toFixed(2)}</p>
    <p className="font-roboto text-[#727171]">*Precio no incluye envío</p>
    <div>
    {producto.tallas && producto.tallas.filter((talla) => talla !== null).length > 0 && (
  <div>
    <h3 className="font-koulen text-[#424242]">TALLA</h3>
    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-col xl:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:space-y-2 md:space-x-0 lg:space-y-2 lg:space-x-0 xl:space-y-0 xl:space-x-2 mt-2 font-koulen text-[#424242]">
      {producto.tallas
        .filter((talla) => talla !== null)
        .map((talla) => (
          <button
            key={talla}
            className={`px-11 py-2 border rounded-lg ${
              selectedTalla === talla ? "bg-[#C68EFE] text-white" : "bg-[#D9D9D9]"
            }`}
            onClick={() => setSelectedTalla(talla)}
          >
            {talla}
          </button>
        ))}
    </div>
  </div>
)}

    {producto.grosores && producto.grosores.filter((grosor) => grosor !== null).length > 0 && (
      <div>
        <h3 className="font-koulen text-[#424242]">GROSOR</h3>
        <div className="mt-2 font-koulen text-[#D9D9D9] focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-none">
          <select
            id="grosorSelect"
            className="px-11 py-2 border rounded-lg bg-[#D9D9D9] text-[#424242] border-none focus:ring-0"
            value={selectedGrosores || ""}
            onChange={(e) => setSelectedGrosores(e.target.value)}
          >
            <option value="" disabled>
              Seleccionar
            </option>
            {producto.grosores
              .filter((grosor) => grosor !== null)
              .map((grosor) => (
                <option key={grosor} value={grosor}>
                  {grosor}
                </option>
              ))}
          </select>
        </div>
      </div>
    )}
    </div>
    <div>
      <h3 className="font-robotoMono text-[#727171]">Cantidad</h3>
    </div>
    <div className="flex flex-col text-black items-start">
      <div className="flex items-center bg-gray-100 rounded-full shadow-md px-2 py-1">
        <button
          onClick={decreaseQuantity}
          className="text-xl font-semibold text-[#727171] hover:text-[#C68EFE]"
        >
          -
        </button>
        <span className="mx-6 text-lg font-medium">{cantidad}</span>
        <button
          onClick={increaseQuantity}
          className="text-xl font-semibold text-[#727171] hover:text-[#C68EFE]"
        >
          +
        </button>
      </div>
    </div>
    <div className="">
    <button
      onClick={handleAddToCart}
      className="px-4 py-2 mt-4 bg-[#C68EFE] text-white font-semibold rounded-lg shadow-md hover:bg-[#b053fe] transition duration-100"
    >
      Agregar al Carrito
    </button>
    </div>
  </div>
</div>

  );
};





export default ProductDetail;
