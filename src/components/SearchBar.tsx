"use client";
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { useRouter } from "next/navigation";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim(); // Elimina espacios al inicio y al final
    if (trimmedSearchTerm) {
      // Redirige a la página de resultados de búsqueda con la cadena procesada
      router.push(`/search?query=${encodeURIComponent(trimmedSearchTerm)}`);
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
