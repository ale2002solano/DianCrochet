"use client";
import Product from "./components/Product";
import Image from "next/legacy/image";
import { Suspense, useEffect, useState } from "react";
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

  const handleToggleCategories = () => {
    setShowCategories((prev) => !prev);
  };

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

  useEffect(() => {
    setCategories([]);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const categoryFilter = categories.length > 0 ? categories : null;
        const res = await search(searchQuery, null, categoryFilter);
        setProductos(res);
        setProductsSplit(0);
        setPageNumber(1);
      } catch (error) {
        console.error("Error al traer productos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [categories, searchQuery]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div>
        <div className="h-20 sm:h-24 bg-white"></div>
        <section className="bg-white">
          <div className="flex h-20 items-center">
            <h1 className="pl-6 font-koulen text-5xl text-gray-900">
              Resultados
            </h1>
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
          {productos.length === 0 && categories.length === 0 ? (
            ""
          ) : (
            <div className="sm:-mt-4 flex sm:h-32 h-20 flex-col-reverse">
              <div className="relative mb-3 flex flex-col sm:flex-row sm:h-9 w-full sm:mt-0 mt-3 sm:items-center pl-0 sm:pl-6 ">
                <h2 className="font-lekton text-lg text-[#444343] hidden sm:block">
                  Filtros :
                </h2>
                <div className="relative  ml-6 flex cursor-pointer items-center font-lekton text-lg text-[#444343]">
                  <h2 onClick={handleToggleCategories}>Categorias</h2>
                  <svg
                    onClick={handleToggleCategories}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.1}
                    stroke="currentColor"
                    className={`size-5 transition-all duration-300 ease-linear ${
                      showCategories ? "rotate-180 transform" : ""
                    }`}
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
                <LoadingSpinner />
              </div>
            ) : productos.length === 0 ? (
              <div className="relative ml-0 h-96 flex items-center justify-center -mt-14 flex-col">
                <h2 className="font-lekton text-slate-600 text-3xl text-center">
                  No se encontraron resultados
                </h2>
                <FontAwesomeIcon
                  className="absolute size-12 icon-rotate top-2/3"
                  icon={faMagnifyingGlass}
                  style={{ color: "#B197FC" }}
                />
              </div>
            ) : (
              <div className="grid select-none sm:grid-cols-3 md:grid-cols-4 gap-6 grid-cols-2">
                {productos
                  .slice(productsSplit, productsSplit + 16)
                  .map((producto) => (
                    <div
                      key={producto.id_producto}
                      className="w-[100%] md:max-h-[260px] sm:h-[30vh] xl:h-[60vh] h-[30vh] xl:max-h-[470px] cursor-pointer text-center"
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
            )}
          </section>
        </section>
      </div>
    </Suspense>
  );
}
