import React, { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

interface Slide {
  url: string;
}

export default function Slider() {
  const slides: Slide[] = [
    {
      url: 'https://dian-crochet-8ii.vercel.app/products/tutoriales',
    },
    {
      url: 'https://dian-crochet-8ii.vercel.app/products/tutoriales',
    },
    {
      url: 'https://dian-crochet-8ii.vercel.app/products/tutoriales',
    },
    {
      url: 'https://dian-crochet-8ii.vercel.app/products/tutoriales',
    },
    {
      url: 'https://dian-crochet-8ii.vercel.app/products/tutoriales',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative group w-full max-w-[100%] overflow-hidden">
      <div className="ml-2 mb-4">
        <h1 className="font-koulen text-black">Novedades</h1>
      </div>

      {/* Slider container */}
      <div className="relative flex items-center justify-center gap-4 transition-all duration-500 ease-in-out"
           style={{
             transform: `translateX(-${currentIndex * (100 / slides.length)}%)`,
           }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-[80%] mx-2 rounded-2xl shadow-lg flex-shrink-0 bg-center bg-cover"
            style={{
              backgroundImage: `url(${slide.url})`,
              height: '300px',
            }}
          />
        ))}
      </div>

      {/* Flecha Izquierda */}
      <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>

      {/* Flecha Derecha */}
      <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>

      {/* Puntitos */}
      <div className="flex justify-center py-2 mt-4">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`text-2xl cursor-pointer ${currentIndex === slideIndex ? 'text-black' : 'text-gray-500'}`}
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}
