'use client';

import { motion } from 'framer-motion';
import { useLoading } from '@/context/LoadingProvider';

const LoadingScreen: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null; // No mostrar si no está cargando

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl font-bold z-50"
    >
      Cargando...
    </motion.div>
  );
};

export default LoadingScreen;
