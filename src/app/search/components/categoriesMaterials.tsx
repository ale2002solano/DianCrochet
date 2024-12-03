'use client';
import { Categories } from "@interfaces/product";
import { getCategoriesMaterials } from "@services/product";
import { useRef, useState, useEffect } from "react";

interface CategoriesProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
}

export default function CategoriasMateriales({ open, setOpen, categories, setCategories }: CategoriesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [categoriasOptions, setCategoriasOptions] = useState<Categories[]>([]);

  // Obtener categorías una sola vez al cargar el componente
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await getCategoriesMaterials();
        setCategoriasOptions(res);
      } catch (error) {
        console.error("Error al traer categorias:", error);
      }
    }
    fetchCategorias();
  }, []);

  const handleChange = (category: string) => {
    // Actualiza las categorías seleccionadas y propágalo al componente padre inmediatamente
    const updatedCategories = categories.includes(category)
      ? categories.filter((item) => item !== category)
      : [...categories, category];
    
    setCategories(updatedCategories); // Propagamos el cambio al componente padre inmediatamente
    console.log("actualizando categories:", categories)
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false); // Cierra el componente si se hace clic fuera
    }
  };

  // Manejo de eventos de clic para cerrar el componente al hacer clic fuera
  useEffect(() => {
    if (open) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    open ? (
      <div
        ref={ref}
        className="z-30 select-none absolute flex flex-col rounded-lg bg-slate-50 p-2 shadow-2xl shadow-slate-900 drop-shadow-lg"
      >
        {categoriasOptions.map((category) => (
          <div key={category.ID_CATEGORIA} className="mb-[2px] flex items-center whitespace-nowrap">
            <input
              id={`${category.ID_CATEGORIA}`}
              type="checkbox"
              value={`${category.CATEGORIA}`}
              className="select-none h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-transparent"
              checked={categories.includes(category.CATEGORIA)} // Se usa el estado directamente del padre
              onChange={() => handleChange(category.CATEGORIA)}
            />
            <label
              htmlFor={`${category.ID_CATEGORIA}`}
              className="select-none ms-2 mt-[2px] font-lekton text-base font-medium text-[#444343]"
            >
              {category.CATEGORIA}
            </label>
          </div>
        ))}
      </div>
    ) : null
  );
}
