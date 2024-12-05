"use client";
import { useEffect, useState } from "react";
import OrdenamientoVideos from "./Ordenamiento";
import Kit from './Kit'
import {getKitsUsuario} from '@services/User/user'
import {kits} from '@interfaces/kits'
import LoadingSpinner from "../../../checkout/components/loadding/LoadingSpinner";
import { useRouter } from 'next/navigation';
export default function MyKits(){
    const router = useRouter();
    const [showOrder, setShowOrder] = useState(false);
    const [ordenamiento, setOrdenamiento] = useState("nombre_prod")
    const [orden, setOrden] = useState("asc");

    const handleOrder = () => {
        setShowOrder(!showOrder);
    };

    const [isLoading, setIsLoading] = useState(true);
    const [mykits, SetMyKits] = useState<kits[]>([])

    useEffect(() => {
        const storedResponse = localStorage.getItem('loginResponse');
    
        if (storedResponse) {
            const parsedResponse = JSON.parse(storedResponse);
            const userCorreo = parsedResponse?.query_result?.CORREO || '';
    
        if (userCorreo) {
            const fetchGets = async () => {
              setIsLoading(true); // Activa la carga antes de la solicitud
            try {
                const res = await getKitsUsuario(userCorreo, ordenamiento, orden); // Llama a la función para obtener los videos
                SetMyKits(res.kitsDelUsuario);
                // console.log(res); // Actualiza el estado con el resultado
            }catch (error) {
                console.log("ordenamiento ", ordenamiento, "\n orden ", orden);
                console.error("Error al traer kits:", error);
                }finally{
                setIsLoading(false); // Desactiva la carga cuando la solicitud termina
            }
        };
    
        fetchGets();
        }else{
            router.push('/auth/sign-in'); // Redirige si el correo no está presente
            }
        } else {
          router.push('/auth/sign-in'); // Redirige si no hay respuesta guardada
        }
    }, [ordenamiento, orden, router]);

    return (
        <div className="flex h-full w-full flex-col">
            <div className="mt-20 flex h-24 select-none items-center pl-[5%]">
                <h1 className="font-koulen text-2xl text-[#424242]">MIS KITS </h1>
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
                <OrdenamientoVideos
                    open={showOrder}
                    setOpen={setShowOrder}
                    setOrdenamiento={setOrdenamiento}
                    setAscendente={setOrden}
                />
            </div>
            </div>
            </div>
            {isLoading?(
            <LoadingSpinner/>
        ):(
            <section className="px-[5%] flex-1 overflow-y-auto grid select-none grid-cols-3 gap-3">
            {mykits.map((kit, index)=>(
            <div key={index} className="h-[203px] w-[270px]">
            <Kit
            nombre={kit.NOMBRE_PROD}
            pdf={kit.URL_PDF}
            imagen={kit.URL_IMG}
            />
        </div>
                ))}        
                </section>
            )}
    
        </div>
    );
}
