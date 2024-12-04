'use client';

import UserProfile from "./components/editPerfil";

export default function Profile() {
    return (
        <div className=" w-[75%] h-full mt-[10%] sm:mt-[3%]  mb-20 sm:mb-0 ">  
            {/* "aqui va la pagina principal, probablemente datos de usuario u otra pagina de bienvenida" 
           o tambien se puede trabajar todo aqui de un solo, sin necesidad de componente*/}
           <UserProfile />
        </div>
    );
}
