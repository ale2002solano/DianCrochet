"use client";
import { useEffect, useState } from "react";
import Factura from "./Factura";
import OrdenamientoFacturas from "./Ordenamiento";
import FacturaFull from "./FacturaFull";
import { getFacturas } from "@services/User/user";
import { Bill } from "@interfaces/bill";
import LoadingSpinner from "../../../checkout/components/loadding/LoadingSpinner";
import { useRouter } from 'next/navigation';
export default function Historial() {
  const router = useRouter();
  const [showOrder, setShowOrder] = useState(false);
  const [ordenamiento, setOrdenamiento] = useState("FECHA_FACT");
  const [orden, setOrden] = useState("DESC");
  const [openFactura, setOpenFactura] = useState(false);
  const [idFactura, setIdFactura] = useState(0);

  const handleOrder = () => {
    setShowOrder(!showOrder);
  };

  const handleOpenBill = (id:number) => {
    setIdFactura(id);
    setOpenFactura(!openFactura);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [facturas, setFacturas] = useState<Bill[]>([]);

  useEffect(() => {
    const storedResponse = localStorage.getItem('loginResponse');

    if (storedResponse) {
      const parsedResponse = JSON.parse(storedResponse);
      const userCorreo = parsedResponse?.query_result?.CORREO || '';

      if (userCorreo) {
        // console.log(userCorreo)
        const fetchGets = async () => {
          setIsLoading(true); // Activa la carga antes de la solicitud
          try {
            const res = await getFacturas(userCorreo,ordenamiento, orden); // Llama a la función para obtener las facturas
            setFacturas(res.FacturasUsuario);
            // console.log(res) // Actualiza el estado con el resultado
          } catch (error) {
            console.error("Error al traer facturas:", error);
          } finally {
            setIsLoading(false); // Desactiva la carga cuando la solicitud termina
          }
        };

        fetchGets();
      } else {
        router.push('/auth/sign-in'); // Redirige si el correo no está presente
      }
    } else {
      router.push('/auth/sign-in'); // Redirige si no hay respuesta guardada
    }
  }, [orden, ordenamiento, router]);
  
  

  return (
    <div className="flex h-full mt-20 sm:mt-1 w-full flex-col">
      <div className=" mt-2 sm:mt-20 flex h-24 select-none items-center pl-[2%] sm:pl-[5%]">
        <h1 className="font-koulen text-2xl sm:text-[#424242] text-purple-500">
          HISTORIAL DE COMPRAS
        </h1>
        <div className="absolute right-[5%] ml-6 flex cursor-pointer select-none items-center font-lekton text-lg text-[#444343]">
          <h2 onClick={handleOrder}>Ordenar por:</h2>
          <svg
            onClick={handleOrder}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.1}
            stroke="currentColor"
            className={`size-5 transition-all duration-300 ease-linear ${showOrder ? "rotate-180 transform" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>

          <div className="absolute right-[2.5%] top-7 w-[180%]">
            <OrdenamientoFacturas
              open={showOrder}
              setOpen={setShowOrder}
              setOrdenamiento={setOrdenamiento}
              setAscendente={setOrden}
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section className="flex-1 mb-[18%] sm:mb-0 overflow-y-auto">
          {facturas.map((factura) => (
            <div
              key={factura.id_factura}
              onClick={()=>handleOpenBill(factura.id_factura)}
              className="my-3 ml-[5%] h-28 lg:w-9/12 w-[85%]"
            >
              <Factura 
              codigo={factura.codigo_fact}
              productos={factura.productos}
              total={factura.total}
              fecha={factura.fecha_fact}/>
            </div>
          ))}
        </section>
      )}

      {openFactura && (
        <FacturaFull
          open={openFactura}
          setOpen={setOpenFactura}
          idFactura={idFactura}
        />
      )}
    </div>
  );
}
