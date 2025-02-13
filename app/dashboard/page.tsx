'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace('/'); // Redirige si no hay usuario
      } else {
        setUser(user);
      }

      setLoading(false);
    };

    fetchUser();

    // Escuchar cambios en la sesión
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        setUser(null);
        console.log('No hay sesión');
        router.replace('/');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user ? <p className="text-lg">Bienvenido, {user.email}</p> : <p>Cargando...</p>}
    </div>
  );
}
