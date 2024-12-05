interface FacturaProps {
    codigo: string;
    productos: string;
    fecha: string;
    total: number;
}

export default function Factura({ codigo, productos, fecha, total }: Readonly<FacturaProps>){
    return (
        <div className="select-none h-full ml-4 flex-col sm:flex-row w-full flex p-3 px-8 shadow-[0px_0px_5px_1px_#a7a7a7] rounded-xl">
            <div className="w-5/6 h-[10%] sm:h-full flex flex-col">
                <div className="flex ">
                    <div className="hidden sm:block mr-2"><h2 className="font-koulen text-2xl text-[#424242]">Compra</h2></div>
                    <div className="sm:w-full"><h2 className="font-koulen text-2xl text-[#424242]">#{codigo}</h2></div>
                </div>
                <div className="hidden sm:block w-full h-2/5 overflow-hidden pr-3"><h3 className="font-robotoMono text-[#727171]">{productos}</h3></div>
            </div>

            <div className="sm:w-[37%] w-full h-[10%] mt-11 sm:mt-0 sm:h-full flex flex-row sm:flex-col justify-between sm:justify-evenly sm:pl-2">
                <div><h1 className="sm:font-roboto mr-2 text-xl lg:text-2xl text-[#4b4a4a]">{Math.floor(total)} Lps</h1></div>
                <div><h3 className="sm:font-roboto text-xl text-[#4b4a4a]">{fecha}</h3></div>
            </div>
        </div>
    )
}