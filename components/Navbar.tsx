// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { FiLogOut } from 'react-icons/fi';
import { use, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const Navbar = () => {
  // Usamos el estado global del usuario y la función para actualizarlo
  const { user, setUser } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  console.log(user);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Espera al menos 1 segundo para mostrar la pantalla de carga
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await supabase.auth.signOut();
    // Actualizamos el store global, de esta manera se reflejará en toda la app
    setUser(null);
    setIsLoggingOut(false);
  };

  return (
    <>
      {/* Overlay de carga que se muestra cuando isLoggingOut es true */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <p className="text-white text-xl">Cargando...</p>
        </div>
      )}

      <nav className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
        <div className="text-lg font-bold">Mi App</div>
        {!user && (
          <Link
            href="/login"
            className="flex items-center gap-1 bg-green-700 px-2 py-1 rounded hover:bg-green-500"
          >
            Login
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-4">
            {/* Sección de navegación para usuarios logueados */}
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="px-3 py-1 rounded hover:bg-gray-700"
              >
                Dashboard
              </Link>
              <Link
                href="/notes"
                className="px-3 py-1 rounded hover:bg-gray-700"
              >
                Notas
              </Link>
              {/* En el futuro puedes agregar más rutas aquí */}
              {/*
              <Link
                href="/otra-ruta"
                className="px-3 py-1 rounded hover:bg-gray-700"
              >
                Otra Ruta
              </Link>
              */}
            </div>
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url || user.user_metadata.profile_image}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
            )}
            <span>{user.user_metadata?.full_name || user.email || 'Usuario'}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded hover:bg-red-600"
            >
              <FiLogOut />
              <span>Salir</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
