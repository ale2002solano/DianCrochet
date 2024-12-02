"use client";
import React, { useState, useEffect } from "react";
import { validarCorreo } from "@services/UserAuth/user";
import Modal from "../modals/Modal";
import Link from "next/link";

interface PswdCodeFormProps {
  email: string;
}

export default function PswdCodeForm({ email }: PswdCodeFormProps) {
  const [code, setCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(1);
  const [launcher, setLauncher] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = await validarCorreo(email, code);
      if(data.user.codigo ==1){
        setModalTitle("Verificación Exitosa");
        setModalMessage("Código verificado con éxito");
        setModalType(1); // Tipo 1 para éxito
        setShowModal(true);
        setLauncher(true);
      }else{
        setModalTitle("Error de Verificación");
        console.log(data)
        setModalMessage(data.user.mensaje);
        setModalType(2); // Tipo 3 para error
        setShowModal(true);
      }

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (showModal && launcher) {
      const timer = setTimeout(() => {
        if (modalType === 1) {
          window.location.href = `/auth/reset-pwd?email=${email}`;
        } else {
          window.location.href = `/auth/fgt-pwd-code?email=${email}`;
        }
      }, 1000); // Redirigir después de 1 segundos

      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [showModal, modalType, email, launcher]);

  return (
    <>
      <form onSubmit={handleSubmit} className="relative z-10 h-[60.4%] w-[25.7%] rounded-3xl bg-white opacity-90 shadow-2xl min-w-[335px]">
        <div className="absolute top-[5.3%] flex h-[12.5%] w-full items-center justify-center">
          <h1 className="w-[88.1%] font-koulen text-3xl text-gray-800">
            RESTABLECER CLAVE
          </h1>
        </div>
        <div className="absolute top-[23.3%] flex h-[10.6%] w-full ml-7">
          <h5 className="w-[70.1%] font-lekton text-l text-gray-600 font-normal">
            Ingrese el código
          </h5>
        </div>
        <div className="absolute top-[35%] flex h-[7.6%] w-full justify-center mt-6">
          <input
            id="mailcontainer"
            className="absolute w-[88.1%] h-12 rounded-2xl border border-gray-200 bg-white pl-3 pr-3 font-lekton text-gray-800 shadow-lg placeholder:font-lekton placeholder:text-gray-400 focus:outline-none"
            placeholder="6-digitos"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="absolute bottom-[15%] flex h-[10.19%] w-full justify-center">
          <button type="submit" className="absolute flex h-full w-[56.61%] items-center justify-center rounded-3xl bg-[#C68EFE] pt-[1%]">
            <h1 className="w-[88.1%] font-koulen text-2xl text-white">
              ENVIAR 
            </h1>
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
        <Link className="font-lekton text-l text-gray-600 hover:underline" href="/auth/forgot-pwd">Volver</Link>
        </div>
      </form>
      {showModal && (
        <Modal
          title={modalTitle}
          message={modalMessage}
          type={modalType}
          open={showModal}
          setOpen={setShowModal}
        />
      )}
    </>
  );
}
