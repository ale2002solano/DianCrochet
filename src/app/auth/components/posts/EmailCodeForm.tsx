"use client";
import React, { useState, useEffect } from "react";
import { resetPassword } from "@services/UserAuth/user";
import Modal from "../modals/Modal";
import Link from "next/link";

interface AuthFormProps {
  title: string;
}

export default function EmailAuthForm({ title }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(0);
  const [launcher, SetLauncher] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await resetPassword(email);
      if(response.codigo==1){
        setModalTitle("Verificación Exitosa");
        setModalMessage(`El código ha sido enviado a ${email}`);
        setModalType(1);
        SetLauncher(true)
      }else{
        setModalTitle("Ocurrió un error");
        setModalMessage(response.mensaje);
        setModalType(2);
      }
      // console.log("Respuesta del servidor:", response);

      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (showModal && launcher) {
      const timer = setTimeout(() => {
        window.location.href = `/auth/fgt-pwd-code?email=${email}`;
      }, 1000); // Redirigir después de 2 segundos

      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [showModal, email, launcher]);

  return (
    <>
      <form onSubmit={handleSubmit} className="relative z-10 h-[55.4%] w-full rounded-3xl bg-white opacity-90 shadow-2xl  min-h-[400px]">
        <div className="absolute top-[5.3%] flex h-[12.5%] w-full items-center justify-center">
          <h1 className="w-[88.1%] font-koulen text-3xl text-gray-800">
            {title}
          </h1>
        </div>
        <div className="absolute top-[23.3%] flex h-[10.6%] w-full pl-7 pr-7">
          <h5 className="w-full font-lekton text-l text-gray-600 font-normal">
            Ingresa tu correo y te enviaremos un código de verificación
          </h5>
        </div>
        <div className="absolute top-[35%] flex h-[15.6%] w-full justify-center mt-6">
          <input
            id="mailcontainer"
            className="absolute h-full w-[88.1%] rounded-2xl h-19 border border-gray-200 bg-white pl-3 pr-3 font-lekton text-gray-800 shadow-lg placeholder:font-lekton placeholder:text-gray-400 focus:outline-none"
            placeholder="correo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="absolute top-[69.34%] flex h-11 w-full justify-center">
          <button type="submit" className="absolute flex h-full w-[56.61%] items-center justify-center rounded-3xl bg-[#C68EFE] pt-[1%]">
            <h1 className="w-[88.1%] font-koulen text-2xl text-white">
              ENVIAR 
            </h1>
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
        <Link className="font-lekton text-l text-gray-600 hover:underline" href="/auth/sign-in">Volver</Link>
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