"use client";

import React from "react";
import Image from "next/image";

export default function WorkInProgress() {
    return (
    <>
        <style jsx>{`
        @keyframes swing {
            0%,
            100% {
            transform: translateX(-15px);
        }
        50% {
            transform: translateX(15px);
            }
        }

        @keyframes rotate {
            0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
            }
        }

        .animate-swing {
            animation: swing 2s infinite ease-in-out;
        }

        .animate-rotate {
            animation: rotate 4s linear infinite;
        }

        .animate-rotate-slow {
            animation: rotate 8s linear infinite;
        }
        `}</style>

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-12">
        {}
        <div className="animate-swing absolute left-0 top-0 h-32 w-32 md:h-48 md:w-48">
            <Image
            src="https://ik.imagekit.io/diancrochet/Fotos/rana%20final%20liviana.png?updatedAt=1729230005393"
            alt="Rana columpiándose"
            layout="fill"
            objectFit="contain"
        />
        </div>

        {}
        <div className="animate-rotate-slow absolute right-16 top-20 h-20 w-20 md:h-32 md:w-32">
            <Image
            src="https://ik.imagekit.io/diancrochet/Fotos/girasol.png?updatedAt=1729229985108"
            alt="Girasol en la parte superior derecha"
            layout="fill"
            objectFit="contain"
        />
        </div>
        <div className="animate-rotate absolute bottom-10 left-20 h-20 w-20 md:h-32 md:w-32">
            <Image
            src="https://ik.imagekit.io/diancrochet/Fotos/girasol.png?updatedAt=1729229985108"
            alt="Girasol en la esquina inferior izquierda"
            layout="fill"
            objectFit="contain"
        />
        </div>
        <div className="animate-rotate-slow absolute bottom-20 right-20 h-24 w-24 md:h-36 md:w-36">
            <Image
            src="https://ik.imagekit.io/diancrochet/Fotos/girasol.png?updatedAt=1729229985108"
            alt="Girasol en la esquina inferior derecha"
            layout="fill"
            objectFit="contain"
        />
        </div>

        {/* Contenido principal */}
        <div className="z-10 w-full max-w-md text-center">
            <div className="mb-8">
            <svg
                className="mx-auto h-24 w-24 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
            </svg>
            </div>
                <h2 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Próximamente...
                </h2>
            <p className="mb-8 text-xl text-gray-500">
                Estamos trabajando en nuevo contenido emocionante para ti.
            </p>
            <div className="inline-flex items-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-base font-medium text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            Volvemos pronto
            </div>
        </div>
    </div>
</>
    );
}
