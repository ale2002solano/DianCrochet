import React, { useState, useEffect } from "react";
import { resetPwd } from "@services/UserAuth/user"; // Importa la función desde user.ts
import Modal from "../modals/Modal";
import { useRouter } from 'next/navigation';

export default function ResetPswForm() {
  const [correo, setCorreo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get("email");

      if (email) {
        setCorreo(email);
      } else {
        // Intentar obtener el correo del almacenamiento local si no está en la URL
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}') as { query_result?: { CORREO?: string } };
        const storedCorreo = loginResponse.query_result?.CORREO || '';

        if (storedCorreo) {
          setCorreo(storedCorreo);
        } else {
          console.error("Correo no encontrado en la URL ni en el almacenamiento local.");
        }
      }
    }
  }, []);
  
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        if (modalType === 1) {
          // console.log("Redirigiendo a la página de inicio de sesión");
          window.location.href = "/auth/sign-in"; // Redirigir a la página de inicio de sesión
        } else if (modalType === 3) {
          // console.log("Recargando la página");
          window.location.reload(); // Recargar la página
        }
      }, 1000); // Redirigir después de 1 segundo

      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [showModal, modalType]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      // console.log("Las contraseñas no coinciden");
      setModalTitle("Error");
      setModalMessage("Las contraseñas no coinciden");
      setModalType(3); // Tipo 3 para error
      setShowModal(true);
      return;
    }

    try {
      // console.log("Enviando solicitud para restablecer la contraseña");
      const response = await resetPwd(correo, password);
      // console.log("Respuesta de la API:", response);

      if (response.codigo == 1) {
        setModalTitle("Éxito");
        setModalMessage("Contraseña cambiada con éxito");
        setModalType(1);
      } else {
        setModalTitle("Ocurrió un error");
        setModalMessage(response.mensaje);
        setModalType(2);
      }
      setShowModal(true);
    } catch (error) {
      console.log("Error al restablecer la contraseña:", error);
      setModalTitle("Error");
      setModalMessage("Hubo un problema al restablecer la contraseña");
      setModalType(3);
      setShowModal(true);
    }
  };

  const GotoProfile = () => {
    router.push('/auth/sign-in');
  };

  const GotoPage = () => {
    router.push('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 h-[60.4%] w-[25.7%] rounded-3xl bg-white opacity-90 shadow-2xl p-6 min-w-[335px]">
      <div className="flex flex-col items-center">
        <h1 className="w-[88.1%] font-koulen text-3xl text-gray-800 mb-6">
          RESTABLECER CLAVE
        </h1>
        <h5 className="w-[70.1%] font-lekton text-l text-gray-600 font-normal mb-4">
          Ingrese una nueva clave
        </h5>
        <input
          id="pwdcontainer"
          className="w-[88.1%] h-[10.6%] rounded-2xl border border-gray-200 bg-white pl-3 pr-3 font-lekton text-gray-800 shadow-lg placeholder:font-lekton placeholder:text-gray-400 focus:outline-none mb-4"
          placeholder="contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          id="mailcontainer"
          className="w-[88.1%] h-[10.6%] rounded-2xl border border-gray-200 bg-white pl-3 pr-3 font-lekton text-gray-800 shadow-lg placeholder:font-lekton placeholder:text-gray-400 focus:outline-none mb-6"
          placeholder="confirmar contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="w-[56.61%] h-12 rounded-3xl bg-[#C68EFE] flex items-center justify-center">
          <h1
          onClick={GotoPage} className="font-koulen text-2xl text-white">
            ENVIAR 
          </h1>
        </button>
      </div>
      <div className="absolute bottom-4 left-4">
        <a onClick={GotoProfile} href="#" className="font-lekton text-l text-gray-600 hover:underline">
          Volver
        </a>
      </div>
      <Modal
        title={modalTitle}
        type={modalType}
        message={modalMessage}
        open={showModal}
        setOpen={setShowModal}
      />
    </form>
  );
}
