import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoRemoveOutline } from "react-icons/io5";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { CarritoItem, Departamento, PayPalResponse } from "@interfaces/invoice";
import axios from 'axios';
import Image from "next/image";

export default function ShippingForm() {
    const router = useRouter();
    const [subtotal, setSubtotal] = useState<number>(0); // Iniciar con 0, no null
    const [impuestos, setImpuestos] = useState<number>(0); // Iniciar con 0, no null
    const [carrito, setCarrito] = useState<CarritoItem[]>([]);
    const [correo, setCorreo] = useState('');
    const [selectedDepartamento, setSelectedDepartamento] = useState('');
    const [ciudades, setCiudades] = useState<{ ID_CIUDAD: number; CIUDAD: string }[]>([]);
    const [selectedCiudad, setSelectedCiudad] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [envio, setEnvio] = useState<number>(0);
    const [direccionError, setDireccionError] = useState<string>('');
    const [ciudadError, setCiudadError] = useState<string>('');
    const [telefonoError, setTelefonoError] = useState<string>(''); 
    const [idFactura, setIdFactura] = useState<number | null>(null);
    const [total, setTotal] = useState<number | string>('No disponible');
    const [envioGuardado, setEnvioGuardado] = useState<boolean>(false);


    const handleBackClick = () => {
        router.back();
    };

    useEffect(() => {
        const storedData = localStorage.getItem('loginResponse');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setCorreo(parsedData.query_result.CORREO); 
        }
    }, []);

    useEffect(() => {
        const storedData = localStorage.getItem('facturaId');
        if (storedData) {
            setIdFactura(Number(storedData)); // Usamos el id de factura de localStorage
        }
    }, []);

    useEffect(() => {
        if (correo) {
            const fetchCarrito = async () => {
                try {
                    const response = await fetch(`https://deploybackenddiancrochet.onrender.com/factura/carrito/${correo}`);
                    const data = await response.json();
                    // console.log('Datos del carrito:', data);
                    setCarrito(data.carrito);
                } catch (error) {
                    console.error('Error al obtener el carrito:', error);
                }
            };

            fetchCarrito();
        }
    }, [correo]);

    // Función para obtener el subtotal e impuestos
    const fetchSubtotal = async () => {
        try {
            const response = await fetch('https://deploybackenddiancrochet.onrender.com/factura/carrito/subtotal', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo })  // Enviando el correo al backend
            });
    
            if (response.ok) {
                const data = await response.json();
                // console.log('Subtotal e impuestos recibidos:', data); // Verifica la respuesta del backend
                setSubtotal(data.subtotal);
                setImpuestos(data.impuesto);
            } else {
                console.error('Error al obtener el subtotal e impuestos desde el backend');
            }
        } catch (error) {
            console.error('Error al intentar obtener el subtotal e impuestos:', error);
        }
    };
    useEffect(() => {
        if (correo) {
            fetchSubtotal();  // Llama a fetchSubtotal cuando el correo esté disponible
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [correo]);  // Dependencia en correo
    

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


    // Fetch ciudades cuando cambia el departamento seleccionado
    useEffect(() => {
        const fetchCiudades = async () => {
            if (selectedDepartamento) {
                try {
                    const response = await axios.get(`https://deploybackenddiancrochet.onrender.com/factura/ciudad/${selectedDepartamento}`);
                    setCiudades(response.data.Ciudades);
                } catch (error) {
                    console.error("Error al obtener las ciudades:", error);
                }
            } else {
                setCiudades([]);
            }
        };

        fetchCiudades();
    }, [selectedDepartamento]);

    // Component to select department
    const DepartmentSelect = () => {
        const [departments, setDepartments] = useState<Departamento[]>([]);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const fetchDepartments = async () => {
                try {
                    const response = await axios.get('https://deploybackenddiancrochet.onrender.com/factura/departamentos');
                    setDepartments(response.data.Departamentos);
                    setLoading(false);
                } catch (error) {
                    // Manejo del error: solo dejamos que el estado 'loading' se quede como 'false'
                    console.error('Error fetching departments:', error);
                    setLoading(false);
                }
            };
    
            fetchDepartments();
        }, []);
    
        if (loading) return <p className="text-gray-400">Cargando...</p>;

        
        return (
            <select
                name="depto"
                id="depto"
                aria-label="depto"
                className="rounded-md  bg-gray-300 border-none h-12 font-lekton text-gray-700"
                onChange={(e) => setSelectedDepartamento(e.target.value)}
                value={selectedDepartamento}
            >
                <option value="" disabled>Elegir departamento</option>
                {departments.map((dept) => (
                    <option key={dept.ID_DEPARTAMENTO} value={dept.ID_DEPARTAMENTO}>
                        {dept.DEPARTAMENTO}
                    </option>
                ))}
            </select>
        );
    };
     

    const handleSaveShipping = async () => {
        let isValid = true;
   
        // Validación de los campos
        if (!direccion) {
            setDireccionError('Por favor, ingresa una direccion');
            isValid = false;
        } else {
            setDireccionError('');
        }
   
        if (!selectedCiudad) {
            setCiudadError('Por favor, selecciona una ciudad');
            isValid = false;
        } else {
            setCiudadError('');
        }
   
        if (!telefono) {
            setTelefonoError('Por favor, ingresa un número de telefono');
            isValid = false;
        } else {
            setTelefonoError('');
        }
   
        if (!isValid) return;
   
        if (!idFactura) {
            console.error('El id de la factura no está disponible');
            return;
        }
   
        try {
            const response = await axios.post('https://deploybackenddiancrochet.onrender.com/factura/envio', {
                id_factura: idFactura,
                direccion,
                id_ciudad: selectedCiudad,
                numero: telefono
            });
   
            // console.log('Respuesta del servidor:', response);
   
            if (response.status === 201) {
                setEnvioGuardado(true); // Marca el envío como guardado
                const envioData = response.data.envio;
                const envio = envioData?.envio ?? 0;
                const total = envioData?.total ?? 'No disponible'; // Aquí obtienes el total desde la respuesta
   
                setEnvio(envio);  // Asignamos el valor de 'envio' al estado
                setTotal(total);  // Aquí asignas el valor de 'total' al estado
   
                // console.log('Envio:', envio);
                // console.log('Total:', total);
            } else {
                console.error('Error al guardar el envío:', response);
                alert('Hubo un error al procesar el envío');
            }
   
        } catch (error) {
            console.error('Error al guardar el envío:', error);
            if (axios.isAxiosError(error)) {
                console.error('Detalles del error:', error.response?.data);
            }
            alert('Hubo un error al procesar el envío');
        }
    };   
    

    //Formatear el numero de telefono para que no tenga espacios
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
    
        // Eliminar todos los caracteres no numéricos
        value = value.replace(/\D/g, '');
    
        // Insertar guiones después de cada bloque de 4 dígitos
        if (value.length > 4) {
            value = value.slice(0, 4) + '-' + value.slice(4, 8);
        }
    
        setTelefono(value); // Actualiza el estado con el número formateado
    };

    // Función para manejar el pago
        const handlePayment = async () => {
            if (!idFactura || total === 'No disponible' || typeof total === 'string') {
                console.error('No se puede procesar el pago: falta el ID de la factura o el total no está disponible.');
                alert('Hubo un problema al iniciar el pago. Por favor, revisa la información e inténtalo de nuevo.');
                return;
            }
        
            try {
                const response = await axios.post<PayPalResponse>('https://deploybackenddiancrochet.onrender.com/pago/crear', {
                    total_pago: Number(total), // Convertir el total a número si es necesario
                    id_factura: idFactura,
                });
        
                const data = response.data;
                const approvalLink = data?.data?.links.find((link) => link.rel === "approve")?.href;
        
                if (approvalLink) {
                    window.location.href = approvalLink; // Redirigir al enlace de aprobación de PayPal
                } else {
                    console.error('No se encontró el enlace de aprobación en la respuesta:', data);
                    alert('No se pudo iniciar el pago. Intenta de nuevo más tarde.');
                }
            } catch (error) {
                console.error('Error al procesar el pago:', error);
                alert('Hubo un error al procesar el pago.');
            }
        };
    

    
    return (
        <div className="flex justify-between font-koulen w-full p-8  lg:flex-row flex-col">
            <div title="detalle envio" className="m-2 p-2 rounded-md bg-gray-200 lg:w-[65%] w-full flex-grow py-5 sm:px-40 ">
            <div id="header" className="text-gray-700 flex flex-row flex-nowrap justify-center items-baseline content-stretch">
                    <div><h4 className="m-2 flex flex-row flex-nowrap justify-start items-baseline content-stretch text-purple-400">Resumen <IoRemoveOutline className="ml-2"/> <FaCheckCircle className="text-purple-800" /> <IoRemoveOutline /></h4></div>
                    <div>
                        <h4 className="m-2 flex flex-row flex-nowrap justify-start items-baseline content-stretch text-purple-400">
                            Envio 
                            <IoRemoveOutline className="ml-2"/> 
                            <FaCheckCircle className={`text-${envioGuardado ? 'purple-800' : 'gray-800'}`} /> 
                            <IoRemoveOutline />
                        </h4>
                    </div>
                    <div><h4 className="m-2 flex flex-row flex-nowrap justify-start items-baseline content-stretch">Pago <IoRemoveOutline className="ml-2"/> <FaCheckCircle className="text-gray-800" /> <IoRemoveOutline /></h4></div>
                </div>

                <h1 className="text-2xl text-gray-900 pb-5">Detalles de envio</h1>

                <div className="flex flex-col flex-nowrap justify-start items-stretch content-stretch mb-5">
                    <h1 className="text-gray-900">Direccion</h1>
                    <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Escribe direccion"
                        className="rounded-md bg-gray-300 border-none h-12 font-lekton text-gray-700"
                    />
                    {direccionError && <p className="text-red-500 text-sm mt-1 flex flex-row flex-nowrap justify-start items-stretch content-stretch"><RiErrorWarningFill className="mr-1" />{direccionError}</p>}
                </div>

                <div className="flex flex-col flex-nowrap justify-start items-stretch content-stretch mb-5">
                    <h1 className="text-gray-900">Departamento</h1>
                    <DepartmentSelect />
                </div>

                    <div className="flex flex-col flex-nowrap justify-start items-stretch content-stretch mb-5">
                        <h1 className="text-gray-900">Ciudad</h1>
                        <select
                            aria-label="ciudad"
                            className="rounded-md bg-gray-300 border-none h-12 font-lekton text-gray-700 w-full"
                            value={selectedCiudad} // Aquí usamos el valor del estado
                            onChange={(e) => setSelectedCiudad(e.target.value)} // Actualiza el estado al seleccionar
                        >
                            <option value="" disabled>Elegir ciudad</option>
                            {ciudades.map((ciudad) => (
                                <option key={ciudad.ID_CIUDAD} value={ciudad.ID_CIUDAD}>
                                    {ciudad.CIUDAD}
                                </option>
                            ))}
                        </select>
                        {ciudadError && <p className="text-red-500 text-sm mt-1 flex flex-row flex-nowrap justify-start items-stretch content-stretch"><RiErrorWarningFill className="mr-1" />{ciudadError}</p>}
                    </div>

                <div className="mb-5">
                    <h1 className="text-gray-900">Numero</h1>
                    <input
                        type="tel" // Cambiar a "tel" para mejor compatibilidad con números
                        value={telefono}
                        onChange={handlePhoneChange} // Solo llamar a handlePhoneChange aquí
                        placeholder="Ingresa tu teléfono"
                        className="rounded-md bg-gray-300 border-none h-12 font-lekton text-gray-700"
                    />
                    {telefonoError && <p className="text-red-500 text-sm mt-1 flex flex-row flex-nowrap justify-start items-stretch content-stretch"><RiErrorWarningFill className="mr-1" />{telefonoError}</p>}
                </div>

                <button onClick={handleBackClick} className="text-gray-800 p-4 flex items-center transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-md">
                    <FaAngleLeft className="mr-1"/> Volver
                </button>
            </div>

            <div title="Resumen orden" className="m-2 p-10 rounded-md lg:w-[35%] w-full bg-gray-200 flex flex-col flex-nowrap justify-between items-stretch content-stretch">
            <div id="hd1" className="flex flex-row flex-nowrap justify-between items-start content-start">
                 <div id="orden" className=" text-gray-800">
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
                        <Image alt="paypal" src="/img/paypal-logo-0.png" width={100} height={100} />
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
                    <div id="orden" className="text-gray-800">
                        <h2 className="mb-3">Subtotal</h2>
                        <h2 className="mb-3">Impuestos</h2>
                        <h2 className="mb-3">Envio</h2>
                        <h2 className="mb-3">Total</h2>
                    </div>
                    <div id="pago" className="text-gray-800">
                        <h3 className="mb-3" id="subtotal">L. {carrito.length === 0 ? "0.00" : subtotal.toFixed(2)}</h3>
                        <h3 className="mb-3" id="impuestos">L. {carrito.length === 0 ? "0.00" : impuestos.toFixed(2)}</h3>
                        <h3 className="mb-3">L. {envio && !isNaN(envio) ? envio.toFixed(2) : "0.00"}</h3>
                        <h3 className="mb-3" id="total">
                            L. {total === '00.00' ? total : (subtotal + impuestos + (envio && !isNaN(envio) ? envio : 0)).toFixed(2)}
                        </h3>
                    </div>
                 </div>

                <div className="flex justify-end">
                    <button onClick={handleSaveShipping} className="whitespace-nowrap bg-purple-400 py-4 px-9 rounded-md mr-5">Guardar envio</button>
                    <button title="decline" type="button" onClick={handlePayment} className="sm:mr-8 text-gray-800 p-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-5px] rounded-md">Pagar</button>
                </div>
            </div>
        </div>
    );
}
