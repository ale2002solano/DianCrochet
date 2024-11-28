import { FullBill } from "@interfaces/bill";
import { getFacturaFull } from "@services/bills";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../../../checkout/components/loadding/LoadingSpinner";

interface FacturaProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  idFactura: number;
}

export default function FacturaFull({
  open,
  setOpen,
  idFactura,
}: FacturaProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [factura, setFactura] = useState<FullBill[]>([]);
  useEffect(() => {
    async function fetchGets() {
      try {
        const res = await getFacturaFull(idFactura); // Llama a la función para obtener los facturas
        setFactura(res.DetalleProducto);
        console.log("factura full:", res);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al traer facturas:", error);
      }
    }
    fetchGets();
  }, [idFactura]);

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false); // Cierra el componente si se hace clic fuera
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    setOpen(false); // Cierra el componente al hacer clic en la X
  };

  return (
    <div className="absolute left-0 top-0 h-screen w-screen bg-[#19181877]">
      {isLoading ? (
        <div
          ref={ref}
          className="absolute bottom-0 left-[31.5%] z-20 flex h-5/6 w-[37%] flex-col bg-slate-50"
        >
          <LoadingSpinner />
        </div>
      ) : (
        <div
          ref={ref}
          className="absolute bottom-0 left-[31.5%] z-20 flex h-5/6 w-[37%] flex-col bg-slate-50"
        >
          <div className="flex h-10 w-full flex-row-reverse pl-5 pr-2 pt-2">
            <svg
              onClick={handleClose} // Añade el evento de clic aquí
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-7 cursor-pointer text-slate-900" // Añade cursor-pointer para indicar que es clickeable
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="flex h-16 w-full select-none items-center justify-between pl-5 pr-7">
            <h2 className="font-koulen text-2xl text-[#424242]">
              Compra #{factura[0].codigo_fact}
            </h2>
            <div className="flex">
              <h3 className="font-roboto text-[#353535]">
                {factura[0].fecha_fact}
              </h3>
            </div>
          </div>

          <div className="w-full overflow-y-auto pl-5 pr-7">
            {factura.map((bill, index) => (
              <div key={index} className="flex w-full items-center">
                <h3 className="font-robotoMono text-[#727171]">
                  {bill.nombre_prod}
                </h3>
                <div className="mx-2 flex-grow border-t-2 border-dashed border-[#bdbdbd]" />
                <h3 className="font-robotoMono text-[#727171]">
                  {bill.precio_prod}LPS
                </h3>
              </div>
            ))}
          </div>

          <div className="bottom-0 mt-auto h-32 w-full pl-5 pr-7">
            <h2 className="flex w-2/3 ml-auto items-center justify-between font-roboto text-xl text-[#353535]">
              <span>SubTotal</span>
              <span>{factura[0].subtotal} Lps</span>
            </h2>
            <h2 className="flex w-2/3 ml-auto items-center justify-between font-roboto text-xl text-[#353535]">
              <span>Envío</span>
              <span>{factura[0].precio_envio} Lps</span>
            </h2>
            <h2 className="flex w-2/3 ml-auto items-center justify-between font-roboto text-xl text-[#353535]">
              <span>ISV 15%</span>
              <span>{factura[0].impuesto} Lps</span>
            </h2>
            <h2 className="flex w-2/3 ml-auto items-center justify-between font-roboto text-3xl text-[#353535]">
              <span>Total</span>
              <span>{factura[0].total} Lps</span>
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
