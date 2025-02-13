'use client'
// components/LoginForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import {
  FaEnvelope, // Ícono de correo electrónico
  FaGoogle,   // Ícono de Google
  FaGithub,   // Ícono de GitHub
} from 'react-icons/fa'; // Importamos íconos de Font Awesome

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Maneja el inicio de sesión con email (sin contraseña)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        setMessage('Error al enviar el correo. Inténtalo de nuevo.');
      } else {
        setMessage('Correo enviado. Revisa tu bandeja de entrada.');
      }
    } catch (err) {
      setMessage('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  // Maneja el inicio de sesión con Google
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',

    });

    if (error) {
      setMessage('Error al iniciar sesión con Google.');
    }
  };

  // Maneja el inicio de sesión con GitHub
  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',

    });

    if (error) {
      setMessage('Error al iniciar sesión con GitHub.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>

      {/* Formulario de Email */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="relative">
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10" // Espacio para el ícono
          />
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Enviando correo...' : 'Iniciar sesión con correo'}
        </Button>
      </form>

      {message && <p className="mt-2 text-sm text-center text-gray-600">{message}</p>}

      {/* Separador */}
      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500">O</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Botones de Google y GitHub */}
      <Button
        onClick={handleGoogleLogin}
        className="w-full mb-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <FaGoogle /> Iniciar sesión con Google
      </Button>
      <Button
        onClick={handleGithubLogin}
        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900"
      >
        <FaGithub /> Iniciar sesión con GitHub
      </Button>
    </motion.div>
  );
}