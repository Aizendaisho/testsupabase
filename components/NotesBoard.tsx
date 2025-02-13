'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

// Definición de la interfaz Note para tipado
interface Note {
  id: string;
  content: string;
  position: number;
}

// Componente para cada nota, utilizando dnd-kit para hacerlo "sortable"
const SortableNote = ({ note }: { note: Note }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: note.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white rounded shadow mb-2 cursor-move"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {note.content}
    </motion.div>
  );
};

const NotesBoard = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  // Función para obtener las notas desde Supabase ordenadas por 'position'
  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('position', { ascending: true });
    if (error)  console.error('Error fetching notes:', error as any);
    else setNotes(data || []);
  };

  // Suscribirse a cambios en la tabla 'notes' para actualizaciones en tiempo real.
  useEffect(() => {
    fetchNotes();

    const subscription = supabase
      .channel('public:notes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          console.log('Cambio en notas:', payload);
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Maneja el reordenamiento de notas usando dnd-kit.
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((note) => note.id === active.id);
      const newIndex = notes.findIndex((note) => note.id === over.id);
      const newNotes = arrayMove(notes, oldIndex, newIndex);
      setNotes(newNotes);

      // Actualizar la posición de cada nota en la base de datos.
      for (let index = 0; index < newNotes.length; index++) {
        await supabase.from('notes').update({ position: index }).eq('id', newNotes[index].id);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={notes.map((note) => note.id)} strategy={verticalListSortingStrategy}>
          {notes.map((note) => (
            <SortableNote key={note.id} note={note} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default NotesBoard;
