'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const NewNoteForm = () => {
  const [content, setContent] = useState('');

  // Función para insertar una nueva nota en la base de datos.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // En este ejemplo, usamos un valor numérico basado en Date.now() para la posición.
    // En un escenario real, podrías obtener la cantidad de notas o usar otro sistema para la ordenación.
    const position = Date.now();

    const { error } = await supabase.from('notes').insert([
      { content, position }
    ]);

    if (error) {
      console.error('Error al insertar nota:', error);
    } else {
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu nota..."
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Agregar Nota
      </button>
    </form>
  );
};

export default NewNoteForm;
