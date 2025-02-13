'use client';

import NewNoteForm from '@/components/NewNoteForm';
import NotesBoard from '@/components/NotesBoard';
import TaskManager from '@/components/TaskManager';

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Tablero de Notas Colaborativo</h1>
      {/* Formulario para agregar nuevas notas */}
      {/* <NewNoteForm /> */}
      {/* Tablero para ver y reordenar notas */}
      {/* <NotesBoard /> */}
      <TaskManager />
    </div>
  );
}
