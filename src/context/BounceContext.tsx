// src/context/BounceContext.tsx

import { createContext, useState, useContext, ReactNode } from 'react';

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
