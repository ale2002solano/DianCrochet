"use client";
import { verifyCode } from "@interfaces/user";
import { resendCode, verifyEmailRegister } from "@services/UserAuth/user";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Modal from "../modals/Modal";
import LoadingPage from "../animation/LoadingPage";
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  mail: string; // Prop para recibir el título del formulario
  setShowEmailVerification: (value: boolean) => void;
}

export default function CodeRegister({ mail, setShowEmailVerification }: AuthFormProps) {
  const router = useRouter();
  const [showModalResend, setShowModalResend] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<verifyCode>({
    codigoVeri: "",
    correo: mail,
  });
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(0);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const countdown = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timeLeft]);

  const handleBack = () =>{
    setShowEmailVerification(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await verifyEmailRegister(formData);
      // console.log('respuesta: ', response);

      // Condicionales para asignar valores al modal
      if (response.user.codigo === 1) {
        // console.log("Registro exitoso de código:", response);
        setModalTitle("Registro Exitoso");
        setModalMessage("");
        setModalType(1);
        localStorage.setItem('loginResponse', JSON.stringify(response));
        router.push("http://dian-crochet-8ii.vercel.app");
      } else {
        setModalTitle("Ocurrió un error");
        setModalMessage(response.user.mensaje);
        setModalType(2);
      }

      handleModal(); // Muestra el modal
    } catch (error) {
      console.log(error);
      handleModal();
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModal = () => {
    setShowModal(true);
    // console.log("cambiando modal: ", showModal);
  };

  const handleModalResend = () => {
    setShowModalResend(!showModalResend);
    // console.log("cambiando modal: ", showModalResend);
  };

  const handleResendCode = async () => {
    if (timeLeft === 0) {
      if (showModalResend) {
        handleModalResend();
      }
      setLoading(true);
      try {
        const response = await resendCode(formData.correo);
        if (response.user.codigo === 1) {
          setModalTitle("Código Reenviado");
          setModalMessage(`Se ha enviado un código a ${formData.correo}`);
          setModalType(1);
        }
        setTimeLeft(30); // Iniciar temporizador a 30 segundos
        handleModalResend();
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative z-20 flex h-[70%] w-full items-center justify-center min-h-[485px]">
      {loading && (
        <div className="absolute z-50 flex h-full w-full items-center justify-center">
          <LoadingPage />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative z-10 h-full w-full rounded-3xl bg-white opacity-90 shadow-2xl"
      >
        <div className="absolute top-[5.3%] flex h-[12.5%] w-full items-center justify-center">
          <h1 className="w-[88.1%] font-koulen text-3xl text-gray-800 select-none">
            VERIFICAR CODIGO
          </h1>
        </div>
        <div className="absolute top-[23.3%] ml-7 flex h-[10.6%] w-full">
          <h5 className="text-l w-[80.1%] font-lekton font-normal text-gray-600">
            Ingrese el codigo que enviamos a {mail}
          </h5>
        </div>
        <div className="absolute top-[35%] mt-6 flex h-[7.6%] w-full justify-center">
          <input
            id="codigoVeri"
            className="h-19 absolute h-14 w-[88.1%] rounded-2xl border border-gray-200 bg-white pl-3 pr-3 font-lekton text-gray-800 shadow-lg placeholder:font-lekton placeholder:text-gray-400 focus:outline-none"
            placeholder=""
            type="text"
            autoComplete="off"
            required
            value={formData.codigoVeri}
            onChange={handleChange}
            name="codigoVeri"
          />
        </div>
        <div
          onClick={handleResendCode}
          className={`absolute bottom-[30%] left-4 pl-3 ${
            timeLeft > 0 ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
          }`}
          style={{ pointerEvents: timeLeft > 0 ? "none" : "auto" }}
        >
          <h1 className="font-lekton text-sm text-[#535353] underline decoration-[#535353]">
            {timeLeft > 0
              ? `Reenviar en ${timeLeft}s`
              : "¿No recibiste ningún código?"}
          </h1>
        </div>
        <div className="absolute bottom-[15%] flex h-[10.19%] w-full justify-center">
          <button type="submit" className="absolute flex h-full w-[56.61%] items-center justify-center rounded-3xl bg-[#C68EFE] pt-[1%]">
            <h1 className="w-[88.1%] font-koulen text-2xl text-white">
              ENVIAR
            </h1>
          </button>
        </div>
        <div onClick={handleBack} className="absolute bottom-4 left-4">
          <h1 className="text-l font-lekton text-gray-600 hover:underline">
            Volver
          </h1>
        </div>
        {showModal ? (
          <Modal
            title={modalTitle}
            message={modalMessage}
            type={modalType}
            open={showModal}
            setOpen={setShowModal}
          />
        ) : (
          ""
        )}
        {showModalResend ? (
          <Modal
            title={modalTitle}
            type={modalType}
            message={modalMessage}
            open={showModalResend}
            setOpen={setShowModalResend}
          />
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
