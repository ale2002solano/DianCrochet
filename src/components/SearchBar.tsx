import { search } from '@services/product';
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    try {
      const productos = await search(searchTerm, null); // Llamada a searchProducts
      console.log("Productos encontrados:", productos); // Manejo de resultados
    } catch (error) {
      console.error("Error al buscar productos:", error); // Manejo de errores
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm} // Controla el estado del input
        onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado al escribir
        onKeyDown={handleKeyDown} // Detecta la tecla presionada
        className="w-full bg-transparent border-none text-gray-600 focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-none"
      />
      <button title="buscar" onClick={handleSearch}> {/* Llama a handleSearch al hacer clic */}
        <FaSearch className="text-purple-500" />
      </button>
    </>
  );
}
