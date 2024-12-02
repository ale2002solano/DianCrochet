"use client";
import { loginData } from "@interfaces/user";
import { login } from "@services/UserAuth/user";
import React, { ChangeEvent, FormEvent, useState } from "react";
import LoadingPage from "../animation/LoadingPage";
import CodeRegister from "./CodeRegister";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import login from '@services/UserAuth/login';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<loginData>({
    correo: "",
    contrasena: "",
  });
  const [loading, setLoading] = useState(false);
  const [codigo, setCodigo] = useState(0);
  const [message, setMessage] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(true);

  // Maneja los cambios en los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [passwordEyeController, setPasswordEyeController] = useState(false);
  const passwordEyeHandler = () => {
    setPasswordEyeController(!passwordEyeController);
  };

  //Envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aqui se hace la transaccion beebboop
    setLoading(true);
    try {
      // Realiza una petición POST con los datos del formulario
      const response = await login(formData);
      setMessage(response.mensaje);

      if (response.codigo == 1) {
        console.log("Login exitoso:", response);
         // Guarda el objeto 'response' en el localStorage
        localStorage.setItem('loginResponse', JSON.stringify(response));
        setCodigo(1);
        router.push("http://dian-crochet-8ii.vercel.app/");
        //beep boop, aqui se implementa el cambio cuando se hace login
      } else if (response.codigo == 2) {
        setCodigo(2);
        console.log(response.mensaje);
      } else if (response.codigo == 3) {
        setCodigo(3);
      } else if (response.codigo == 4) {
        setCodigo(4);
        setShowEmailVerification(false);
        //aqui hay que redirigir al codeRegister
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 h-[78.4%] w-[25.7%] rounded-3xl">
      {loading && (
        <div className="absolute z-50 flex h-full w-full items-center justify-center">
          <LoadingPage />
        </div>
      )}

      {showEmailVerification ? (
        <form
          onSubmit={handleSubmit}
          className="relative z-10 h-full w-full rounded-3xl bg-white opacity-90 shadow-2xl"
        >
          <div className="absolute top-[5.3%] flex h-[12.5%] w-full items-center justify-center">
            <h1 className="w-[88.1%] font-koulen text-3xl text-gray-800">
              INICIAR SESION
            </h1>
          </div>
          <div className="absolute top-[23.3%] flex h-[10.6%] w-full justify-center">
            <input
              id="mailcontainer"
              className={`absolute h-full w-[88.1%] ${codigo == 2 ? "border-red-600 placeholder:text-red-500" : "border-gray-200 placeholder:text-gray-400"} rounded-xl border bg-white pl-3 pr-3 font-lekton text-gray-800 shadow-lg placeholder:font-lekton focus:outline-none`}
              placeholder={codigo == 2 ? "correo incorrecto" : "correo"}
              type="text"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="absolute top-[39.5%] flex h-[10.6%] w-full flex-row-reverse pl-[6%] pr-[6%]">
            <input
              id="passwordcontainer"
              className={`absolute h-full w-[88.1%] ${codigo == 3 ? "border-red-600 placeholder:text-red-500" : "border-gray-200 placeholder:text-gray-400"} rounded-xl border bg-white pl-3 pr-3 font-lekton text-gray-800 shadow-lg placeholder:font-lekton focus:outline-none`}
              placeholder={codigo == 3 ? "contraseña incorrecta" : "contraseña"}
              type={passwordEyeController ? 'text' : 'password'}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <div className="relative h-full w-12">
              <div
                onClick={passwordEyeHandler}
                className="right-0 z-20 flex h-full w-full items-center justify-center"
              >
                {passwordEyeController ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-7 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-7 text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )} 
              </div>
            </div>
          </div>
          <div className="absolute top-[53.57%] flex h-[3%] w-full justify-center">
            
            <h1 className="font-lekton text-base text-[#535353] underline decoration-slate-900 cursor-pointer">
              <Link href="/auth/forgot-pwd">¿Olvidaste tu contraseña?</Link>
            </h1>
          </div>

          {codigo == 2 || codigo == 3 ? (
            <div className="absolute top-[17.57%] flex h-[3%] w-full pl-[7%]">
              <h1 className="decoration-red-700-900 pointer-events-none select-none font-lekton text-base text-red-600 underline">
                {message}
              </h1>
            </div>
          ) : (
            ""
          )}

          <div className="absolute top-[69.34%] flex h-[10.19%] w-full justify-center">
            <button
              type="submit"
              className="absolute flex h-full w-[56.61%] items-center justify-center rounded-3xl bg-[#C68EFE] pt-[1%]"
            >
              <h1 className="w-[88.1%] font-koulen text-2xl text-white">
                INICIAR SESION
              </h1>
            </button>
          </div>
          <div className="absolute top-[82%] flex h-[6.1%] w-[100%] flex-col items-center">
            <h1 className="font-lekton text-base text-[#535353]">
              ¿No tienes una cuenta?{" "}
            </h1>
            <h1 className="cursor-pointer font-lekton text-base text-[#535353] underline decoration-slate-900">
              <Link href="/auth/sign-up">Regístrate aquí</Link>
            </h1>
          </div>
        </form>
      ) : (
        <CodeRegister
          mail={formData.correo}
          setShowEmailVerification={setShowEmailVerification}
        />
      )}
    </div>
  );
}
