import React from "react";
import Image from 'next/image'

export default function LoginBG() {
  return (
    <div className="imagen absolute bottom-0 h-full w-full">
      <div className="sombra absolute bottom-0 h-[60%] w-full"></div>
      <div className="sombra absolute top-0 h-[60%] w-full rotate-180"></div>
      <Image
        src="/img/CrochetTree.png"
        alt="Background Image"
        width={380}
        height={450}
        priority
        className="absolute pointer-events-none bottom-1 right-0 mix-blend-multiply"
        style={{ width: 'auto', height: 'auto' }}
      />

      <Image
        src="/img/Frog.png"
        alt="Background Image"
        width={110}
        height={67}
        className="absolute pointer-events-none left-7 top-0 opacity-90 mix-blend-multiply"
        style={{ width: 'auto', height: 'auto' }}
      />

      <Image
        src="/img/girasol.svg"
        alt="Background Image"
        width={100}
        height={100}
        className="absolute pointer-events-none bottom-48 right-[23%] scale-x-[-1] mix-blend-multiply"
      />

      <Image
        src="/img/girasol.svg"
        alt="Background Image"
        width={100}
        height={100}
        className="absolute pointer-events-none right-[8%] bottom-[70%] scale-x-[-1] mix-blend-multiply"
      />

      <Image
        src="/img/CrochetCat.jpg"
        alt="Background Image"
        width={200}
        height={200}
        className="absolute pointer-events-none bottom-2 left-28 mix-blend-multiply"
      />

      <Image
        src="/img/CrochetRooster.jpg"
        alt="Background Image"
        width={200}
        height={120}
        className="absolute pointer-events-none bottom-[-10%] left-[-58px] scale-x-[-1] mix-blend-multiply"
        style={{ width: 'auto', height: 'auto' }}
      />

      <Image
        src="/img/CrochetPumpkin.jpeg"
        alt="Background Image"
        width={385}
        height={200}
        className="absolute pointer-events-none bottom-[-50px] left-72 mix-blend-multiply object-contain"
        style={{ width: 'auto', height: '60%' }}
      />

      <Image
        src="/img/CrochetPumpkin.jpeg"
        alt="Background Image"
        width={180}
        height={140}
        className="absolute pointer-events-none left-10 bottom-[25%] scale-x-[-1] mix-blend-multiply object-contain"
        style={{ width: 'auto', height: 'auto' }}
      />
    </div>
  );
}
