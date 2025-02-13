'use client'
// components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabaseClient';
import { FaSignOutAlt, FaUser } from 'react-icons/fa'; // Íconos de logout y usuario
import type { User } from '@supabase/supabase-js';

export default function Navbar2() {
const [user, setUser] = useState<User | null>(null);

  // Verifica si el usuario está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (!error && sessionData.session) {
        setUser(sessionData.session.user);
      }
    };

    checkSession();

    // Escucha cambios en la sesión
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Maneja el cierre de sesión
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Logo o título */}
      <div className="text-lg font-bold">Mi Aplicación</div>

      {/* Contenido dinámico */}
      <div className="flex items-center gap-4">
        {user ? (
          // Usuario logueado
          <>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.user_metadata.avatar_url || ''} alt="Foto de perfil" />
                <AvatarFallback>
                  <FaUser />
                </AvatarFallback>
              </Avatar>
              <span>{user.user_metadata?.full_name || user.email || 'Usuario'}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <FaSignOutAlt /> Cerrar Sesión
            </Button>
          </>
        ) : (
          // Usuario no logueado
          <Button variant="outline" className="flex items-center gap-2">
            <FaUser /> Iniciar Sesión
          </Button>
        )}
      </div>
    </nav>
  );
}