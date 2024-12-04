"use client"
import { useState } from "react";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú

  return (
    <div className="">
    <nav className="bg-blue-600 text-white p-4">
      {/* Contenedor principal */}
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Mi Sitio</h1>

        {/* Botón hamburguesa */}
        <button
          className="block sm:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)} // Alternar estado
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Menú desplegable (solo para pantallas pequeñas) */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } flex flex-col space-y-2 mt-4 sm:hidden`}
      >
        <a href="#inicio" className="px-3 py-2 rounded hover:bg-blue-700">
          Inicio
        </a>
        <a href="#sobre-nosotros" className="px-3 py-2 rounded hover:bg-blue-700">
          Sobre Nosotros
        </a>
        <a href="#servicios" className="px-3 py-2 rounded hover:bg-blue-700">
          Servicios
        </a>
        <a href="#contacto" className="px-3 py-2 rounded hover:bg-blue-700">
          Contacto
        </a>
      </div>
    </nav>
    </div>
  );
}
