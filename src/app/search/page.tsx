"use client";
import Product from "./components/Product";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../checkout/components/loadding/LoadingSpinner";
import { ProductoSearch } from "@interfaces/product";
import { search } from "@services/product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Categorias from "./components/categories";

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || ""; // Obtener la búsqueda desde la URL

  const [productos, setProductos] = useState<ProductoSearch[]>([]);
  const [productsSplit, setProductsSplit] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<number[]>([]);

  useEffect(() => {
      handleSendCategories(categories);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const handleSendCategories = async (updatedCategories: number[]) => {
    try {
      // setIsLoading(true);
      // const res = await search("hola", null);
      // setPageNumber(1);
      // setProductsSplit(0);
      // setIsLoading(false); // Llama a la función para obtener los productos filtrados
      // setProductos(res);
      //console.log("Enviando: ", filteredData); // Asegúrate de que envías los datos correctos
      // console.log("Recibiendo: ", res); // Imprime los resultados de los productos filtrados
      // setProductos(res); // Actualiza el estado con los nuevos productos
    } catch (error) {
      console.error("Error al traer productos:", error);
    }
  };

  const deleteFilters = () => {
    setCategories([])
    setPageNumber(1);
  }

  const handleToggleCategories = () => {
    setShowCategories((prev) => !prev);
  };


  // Manejar el cambio de página
  const handlePageNumber = (index: number) => {
    setPageNumber(index);
    setProductsSplit((index - 1) * 16);
    if (productsSplit !== (index - 1) * 16) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSplitNext = () => {
    if (productos.length >= productsSplit + 16) {
      setProductsSplit(productsSplit + 16);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setPageNumber(pageNumber + 1);
    }
  };

  const handleSplitPrev = () => {
    if (productsSplit - 16 >= 0) {
      setProductsSplit(productsSplit - 16);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setPageNumber(pageNumber - 1);
    }
  };

  const handleProductClick = (id: number) => {
    router.push(`/product_detail/${id}`);
  };

  const totalProducts = productos.length;
  const pagesNumber = Math.ceil(totalProducts / 16);
  const divNumbers = Array.from({ length: pagesNumber }, (_, i) => i + 1);

  // Cargar productos al montar el componente o cuando cambie el término de búsqueda
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        let res;
        if (searchQuery) {
          // Si hay un término de búsqueda, llama al endpoint de búsqueda
          res = await search(searchQuery, null);
          setProductos(res);
          console.log(productos)
          setProductsSplit(0); // Reinicia la división
          setPageNumber(1); // Reinicia la página actual
        } else {

        }

      } catch (error) {
        console.error("Error al traer productos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [searchQuery]);

  return (
    <div>   
      <div className="h-20 sm:h-24 bg-white"></div>
      <section className="bg-white">
        <div className="flex h-20 items-center">
          <h1 className="pl-6 font-koulen text-5xl text-gray-900">Resultados</h1>
          <Image
            src="/img/girasol.svg"
            alt="Crochet Flower"
            width={40}
            height={40}
            className="pointer-events-none ml-3 mix-blend-multiply"
          />
          <Image
            src="/img/girasol.svg"
            alt="Crochet Flower"
            width={15}
            height={15}
            className="pointer-events-none ml-2 mt-4 mix-blend-multiply"
          />
        </div>
        {(productos.length == 0)? (""):(
                  <div className="sm:-mt-4 flex sm:h-32 h-44 flex-col-reverse">

                  <div className="relative mb-3 flex flex-col sm:flex-row sm:h-9 w-full sm:mt-0 mt-3 sm:items-center pl-0 sm:pl-6 ">
                    <h2 className="font-lekton text-lg text-[#444343] hidden sm:block">Filtros :</h2>
        
                    <div className="relative  ml-6 flex cursor-pointer items-center font-lekton text-lg text-[#444343]">
                      <h2 onClick={handleToggleCategories}>Categorias</h2>
                      <svg
                        onClick={handleToggleCategories}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.1}
                        stroke="currentColor"
                        className={`size-5 transition-all duration-300 ease-linear ${showCategories ? "rotate-180 transform" : ""}`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
        
                      <div className="absolute top-7 sm:right-0 right-2">
                        <Categorias
                          open={showCategories}
                          setOpen={setShowCategories}
                          categories={categories}
                          setCategories={setCategories}
                        />
                      </div>
                    </div>
        
                  </div>
                </div>
        )}



        <section className="relative px-[8.32%] sm:py-12 py-3 h-full w-full min-h-[59vh] sm:min-[30vh]:">
          {isLoading ? (
            <div className="ml-0 h-96 bg-white opacity-50">
              <LoadingSpinner />{" "}
            </div>
          ) : (
            (productos.length == 0) ? (
            <div className="relative ml-0 h-96 flex items-center justify-center -mt-14 flex-col">
              <h2 className="font-lekton text-slate-600 text-3xl text-center">No se encontraron resultados</h2>
              <FontAwesomeIcon className="absolute size-12 icon-rotate top-2/3" icon={faMagnifyingGlass} style={{color: "#B197FC"}} />
            </div>):
            (
              <div className="grid select-none sm:grid-cols-3 md:grid-cols-4 gap-6 grid-cols-2">
              {productos
                .slice(productsSplit, productsSplit + 16)
                .map((producto) => (
                  <div
                    key={producto.id_producto}
                    className=" w-[100%] md:max-h-[260px] sm:h-[30vh] xl:h-[60vh] h-[30vh] xl:max-h-[470px] cursor-pointer text-center"
                    onClick={() => handleProductClick(producto.id_producto)}
                  >
                    <Product
                      nombre={producto.nombre_prod}
                      precio={`L${producto.precio_venta.toFixed(2)}`}
                      imagen={
                        producto.url != null
                          ? producto.url
                          : "https://ik.imagekit.io/diancrochet/Fotos/GORROCUERNOS.jpg?updatedAt=1728867304044"
                      }
                    />
                  </div>
                ))}
            </div>
            )

          )}

        </section>

        <div className="flex h-20 items-start sm:justify-end px-[8.32%]">
        {productos.length==0 ? (""): (
                    <div className="flex h-2/3">
            
                    <button
                      onClick={handleSplitPrev}
                      type="button"
                      className="mb-2 sm:me-2 flex h-full sm:w-20 w-[15%] items-center justify-center bg-slate-300 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 ease-in hover:bg-violet-300 focus:outline-none focus:ring-4 focus:ring-transparent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                      </svg>
                    </button>
                    <div className="flex h-full items-center justify-evenly bg-slate-50 px-1">
                      {divNumbers.map((number) =>
                        divNumbers.length > 4 ? (
                          pageNumber > 2 ? (
                            number == divNumbers.length - 1 &&
                            number != pageNumber + 1 &&
                            number != pageNumber ? (
                              <div key={number} className="mx-1 flex h-7 w-9 items-end justify-center font-lekton text-lg text-blue-400">
                                ...
                              </div>
                            ) : number == divNumbers.length && number != pageNumber ? (
                              <div
                                key={number}
                                onClick={() => handlePageNumber(number)}
                                className={`mx-1 flex h-7 w-7 items-center justify-center border pt-1 font-lekton text-lg ${
                                  pageNumber === number
                                    ? "bg-violet-300 text-white" // Estilos cuando pageNumber coincide con number
                                    : "bg-slate-300 text-white hover:bg-violet-300 hover:text-white" // Estilos por defecto
                                }`}
                              >
                                {number}
                              </div>
                            ) : number >= pageNumber - 1 && number <= pageNumber + 1 ? (
                              <div
                                key={number}
                                onClick={() => handlePageNumber(number)}
                                className={`mx-1 flex h-7 w-7 items-center justify-center border pt-1 font-lekton text-lg ${
                                  pageNumber === number
                                    ? "bg-violet-300 text-white" // Estilos cuando pageNumber coincide con number
                                    : "bg-slate-300 text-white hover:bg-violet-300 hover:text-white" // Estilos por defecto
                                }`}
                              >
                                {number}
                              </div>
                            ) : (
                              ""
                            )
                          ) : number == divNumbers.length - 1 ? (
                            <div key={number} className="mx-1 flex h-7 w-9 items-end justify-center font-lekton text-lg text-blue-400">
                              ...
                            </div>
                          ) : number == divNumbers.length ? (
                            <div
                              key={number}
                              onClick={() => handlePageNumber(number)}
                              className={`mx-1 flex h-7 w-7 items-center justify-center border pt-1 font-lekton text-lg ${
                                pageNumber === number
                                  ? "bg-violet-300 text-white" // Estilos cuando pageNumber coincide con number
                                  : "bg-slate-300 text-white hover:bg-violet-300 hover:text-white" // Estilos por defecto
                              }`}
                            >
                              {number}
                            </div>
                          ) : number <= 3 ? (
                            <div
                              key={number}
                              onClick={() => handlePageNumber(number)}
                              className={`mx-1 flex h-7 w-7 items-center justify-center border pt-1 font-lekton text-lg ${
                                pageNumber === number
                                  ? "bg-violet-300 text-white" // Estilos cuando pageNumber coincide con number
                                  : "bg-slate-300 text-white hover:bg-violet-300 hover:text-white" // Estilos por defecto
                              }`}
                            >
                              {number}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <div
                            key={number}
                            onClick={() => handlePageNumber(number)}
                            className={`mx-1 flex h-7 w-7 items-center justify-center border pt-1 font-lekton text-lg ${
                              pageNumber === number
                                ? "bg-violet-300 text-white" // Estilos cuando pageNumber coincide con number
                                : "bg-slate-300 text-white hover:bg-violet-300 hover:text-white" // Estilos por defecto
                            }`}
                          >
                            {number}
                          </div>
                        ),
                      )}
                    </div>
                    <button
                      onClick={handleSplitNext}
                      type="button"
                      className="mb-2 sm:me-2 flex h-full sm:w-20 w-[15%] items-center justify-center bg-slate-300 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 ease-in hover:bg-violet-300 hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-transparent dark:focus:ring-transparent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        className="size-6 -scale-x-90"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                      </svg>
                    </button>
                  </div>
        )}

        </div>
      </section>
      
    </div>
  );
}
