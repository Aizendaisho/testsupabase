// components/AuthListener.tsx
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';

const AuthListener = () => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Obtiene la sesión actual al montar el componente
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getUser();

    // Escucha cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser]);

  return null;
};

export default AuthListener;
