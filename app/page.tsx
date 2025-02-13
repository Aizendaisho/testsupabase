'use client'
// app/page.tsx
import AuthContent from '@/components/AuthContent';

export default function Home() {
  return (
    <main>
          <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Bienvenido a mi App</h1>
      <p className="text-lg">Debes iniciar sesión para acceder al contenido.</p>
    </div>
    </main>
  );
}
