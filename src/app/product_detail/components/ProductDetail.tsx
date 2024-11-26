import Image from "next/legacy/image";
import { useState, useEffect } from "react";
import { ProductoDetalle } from "@interfaces/product";
import { agregarAlCarrito } from "../post/agregarAlCarrito"; // Importa la función del POST

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
  
    const idProducto = producto.id_producto.toString();
  
    const data = {
      correo,
      idProducto,
      cantidadCompra: cantidad,
      talla: selectedTalla || null,
      grosor: selectedGrosores || null,
    };
  
    try {
      const result = await agregarAlCarrito(data);
  
      if (result.carrito && result.carrito.codigo === 4) {
        setMensajeError(result.carrito.mensaje);
        setTimeout(() => setMensajeError(null), 3000);
      } else {
        setMensajeExito("¡Producto agregado al carrito con éxito!");
        setTimeout(() => setMensajeExito(null), 3000);
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error); // Muestra detalles en la consola
      setMensajeError("Hubo un problema con la solicitud");
      setTimeout(() => setMensajeError(null), 3000);
    }
  };
  

  return (
    <div className="relative w-max grid grid-cols-1 md:grid-cols-2 gap-[15%] p-8">
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

  <div className="flex flex-col space-y-4">
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

    <div className="ml-24 mr-24 max-w-full p-5">
      <p className="text-justify font-crimson text-[#727171]">{producto.descripcion}</p>
    </div>
  </div>

  <div className="flex flex-col space-y-4">
    <h1 className="text-5xl font-koulen">{producto.nombre_prod}</h1>
    <p className="text-[#727171] font-robotoMono">L{precioActual.toFixed(2)}</p>
    <p className="font-roboto text-[#727171]">*Precio no incluye envío</p>

    {producto.tallas && producto.tallas.filter((talla) => talla !== null).length > 0 && (
      <div>
        <h3 className="font-koulen text-[#424242]">TALLA</h3>
        <div className="flex space-x-2 mt-2 font-koulen text-[#424242]">
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

    <div>
      <h3 className="font-robotoMono text-[#727171]">Cantidad</h3>
    </div>
    <div className="flex flex-col items-start">
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

    <button
      onClick={handleAddToCart}
      className="px-4 py-2 mt-4 bg-[#C68EFE] text-white font-semibold rounded-lg shadow-md hover:bg-[#b053fe] transition duration-300"
    >
      Agregar al Carrito
    </button>
  </div>
</div>

  );
};

export default ProductDetail;
