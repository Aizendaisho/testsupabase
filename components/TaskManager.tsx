// components/TaskManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import NoteCard, { Task } from './NoteCard';
import { AnimatePresence } from 'framer-motion';

/**
 * TaskManager: Componente principal para la gestión de tareas.
 * Implementa las operaciones CRUD y muestra cada tarea mediante el componente NoteCard.
 */
const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Función para obtener las tareas de la base de datos
  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Función para agregar una nueva tarea
  const addTask = async () => {
    if (newTaskTitle.trim() === '') return;

    // Obtiene la sesión actual para extraer la información del usuario creador
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      console.error('No user session found');
      return;
    }
    const creator_name =
      session.user.user_metadata?.full_name || session.user.email;
    const creator_avatar = session.user.user_metadata?.avatar_url || '';

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: newTaskTitle, is_complete: false, creator_name, creator_avatar }])
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
    } else {
      setTasks([...tasks, data]);
      setNewTaskTitle('');
    }
  };

  // Función para alternar el estado de completado de una tarea
  const toggleTaskCompletion = async (id: number, currentState: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_complete: !currentState })
      .eq('id', id);
    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(tasks.map(task => task.id === id ? { ...task, is_complete: !currentState } : task));
    }
  };

  // Función para eliminar una tarea
  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  // Función para actualizar (editar) el título de una tarea
  const updateTask = async (id: number, newTitle: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ title: newTitle })
      .eq('id', id);
    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(tasks.map(task => task.id === id ? { ...task, title: newTitle } : task));
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Tablero de Tareas</h1>
      {/* Formulario para agregar nuevas tareas */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Escribe una nueva tarea..."
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Agregar
        </button>
      </div>
      {loading ? (
        <p className="text-center">Cargando tareas...</p>
      ) : (
        <AnimatePresence>
          {tasks.map((task) => (
            <NoteCard
              key={task.id}
              task={task}
              onToggle={toggleTaskCompletion}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default TaskManager;
