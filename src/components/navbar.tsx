"use client";
import Link from 'next/link';
import { FaUserCircle, FaShoppingCart} from 'react-icons/fa';
import Image from "next/legacy/image";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BounceProvider, useBounce } from '../context/BounceContext';
import { useCart } from '../context/CartContext';
//cambio minimo
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import Search from './SearchBar';


export default function Navbar() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string>('');
  const [mensajeAdvertencia, setMensajeAdvertencia] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isBounce } = useBounce();  
  const { totalCantidad } = useCart();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  // Recuperar la imagen de perfil y correo del localStorage
  const [isSideMenuOpen, setSideMenu] = useState(false);

  function openSideMenu() {
    setSideMenu(true);
  }
  
  function closeSideMenu() {
    setSideMenu(false);
  }
  // Recuperar la imagen de perfil y correo del localStorage cuando el componente se monte
  useEffect(() => {
    const storedResponse = localStorage.getItem('loginResponse');
    if (storedResponse) {
      const parsedResponse = JSON.parse(storedResponse);
      setProfileImageUrl(parsedResponse.imagen_url);
      setCorreo(parsedResponse?.query_result?.CORREO || '');
    }
  }, []);

  const toggleProfileMenu = () => {
    setProfileOpen(!isProfileOpen);
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setCorreo("");
    router.push('/auth/sign-in');
  };

  const handleCarritoClick = () => {
    if (!correo) {
      setMensajeAdvertencia('Inicia sesion para acceder.');
      setTimeout(() => setMensajeAdvertencia(null), 3000);
    } else {
      router.push('/checkout/shop-cart');
    }
  };

  const handleMiperfilClick = () => {
    if (!correo) {
      setMensajeAdvertencia('Inicia sesion para acceder.');
      setTimeout(() => setMensajeAdvertencia(null), 3000);
    } else {
      router.push('/profile');
    }
  };

  return (
    <header className="bg-white shadow-md font-koulen flex fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="http://dian-crochet-8ii.vercel.app/">
            <Image src="/img/logo.svg" alt="Logo" width={40} height={40} />
          </Link>
          {isSideMenuOpen && <MobileNav closeSideMenu={closeSideMenu} />}
          <nav className="hidden md:flex space-x-8">
            <a onClick={() => router.push('/products')} href="#" className="text-gray-700 hover:text-purple-500">PRODUCTOS</a>
            <a onClick={() => router.push('/products/materials')} href="#" className="text-gray-700 hover:text-purple-500">MATERIALES</a>
            <a onClick={() => router.push('/products/kits')} href="#" className="text-gray-700 hover:text-purple-500">KITS</a>
            <a onClick={() => router.push('/products/tutoriales')} href="#" className="text-gray-700 hover:text-purple-500">TUTORIALS</a>
          </nav>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex items-center rounded-full px-4 py-1 w-1/3 bg-gray-100 focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-none">
          <Search/>
        </div>

        <div className="flex justify-center">
        <div className="flex md:hidden lg:hidden xl:hidden 2xl:hidden rounded-full  px-4 py-1 w-[screen] bg-gray-100 focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-none">
          <Search/>
        </div>
        </div>



        {/* Iconos */}
        <div className="flex items-center space-x-6 relative">
          {/* Perfil */}
          <div className="hidden md:flex relative items-center" ref={profileRef}>
            <button onClick={toggleProfileMenu} className="relative w-[40px] h-[40px] focus:outline-none" title='iconos'>
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt="Imagen de Perfil"
                  layout='fill'
                  sizes="40px"
                  className="object-cover rounded-full"
                />
              ) : (
                <FaUserCircle className="text-gray-700 text-2xl" />
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20">
                <a onClick={handleMiperfilClick} href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mi Perfil</a>
                <a
                  onClick={correo ? handleLogout : () => router.push('/auth/sign-in')}
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {correo ? "Cerrar Sesion" : "Iniciar Sesion"}
                </a>
              </div>
            )}
          </div>
          <div className='hidden md:flex'>
          {/* Carrito */}
          <BounceProvider>
            <button onClick={handleCarritoClick} title="carrito" className={`relative ${isBounce ? 'animate-beatfade' : ''} `}>
              <FaShoppingCart className="text-gray-700 text-3xl" />
              <span  className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-none flex items-center justify-center text-xs text-white ${ isBounce ? 'bg-green-700' : 'bg-gray-400'}`}>{totalCantidad}</span>
            </button>
          </BounceProvider>

          </div>  
          {/* Mostrar mensaje de advertencia si no está logueado */}
          {mensajeAdvertencia && (
            <div className="text-lg items-center w-1/4 flex justify-center font-koulen fixed bottom-5 right-5 bg-gray-200 opacity-75 text-purple-800 px-1 py-2 rounded-lg z-50">
              {mensajeAdvertencia}
              <svg className="ml-6 size-6 text-purple-900" xmlns="http://www.w3.org/2000/svg" strokeWidth={2} width="2em" height="1em" viewBox="0 0 32 32">
                <path fill="currentColor" d="m15.875 4l-.094.031l-8 1.875L7 6.094v20.25l.813.125l8 1.5l.093.031H18V4zM20 6v2h3v16h-3v2h5V6zm-4 .031V26l-7-1.313V7.657zM14.344 15c-.367 0-.688.45-.688 1s.32 1 .688 1s.656-.45.656-1s-.29-1-.656-1"></path>
              </svg>
            </div>
          )}
          
        </div>
        <div>
          <FiMenu onClick={openSideMenu} className="cursor-pointer text-black text-4xl md:hidden"
          />
        </div>
      </div>
    </header>
  );

  function MobileNav({ closeSideMenu }: { closeSideMenu: () => void }) {
    const navRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLAnchorElement[]>([]);
    const [activeLink, setActiveLink] = useState<string | null>(null);
    const router = useRouter();
  
    // Cerrar menú al hacer clic fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (navRef.current && !navRef.current.contains(event.target as Node)) {
          closeSideMenu();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [closeSideMenu]);
  
    useEffect(() => {
      const handleTouchMove = (event: TouchEvent) => {
        const touch = event.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target instanceof HTMLAnchorElement && linksRef.current.includes(target)) {
          setActiveLink(target.dataset.path || null);
        }
      };
  
      const handleTouchEnd = () => {
        if (activeLink) {
          router.push(activeLink);
          closeSideMenu();
          setActiveLink(null);
        }
      };
  
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
  
      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }, [activeLink, closeSideMenu, router]);
    return (
      <div className="fixed !ml-0 left-0 top-0 flex h-full min-h-screen w-full justify-end md:hidden">
        <div className="h-full w-[35%] bg-slate-700 opacity-55 px-4 py-4"></div>
        <div ref={navRef} className="h-full w-[65%] bg-white px-4 py-4">
          <section className="flex justify-end text-black">
            <AiOutlineClose
              onClick={closeSideMenu}
              className="cursor-pointer text-4xl"
            />
          </section>
  
          <nav className="flex flex-col items-start gap-4 text-2xl transition-all">
            {[
              { label: "PRODUCTOS", path: "/products" },
              { label: "MATERIALES", path: "/products/materials" },
              { label: "KITS", path: "/products/kits" },
              { label: "TUTORIALS", path: "/products/tutoriales" },
              { label: "MI CARRITO", path: "/checkout/shop-cart" },
            ].map((link, index) => (
              <a
              key={link.path}
              href="#"
              onClick={() => {
                if (link.path === "/checkout/shop-cart") {
                  // Llama a la función handleCartClick
                  handleCarritoClick();
                } else {
                  // Usa router.push para otros enlaces
                  router.push(link.path);
                }
                closeSideMenu(); // Cierra el menú lateral
              }} // Evita que se muestre la URL al mantener presionado
              ref={(el) => {
                linksRef.current[index] = el!;
              }} // Guardar referencia
              data-path={link.path} // Identificador único
              className={`${
                activeLink === link.path
                  ? "bg-purple-200 text-purple-500 rounded-md"
                  : "text-gray-700"
              } px-4`}
            >
              {link.label}
            </a>
            ))}

            {correo ? (
                       <div className="relative">
                       <button
                         onTouchStart={() => setActiveLink("profile")}
                         onTouchEnd={toggleProfileDropdown}
                         className={`${
                           activeLink === "profile"
                             ? "bg-purple-200 text-purple-500 rounded-lg"
                             : "text-gray-700"
                         } px-4`}
                       >
                         MI PERFIL
                       </button>
                       {isProfileDropdownOpen && (
                         <div className="absolute left-0 mt-2 w-48 rounded-lg border border-gray-300 bg-white shadow-lg">
                           {[
                             { label: "DATOS PERSONALES", path: "/profile" },
                             { label: "HISTORIAL DE COMPRA", path: "/profile/records" },
                             { label: "MIS VIDEOS", path: "/profile/myvideos" },
                             { label: "MIS KITS", path: "/profile/mykits" },
                           ].map((subLink, subIndex) => (
                             <a
                               key={subLink.path}
                               href="#"
                               onClick={() => {
                                 router.push(subLink.path);
                                 setIsProfileDropdownOpen(false); // Cerrar dropdown
                                 closeSideMenu(); // Cerrar el menú lateral
                               }}
                               onTouchStart={(e) => e.preventDefault()}  // Evita que se muestre la URL al mantener presionado
                               onMouseDown={(e) => e.preventDefault()} 
                               ref={(el) => {
                                 linksRef.current[5 + subIndex] = el!;
                               }} // Guardar referencias adicionales
                               data-path={subLink.path} // Identificador único
                               className={`${
                                 activeLink === subLink.path
                                   ? "bg-purple-200 text-purple-500"
                                   : "text-gray-700"
                               } block px-4 py-2`}
                             >
                               {subLink.label}
                             </a>
                           ))}
                         </div>
                       )}
                     </div>
            ) : ("")}
            {/* Sección Mi Perfil */}
   
  
            {/* Cerrar Sesión / Iniciar Sesión */}
            <a
              href="#"
              onClick={() => {
                if (correo) {
                  handleLogout();
                } else {
                  router.push('/auth/sign-in');
                }
                closeSideMenu();
              }}
              className="block py-2 text-gray-700 hover:bg-gray-100"
            >
            {correo ? 'Cerrar Sesion' : 'Iniciar Sesion'}

            </a>
          </nav>
        </div>
      </div>
    );
  }
}


