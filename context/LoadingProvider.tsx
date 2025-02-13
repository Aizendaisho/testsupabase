'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname(); // Detecta cambios de ruta

  useEffect(() => {
    if (!pathname) return; // Evitar problemas en SSR

    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500); // Duración de la pantalla de carga

    return () => clearTimeout(timer); // Limpieza
  }, [pathname]); // Se ejecuta cada vez que cambia la ruta

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe usarse dentro de LoadingProvider');
  }
  return context;
};
