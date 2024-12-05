import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoRemoveOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiImageOff } from "react-icons/ci";
import { CarritoItem } from "@interfaces/invoice";
import { useRouter } from 'next/navigation';
import LoadingSpinner from "../loadding/LoadingSpinnerSob";
import Image from 'next/image';
import {useCart} from "../../../../context/CartContext";
interface CartItem {
    id_producto: number;
    nombre_prod: string;
    cantidad_compra: number;
    talla: string | null;
    grosor: string | null;
    precio: number;
}
//cambio mega x
export default function ShopCartForm() {
    const [carrito, setCarrito] = useState<CarritoItem[]>([]);
    const [correo, setCorreo] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [facturaId, setFacturaId] = useState<number | null>(null);
    const [subtotal, setSubtotal] = useState<number>(0); // Iniciar con 0, no null
    const [impuestos, setImpuestos] = useState<number>(0); // Iniciar con 0, no null
    const [mensajeAdvertencia, setMensajeAdvertencia] = useState<string | null>(null); // Mensaje de advertencia
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { carrito: carritoContexto, actualizarCarrito } = useCart();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [total, setTotal] = useState<number>(0); // Añadir estado para total
    //MODAL PARA ADVERTENCIAS
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');


      // Función para transformar el carrito
      const transformarCarrito = (carrito: CarritoItem[]): CartItem[] => {
        return carrito.map(item => ({
            id_producto: item.id_producto,
            nombre_prod: item.nombre_prod,
            cantidad_compra: item.cantidad_compra,
            talla: item.talla,
            grosor: item.grosor,
            precio: item.subtotal !== null ? item.subtotal : 0,
        }));
    };


    // Función para manejar el clic en detalles de envío
    const handleShippingDetailsClick = () => {
        if (carrito.length === 0) {
            setMensajeAdvertencia('Agrega productos al carrito para continuar');
            setTimeout(() => setMensajeAdvertencia(null), 3000); // Limpiar el mensaje después de 1 segundos
        } else {
            setLoading(true);
            router.push('/checkout/shipping');
        }
    };
    
    useEffect(() => {
        // Obtener el correo desde el local storage
        const storedData = localStorage.getItem('loginResponse');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const storedCorreo = parsedData.query_result.CORREO;
            console.log('Correo almacenado:', storedCorreo); // Verifica el correo almacenado
            setCorreo(storedCorreo);
        }
    }, []);

    useEffect(() => {
        if (correo) {
            const fetchCarrito = async () => {
                try {
                    const response = await fetch(`https://deploybackenddiancrochet.onrender.com/factura/carrito/${correo}`);
                    const data = await response.json();
                    console.log('Datos del carrito:', data); // Verifica los datos recibidos
                    setCarrito(data.carrito);
                    const carritoAgrupado = agruparCarrito(data.carrito);
                    setCarrito(carritoAgrupado);
                    actualizarCarrito(transformarCarrito(carritoAgrupado));
                    await fetchSubtotal();
                    if (data.carrito.length > 0) {
                        const facturaId = data.carrito[0].id_factura;
                        setFacturaId(facturaId);
                        localStorage.setItem('facturaId', facturaId.toString()); // Guardamos el id_factura en localStorage
                    }
                } catch (error) {
                    console.error('Error al obtener el carrito:', error);
                }
            };
    
            fetchCarrito();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [correo]);

    useEffect(() => {
        // Recuperamos el id_factura al cargar la vista
        const storedFacturaId = localStorage.getItem('facturaId');
        if (storedFacturaId) {
            setFacturaId(Number(storedFacturaId));
            console.log('Factura ID recuperada:', storedFacturaId);
        }
    }, []);

     // Función para obtener el subtotal e impuestos
     const fetchSubtotal = async () => {
        try {
            const response = await fetch('https://deploybackenddiancrochet.onrender.com/factura/carrito/subtotal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo })
            });
    
            if (response.ok) {
                const data = await response.json();
                setSubtotal(data.subtotal);
                setImpuestos(data.impuesto);
            } else {
                console.error('Error al obtener el subtotal e impuestos desde el backend');
            }
        } catch (error) {
            console.error('Error al intentar obtener el subtotal e impuestos:', error);
        }
    };
    

    // Eliminar producto carrito
const handleDelete = async (correo: string, idProducto: number, talla: string | null, grosor: string | null) => {
    if (!correo || !idProducto) {
        alert("Por favor, proporciona la información requerida.");
        return;
    }

    

    try {
        const response = await fetch('https://deploybackenddiancrochet.onrender.com/factura/carrito/producto/eliminar', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo,
                idProducto,
                talla: talla ? talla.toString() : null, // Asegura que talla sea un string
                grosor: grosor ? grosor.toString() : null, // Asegura que grosor sea un string
            }),
        });

        const result = await response.json();

        if (response.ok && result.eliminar.codigo === 1) {
            // Actualizar el carrito localmente
            const nuevoCarrito = carrito.filter(
                (producto) =>
                    producto.id_producto !== idProducto ||
                    producto.talla !== talla ||
                    producto.grosor !== grosor
            );

            // Recalcular el total
            const nuevoTotal = nuevoCarrito.reduce((total, producto) => total + (producto.subtotal * producto.cantidad_compra), 0);
            const nuevoImpuesto = nuevoTotal * 0.15; // Ejemplo de impuesto del 15%
            const nuevoSubtotal = nuevoTotal; // Asumimos que el subtotal es igual al total, pero si hay descuentos, puedes ajustarlo.

            // Actualizar el estado del carrito y el total
            setCarrito(nuevoCarrito);
            actualizarCarrito(nuevoCarrito);

            // Aquí puedes actualizar el estado del subtotal, impuesto y total (por ejemplo, en un estado de React)
            setSubtotal(nuevoSubtotal);
            setImpuestos(nuevoImpuesto);
            setTotal(nuevoSubtotal + nuevoImpuesto); // Actualizar total aquí

            //cambio x para 
            setModalMessage(result.eliminar.mensaje);
            setIsModalOpen(true); 
        } else {
            console.error('Error al eliminar el producto del carrito:', result.eliminar.mensaje || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error en la solicitud de eliminación:', error);
    }
};

    
    
    
   // Método para eliminar todo el carrito / eliminar orden con confirmación
   const handleCancelOrder = async () => {
    if (!facturaId) return; // Verificar que existe un id_factura

    // Mostrar mensaje en el modal
    setModalMessage(
        "¿Estas seguro de que deseas cancelar la orden y eliminar todos los productos del carrito?"
      );
      setIsModalOpen(true);
    };

    const confirmCancelOrder = async () => {

    try {
        const response = await fetch(`https://deploybackenddiancrochet.onrender.com/factura/eliminar/carrito/${facturaId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setCarrito([]); // Limpiar carrito en frontend
            setSubtotal(0); // Reiniciar subtotal
            setImpuestos(0); // Reiniciar impuestos

            // Actualizar el carrito en el contexto
            actualizarCarrito([]);

            setModalMessage("Orden cancelada y carrito eliminado");
            setIsModalOpen(false);
        } else {
            console.error('Error al eliminar todos los productos del carrito');
        }
    } catch (error) {
        console.error('Error en la eliminación del carrito:', error);
    }
};



const handleQuantityChange = async (
    idProducto: number,
    delta: number,
    grosor: string | number | null,
    talla: string | number | null,
    idProdFact: number
) => {
    const tallaFinal = talla || null;
    const grosorFinal = grosor || null;

    const updatedCarrito = carrito.map((item) => {
        if (item.id_prod_fact === idProdFact) {
            const newCantidad = item.cantidad_compra + delta;
            return {
                ...item,
                cantidad_compra: newCantidad > 0 ? newCantidad : 1,
                subtotal: ((item.subtotal ?? 0) / item.cantidad_compra) * newCantidad,
            };
        }
        return item;
    });

    const requestBody = {
        correo,
        nuevaCantidad: updatedCarrito.find((item) => item.id_prod_fact === idProdFact)?.cantidad_compra,
        idProducto,
        talla: tallaFinal,
        grosor: grosorFinal,
    };

    try {
        const response = await fetch(
            'https://deploybackenddiancrochet.onrender.com/factura/carrito/actualizar',
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.actualizar.codigo === 2) {
                alert("No puedes agregar más de este producto, ya alcanzaste el límite en inventario.");
                return;
            }

            if (data.actualizar.codigo === 1) {
                setCarrito(updatedCarrito);
                actualizarCarrito(updatedCarrito); // Actualizamos el contexto aquí
                await fetchSubtotal();
            } else {
                console.error('Error en la respuesta:', data.actualizar.mensaje);
            }
        } else {
            console.error('Error HTTP:', response.status);
        }
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
    }
};
 
    useEffect(() => {
        const calcularTotal = () => {
            const nuevoTotal = subtotal + impuestos;
            setTotal(nuevoTotal); // Actualizamos el estado del total
        };
        calcularTotal();
    }, [subtotal, impuestos]);
    

// UI
<div id="total">L. 0.00</div>

    
// Recalcular el subtotal global cada vez que cambia el carrito
useEffect(() => {
    const calcularSubtotal = () => {
        const nuevoSubtotal = carrito.reduce((acc, item) => acc + (item.subtotal ?? 0), 0);
        setSubtotal(nuevoSubtotal);
    };
    calcularSubtotal();
}, [carrito]);

// Mantener cambios tras recargar
useEffect(() => {
    const fetchCarrito = async () => {
        try {
            const response = await fetch(`https://deploybackenddiancrochet.onrender.com/factura/carrito/${correo}`);
            const data = await response.json();
            setCarrito(data.carrito);
            if (data.carrito.length > 0) {
                const facturaId = data.carrito[0].id_factura;
                setFacturaId(facturaId);
                localStorage.setItem('facturaId', facturaId.toString());
            }
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
        }
    };
    if (correo) fetchCarrito();
}, [correo]);
  
useEffect(() => {
    // Contar la cantidad total de productos en el carrito
    const totalProductos = carrito.reduce((total, item) => total + item.cantidad_compra, 0);

    // Guardar la cantidad en localStorage
    localStorage.setItem('cantidadProductosCarrito', totalProductos.toString());
}, [carrito]);


    // Agrupar productos por id_producto y talla
    const groupedCarrito = carrito.reduce((acc, item) => {
        const existingItem = acc.find(i => {
            // Mismo producto
            const sameProduct = i.id_producto === item.id_producto;
    
            // Mismo grosor si alguna talla es null
            const sameGrosor =
                (i.talla === null || item.talla === null) &&
                i.grosor === item.grosor;
    
            // Mismo talla si ambas tallas están definidas
            const sameTalla =
                i.talla !== null &&
                item.talla !== null &&
                i.talla === item.talla;
    
            // Si no tienen ni talla ni grosor, agrupar solo por producto
            const noTallaNoGrosor =
                i.talla === null &&
                item.talla === null &&
                i.grosor === null &&
                item.grosor === null;
    
            return (
                sameProduct &&
                (sameTalla || sameGrosor || noTallaNoGrosor)
            );
        });
    
        if (existingItem) {
            existingItem.cantidad_compra += item.cantidad_compra; // Sumar cantidades
            existingItem.subtotal = (existingItem.subtotal ?? 0) + (item.subtotal ?? 0); // Sumar subtotales
        } else {
            acc.push({ ...item }); // Agregar como nuevo si no cumple las condiciones de agrupació
        }
        return acc;
    }, [] as CarritoItem[]);


    // Agrupar carrit
    const agruparCarrito = (carrito: CarritoItem[]): CarritoItem[] => {
        return carrito.reduce((acc, item) => {
            const existingItem = acc.find(i =>
                i.id_producto === item.id_producto &&
                ((i.talla === item.talla) || (!i.talla && !item.talla)) &&
                ((i.grosor === item.grosor) || (!i.grosor && !item.grosor))
            );

            if (existingItem) {
                existingItem.cantidad_compra += item.cantidad_compra;
                existingItem.subtotal = (existingItem.subtotal ?? 0) + (item.subtotal ?? 0);
            } else {
                acc.push({ ...item });
            }

            return acc;
        }, [] as CarritoItem[]);
    };
    



    return (
        <div  id="PRINCIPAL" className="flex flex-col lg:flex-row justify-between font-koulen w-full p-8 h-screen overflow-y-auto">
            {loading && <LoadingSpinner />}
            <div title="Articulos" className="m-2 rounded-md bg-gray-200 w-full lg:w-1/2 flex-grow p-5 lg:px-10">
            <div id="header" className="text-gray-700 flex flex-row justify-center items-baseline content-stretch flex-wrap">
                    <div className="m-2"><h4 className="flex flex-row justify-start items-baseline text-purple-400 text-sm sm:text-base md:text-lg lg:text-xl">Resumen<IoRemoveOutline className="ml-2" /><FaCheckCircle className="text-gray-800" /><IoRemoveOutline /></h4></div>
                    <div className="m-2"><h4 className="flex flex-row justify-start items-baseline text-sm sm:text-base md:text-lg lg:text-xl">Envio<IoRemoveOutline className="ml-2" /><FaCheckCircle className="text-gray-800" /><IoRemoveOutline /></h4></div>
                    <div className="m-2"><h4 className="flex flex-row justify-start items-baseline text-sm sm:text-base md:text-lg lg:text-xl">Pago<IoRemoveOutline className="ml-2" /><FaCheckCircle className="text-gray-800" /><IoRemoveOutline /></h4></div>
            </div>

                <h1 className="text-2xl sm:text-2xl lg:text-4xl text-gray-900 pb-5">Articulos</h1>

                <div id="PRODUCTOS" className="overflow-y-auto max-h-[70vh] sm:max-h-[80vh] lg:max-h-[60vh]">
                {groupedCarrito.map((item) => (
                    <div key={item.id_prod_fact} id="product" className="bg-white rounded-md flex flex-col sm:flex-row flex-nowrap justify-start items-start content-start overflow-auto mb-5">
                        <div id="img" className="mr-8 w-24 h-24 rounded-none rounded-tl-md rounded-bl-md" title={item.nombre_prod}>
                            {item.url ? (<Image src={item.url} alt={item.nombre_prod} width={100} height={100} objectFit="cover" className="w-full h-full"/>) : (
                            <CiImageOff className="w-full h-full object-contain text-gray-400" />)}
                        </div>
                        <div id="detalle" className="flex flex-grow justify-between mr-8">
                            <div id="det" className="">
                                <h1 id="nombre" className="text-gray-700 text-lg sm:text-sm">{item.nombre_prod}</h1>
                                <div className="flex flex-row flex-nowrap justify-around items-stretch content-stretch text-left ml-1 sm:text-sm">
                                    <h4 id="cantidad" className="font-lekton text-gray-400 mr-5">Cantidad: {item.cantidad_compra}</h4>
                                    {item.talla && (<h4 id="talla" className="font-lekton text-gray-400 mr-5">Talla: {item.talla}</h4>)}
                                    {item.grosor && (<h4 id="color" className="font-lekton text-gray-400">Grosor: {item.grosor}</h4>)}
                                </div>
                                <div className="flex items-center border border-black rounded-full bg-gray-100 text-gray-700 font-lekton w-max">
                                <button
                                    className="text-lg font-semibold px-2"
                                    onClick={() => handleQuantityChange(item.id_producto, -1, item.grosor, item.talla, item.id_prod_fact)}
                                >
                                    −
                                </button>
                                <span className="mx-4 text-lg">{item.cantidad_compra}</span>
                                <button
                                    className="text-lg font-semibold px-2"
                                    onClick={() => handleQuantityChange(item.id_producto, 1, item.grosor, item.talla, item.id_prod_fact)}
                                >
                                    +
                                </button>
                                </div>

                            </div>
                            <div id="precio" className="mt-8 flex flex-col flex-nowrap justify-start items-end content-stretch">
                                <h3 className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">{item.subtotal !== null ? `${item.subtotal} Lps` : 'No disponible'}</h3>
                                <button title="delete" onClick={() => handleDelete(correo, item.id_producto, item.talla, item.grosor)}>
                                    <FaRegTrashAlt className="text-gray-700 hover:text-red-700"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    

                    ))}
                </div>

                
            </div>

            <div title="Resumen orden" className="m-2 p-5 rounded-md bg-gray-200 w-full lg:w-1/3 flex flex-col justify-between">
            <div id="hd1"  className="flex flex-row flex-wrap justify-between items-start sm:items-start gap-y-4 sm:gap-y-0">
                <div id="orden" className="text-gray-800 sm:text-left flex flex-col justify-center">
                    <h1 className="text-base sm:text-1xl ">Resumen orden</h1>
                    <div id="cantprod" className="max-h-52 overflow-y-auto w-full">{groupedCarrito.map((item) => (
                        <h2 key={item.id_prod_fact} className="text-sm sm:text-base mb-3">{item.cantidad_compra} x {item.nombre_prod}</h2>))}
                    </div>
                </div>
                
                <div id="pago" className="text-gray-800 sm:text-left flex flex-col justify-center">
                    <h1 className="text-base sm:text-1xl">Pagos con</h1>
                    <button className="w-12 sm:w-16 border-blue-900 rounded-md border px-2 py-1 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
                          <Image alt="paypal" src="/img/paypal-logo-0.png" width={80} height={80} className="w-8 sm:w-12 h-auto"/>
                    </button>

                </div>
            </div>



                {/* 
                <div id="hd2" className="flex flex-col space-y-2">
                    <h3 className="text-gray-800 font-inter text-sm">CODIGO DE DESCUENTO</h3>
                    <div className="flex items-center space-x-2">
                      <input title="descuento" type="text" name="descuento" id="" className="flex-grow rounded-md border-none bg-gray-300 text-gray-700 mr-8" />
                      <button type="button" title="aplicar" className="border-purple-400 border-2 text-purple-400 font-inter py-2 px-5 rounded-md">Aplicar</button>
                    </div>
                </div>
                */}

<div id="hd3" className="mt-2 font-inter text-sm text-gray-800">
  <table className="w-full">
    <tbody>
      <tr>
        <td className="text-left py-1">Subtotal</td>
        <td className="text-right py-1">L. {carrito.length === 0 ? "0.00" : subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td className="text-left py-1">Impuestos</td>
        <td className="text-right py-1">L. {carrito.length === 0 ? "0.00" : impuestos.toFixed(2)}</td>
      </tr>
      <tr>
        <td className="text-left py-1">Envio</td>
        <td className="text-right py-1">...</td>
      </tr>
      <tr>
        <td className="text-left py-1 font-bold">Total</td>
        <td className="text-right py-1 font-bold">
          L. {carrito.length === 0 ? "0.00" : (subtotal + impuestos).toFixed(2)}
        </td>
      </tr>
    </tbody>
  </table>
</div>




           {/* Modal de Confirmación */}
    {isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8">
        {/* Título */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center sm:text-left">
            Confirmacion
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6 text-center sm:text-left">{modalMessage}</p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-2">
            <button
            onClick={confirmCancelOrder}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300 w-full sm:w-auto"
            >
            Aceptar
            </button>
            <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300 w-full sm:w-auto"
            >
            Cancelar
            </button>
        </div>
        </div>
    </div>
    )}      


                 

                {/* BOTONES */}
                <div id="but" className="flex flex-row flex-nowrap justify-end items-end content-start">
                    <button title="decline" type="button" className="text-gray-800 bg-gray-200 py-2 px-6 sm:py-3 sm:px-8 text-sm sm:text-base rounded-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1" onClick={handleCancelOrder}>Cancelar</button>
                    <button title="sending" type="button" className="bg-purple-400 text-white py-2 px-6 sm:py-3 sm:px-8 text-sm sm:text-base rounded-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1" onClick={handleShippingDetailsClick}>Envio</button>
                </div>
            </div>
            
            {mensajeAdvertencia && (
             <div className="text-lg items-center w-1/4 flex justify-center font-koulen fixed bottom-5 right-5 bg-gray-200 opacity-75 text-purple-800 px-1 py-2 rounded-lg z-50">
            {mensajeAdvertencia}
           </div>
          )}
        </div>
    );
}
