// components/AuthContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from './Navbar';
import AuthForm from './AuthForm';
import type { User } from '@supabase/supabase-js';

const AuthContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p className="p-4 text-center">Cargando...</p>;
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="p-4">
        {user ? (
          <div className="text-center mt-10">
            <h1 className="text-3xl font-bold">
              Bienvenido, {user.user_metadata?.full_name || user.email}!
            </h1>
            <p className="mt-4 text-lg">Esta es tu pantalla de bienvenida.</p>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </>
  );
};

export default AuthContent;
