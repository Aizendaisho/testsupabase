// components/AuthForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Iniciar sesión usando magic link por email
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      alert('Revisa tu correo para el enlace de acceso.');
    }
  };

  // Función para iniciar sesión con OAuth (Google o GitHub)
  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Formulario para autenticación por correo */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-4 max-w-md w-full"
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Iniciar sesión por correo
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>

      {/* Botones para autenticación con Google y GitHub */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <button
          onClick={() => handleOAuthLogin('google')}
          className="flex items-center justify-center gap-2 bg-white border p-2 rounded shadow hover:bg-gray-100"
        >
          <FcGoogle size={24} />
          Iniciar sesión con Google
        </button>
        <button
          onClick={() => handleOAuthLogin('github')}
          className="flex items-center justify-center gap-2 bg-gray-800 text-white p-2 rounded shadow hover:bg-gray-700"
        >
          <FaGithub size={24} />
          Iniciar sesión con GitHub
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
