'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Definir el tipo del contexto
interface BounceContextType {
  isBounce: boolean;
  setIsBounce: React.Dispatch<React.SetStateAction<boolean>>;
}

// Crear el contexto con un valor predeterminado
const BounceContext = createContext<BounceContextType | undefined>(undefined);

interface BounceProviderProps {
  children: ReactNode;
}

// Crear el proveedor para envolver los componentes
export const BounceProvider = ({ children }: BounceProviderProps) => {
  const [isBounce, setIsBounce] = useState(false);

  useEffect(() => {
    if (isBounce) {
      const audio = new Audio('/img/cash.mp3');
      audio.play().catch((error) => console.error('Error reproduciendo el sonido:', error));
    }
  }, [isBounce]);


  return (
    <BounceContext.Provider value={{ isBounce, setIsBounce }}>
      {children}
    </BounceContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useBounce = () => {
  const context = useContext(BounceContext);
  if (!context) {
    throw new Error('useBounce must be used within a BounceProvider');
  }
  return context;
};
