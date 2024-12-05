'use client';

import UserProfileErick from "./components/editarPerfilErick";



export default function Profile() {
    return (
        <div className="sm:w-[75%] w-full h-full flex justify-center">  
            {/* "aqui va la pagina principal, probablemente datos de usuario u otra pagina de bienvenida" 
           o tambien se puede trabajar todo aqui de un solo, sin necesidad de componente*/}
           <UserProfileErick />
        </div>
    );
}
