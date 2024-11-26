import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoRemoveOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiImageOff } from "react-icons/ci";
import { CarritoItem } from "@interfaces/invoice";
import { useRouter } from 'next/navigation';
import LoadingSpinner from "../loadding/LoadingSpinnerSob";
import Image from 'next/image';

//hey, this is
export default function ShopCartForm() {
    const [carrito, setCarrito] = useState<CarritoItem[]>([]);
    const [correo, setCorreo] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [facturaId, setFacturaId] = useState<number | null>(null);
    const [subtotal, setSubtotal] = useState<number>(0); // Iniciar con 0, no null
    const [impuestos, setImpuestos] = useState<number>(0); // Iniciar con 0, no null
    const [mensajeAdvertencia, setMensajeAdvertencia] = useState<string | null>(null); // Mensaje de advertencia

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
                setCarrito((prevCarrito) =>
                    prevCarrito.filter(
                        (producto) =>
                            producto.id_producto !== idProducto ||
                            producto.talla !== talla ||
                            producto.grosor !== grosor
                    )
                );
                alert(result.eliminar.mensaje);
            } else {
                console.error('Error al eliminar el producto del carrito:', result.eliminar.mensaje || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error en la solicitud de eliminación:', error);
        }
    };
    
    
    

    // Método para eliminar todo el carrito / eliminar orden
    const handleCancelOrder = async () => {
        if (!facturaId) return; // Verificar que existe un id_factura

        try {
            const response = await fetch(`https://deploybackenddiancrochet.onrender.com/factura/eliminar/carrito/${facturaId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCarrito([]); // Limpiar carrito en frontend
                setSubtotal(0); // Reiniciar subtotal
                setImpuestos(0); // Reiniciar impuestos
                alert("Orden cancelada y carrito eliminado");
            } else {
                console.error('Error al eliminar todos los productos del carrito');
            }
        } catch (error) {
            console.error('Error en la eliminación del carrito:', error);
        }
    };

    //Actualizar cantidad de productos
const handleQuantityChange = async (
    idProducto: number,
    delta: number,
    grosor: string | number | null,
    talla: string | number | null,
    idProdFact: number
) => {
    // Manejo seguro de los valores null
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

    setCarrito(updatedCarrito);

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
            if (data.actualizar.codigo === 1) {
                console.log(data.actualizar.mensaje);
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

// Recalcular total
useEffect(() => {
    const calcularTotal = () => {
        const total = subtotal + impuestos;
        document.getElementById('total')!.innerText = `L. ${total.toFixed(2)}`;
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
            acc.push({ ...item }); // Agregar como nuevo si no cumple las condiciones de agrupación
        }
        return acc;
    }, [] as CarritoItem[]);
    



    return (
        <div className="flex justify-between font-koulen w-full p-8">
            {loading && <LoadingSpinner />}
            <div title="Articulos" className="m-2 rounded-md bg-gray-200 w-1/2 flex-grow p-5 px-10 ">
                <div id="header" className="text-gray-700 flex flex-row flex-nowrap justify-center items-baseline content-stretch">
                    <div><h4 className="m-2 flex flex-row flex-nowrap justify-start items-baseline content-stretch text-purple-400">Resumen <IoRemoveOutline className="ml-2"/> <FaCheckCircle className="text-gray-800" /> <IoRemoveOutline /></h4></div>
                    <div><h4 className="m-2 flex flex-row flex-nowrap justify-start items-baseline content-stretch">Envio <IoRemoveOutline className="ml-2"/> <FaCheckCircle className="text-gray-800" /> <IoRemoveOutline /></h4></div>
                    <div><h4 className="m-2 flex flex-row flex-nowrap justify-start items-baseline content-stretch">Pago <IoRemoveOutline className="ml-2"/> <FaCheckCircle className="text-gray-800" /> <IoRemoveOutline /></h4></div>
                </div>
                <h1 className="text-3xl text-gray-900 pb-5">Articulos</h1>

                <div id="PRODUCTOS" className="max-h-96 overflow-y-auto">
                {groupedCarrito.map((item) => (
                    <div key={item.id_prod_fact} id="product" className="bg-white rounded-md flex flex-row flex-nowrap justify-start items-start content-start overflow-hidden mb-5">
                        <div id="img" className="mr-8 w-24 h-24 rounded-none rounded-tl-md rounded-bl-md" title={item.nombre_prod}>
                            {item.url ? (<Image src={item.url} alt={item.nombre_prod} width={100} height={100} objectFit="cover" className="w-full h-full"/>) : (
                            <CiImageOff className="w-full h-full object-contain text-gray-400" />)}
                        </div>
                        <div id="detalle" className="flex flex-grow justify-between mr-8">
                            <div id="det" className="">
                                <h1 id="nombre" className="text-gray-700 text-lg">{item.nombre_prod}</h1>
                                <div className="flex flex-row flex-nowrap justify-around items-stretch content-stretch">
                                    <h4 id="cantidad" className="font-lekton text-gray-400 mr-5">Cantidad: {item.cantidad_compra}</h4>
                                    <h4 id="talla" className="font-lekton text-gray-400 mr-5">Talla: {item.talla ?? ''} </h4>
                                    <h4 id="color" className="font-lekton text-gray-400">Grosor:{item.grosor ?? ''} </h4>
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
                                <h3 className="text-gray-700">{item.subtotal !== null ? `${item.subtotal} Lps` : 'No disponible'}</h3>
                                <button title="delete" onClick={() => handleDelete(correo, item.id_producto, item.talla, item.grosor)}>
                                    <FaRegTrashAlt className="text-gray-700 hover:text-red-700"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    

                    ))}
                </div>

                
            </div>

            <div title="Resumen orden" className="m-2 p-10 rounded-md bg-gray-200 flex flex-col flex-nowrap justify-between items-stretch content-stretch">
            <div id="hd1" className="flex flex-row flex-nowrap justify-between items-start content-start">
                 <div id="orden" className="mr-64 text-gray-800">
                     <h1 className="mb-3">Resumen de la orden</h1>
                     <div id="cantprod" className="max-h-52 overflow-y-auto w-auto">
                         {groupedCarrito.map((item) => (
                             <h2 key={item.id_prod_fact} className="mb-3">{item.cantidad_compra} x {item.nombre_prod}</h2>
                         ))}
                     </div>
                 </div>
                 <div id="pago" className="text-gray-800">
                     <h1>Pagos con</h1>
                     <button className="w-16 border-blue-900 rounded-md border-2 px-3 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-5px]">
                        <Image alt="paypal" src="/img/paypal-logo-0.png"  width={100} height={100}/>
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

                <div id="hd3" className="flex flex-row flex-nowrap justify-between items-start content-start mt-2 font-inter text-sm">
                    <div id="orden" className="mr-64 text-gray-800">
                        <h2 className="mb-3">Subtotal</h2>
                        <h2 className="mb-3">Impuestos</h2>
                        <h2 className="mb-3">Envio</h2>
                        <h2 className="mb-3">Total</h2>
                    </div>
                    <div id="pago" className="text-gray-800">
                        <h3 className="mb-3" id="subtotal">L. {carrito.length === 0 ? "0.00" : subtotal.toFixed(2)}</h3>
                        <h3 className="mb-3" id="impuestos">L. {carrito.length === 0 ? "0.00" : impuestos.toFixed(2)}</h3>
                        <h3 className="mb-3">...</h3>
                        <h3 className="mb-3" id="total">L.</h3>
                    </div>
                 </div>

                 

                {/* BOTONES */}
                <div id="but" className="flex flex-row flex-nowrap justify-end items-end content-start">
                    <button title="decline" type="button" className="mr-8 text-gray-800 p-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-5px] rounded-md"  onClick={handleCancelOrder}>Cancelar Orden</button>
                    <button title="sending" type="button" className="bg-purple-400 py-4 px-9 rounded-md transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-5px]" onClick={handleShippingDetailsClick}>Detalles de envio</button>
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
