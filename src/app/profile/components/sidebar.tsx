'use client'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UploadModal from '../change-profile-picture/components/change-pic'; 
export default function Sidebar() { 
    const router = useRouter();
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);  // Estado para la URL de la imagen de perfil
    const [nombre, setNombre] = useState<string>('');
    const [apellido, setApellido] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        // Prefetch las rutas al cargar el componente
        router.prefetch('/profile/myvideos');
        router.prefetch('/profile/records');
        router.prefetch('/profile/mykits');
        router.prefetch('/profile');
    }, [router]);

    const handleMyVideos = () => { // Limpia todos los datos del localStorage
        router.push('/profile/myvideos');  // Redirige al usuario a la página de inicio de sesión
    };
    
    const handleMyKits = () => { // Limpia todos los datos del localStorage
        router.push('/profile/mykits');  // Redirige al usuario a la página de inicio de sesión
    };

    const handleMyBills = () => { // Limpia todos los datos del localStorage
        router.push('/profile/records');  // Redirige al usuario a la página de inicio de sesión
    };

    const handleMyData = () => { // Limpia todos los datos del localStorage
        router.push('/profile');  // Redirige al usuario a la página de inicio de sesión
    };

    const handleLogout = () => {
        localStorage.clear();  // Limpia todos los datos del localStorage
        router.push('/auth/sign-in');  // Redirige al usuario a la página de inicio de sesión
      };

    useEffect(() => {
        const storedResponse = localStorage.getItem('loginResponse');
        if (storedResponse) {
          const parsedResponse = JSON.parse(storedResponse);
          setProfileImageUrl(parsedResponse.imagen_url);  // Establecer la URL de la imagen en el estado
          setNombre(parsedResponse?.query_result?.NOMBRE || '');  // Establecer el correo
          setApellido(parsedResponse?.query_result?.APELLIDO || ''); 
        }
      }, []);

    return (
        <div className="hidden sm:flex sm:w-[25%] shadow-xl h-screen relative flex-col md:items-center">
            <div className="relative rounded-full mt-32 h-28 w-28 object-contain">
                <Image
                  src={profileImageUrl ? profileImageUrl : "https://ik.imagekit.io/diancrochet/Fotos/user.png"}
                  alt="Profile Pic"
                  layout="fill" // Esto hace que la imagen ocupe todo el espacio disponible
                  className="object-cover rounded-full select-none" 
                />
            </div>
            <div className="w-11/12 h-10 flex items-center justify-center "><h1 className="font-koulen select-none text-slate-700 text-xl rounded-lg "> {nombre.split(' ')[0]} {apellido.split(' ')[0]}</h1> <FontAwesomeIcon icon={faEdit} onClick={openModal} className="mr-2 text-black ml-2" /> <UploadModal isOpen={isModalOpen} onClose={closeModal} />    </div>
            <div onClick={handleMyData} className="w-[70%] h-10 flex items-center mt-[13%]"><h1 className="font-koulen whitespace-nowrap select-none text-slate-700 text-xl rounded-lg hover:bg-[#C68EFE] hover:text-2xl transition-all duration-300 ease-in-out px-2 hover:text-stone-50">Datos Personales</h1></div>
            <div onClick={handleMyBills} className="w-[70%] h-10 flex items-center "><h1 className="font-koulen whitespace-nowrap select-none text-slate-700 text-xl rounded-lg hover:bg-[#C68EFE] hover:text-2xl transition-all duration-300 ease-in-out px-2 hover:text-stone-50 ">Historial de Compras</h1></div>
            <div onClick={handleMyVideos} className="w-[70%] h-10 flex items-center "><h1 className="font-koulen whitespace-nowrap select-none text-slate-700 text-xl rounded-lg hover:bg-[#C68EFE] hover:text-2xl transition-all duration-300 ease-in-out px-2 hover:text-stone-50 ">Mis videos</h1></div>
            <div onClick={handleMyKits} className="w-[70%] h-10 flex items-center "><h1 className="font-koulen whitespace-nowrap select-none text-slate-700 text-xl rounded-lg hover:bg-[#C68EFE] hover:text-2xl transition-all duration-300 ease-in-out px-2 hover:text-stone-50 ">Mis kits </h1></div>
            <div
            onClick={handleLogout} 
            className="w-[70%] h-10 flex items-center "><h1 className="font-koulen whitespace-nowrap select-none text-slate-700 text-xl rounded-lg hover:bg-[#C68EFE] hover:text-2xl transition-all duration-300 ease-in-out px-2 hover:text-stone-50 ">Cerrar Sesion</h1></div>
        </div>
    );
}
