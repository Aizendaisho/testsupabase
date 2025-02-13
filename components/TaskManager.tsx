// components/TaskManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import NoteCard, { Task } from './NoteCard';
import { AnimatePresence } from 'framer-motion';
// 👇👇👇 IMPORTACIÓN IMPORTANTE: Añade esta línea para el tipo RealtimePostgresChangesPayload
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/authStore';

/**
 * TaskManager: Componente principal para la gestión de tareas con actualizaciones en tiempo real.
 * Implementa las operaciones CRUD y muestra cada tarea mediante NoteCard, actualizándose en tiempo real.
 */
const TaskManager: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore(); // Obtiene el usuario actual del store de autenticación

    useEffect(() => {
        // Configura la suscripción en tiempo real al montar el componente
        const realtimeSubscription = supabase
            .channel('public:tasks') // Canal para la tabla 'tasks' (público en este caso)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tasks' },
                // 👇👇👇 ANOTACIÓN DE TIPO CORRECTA para payload: RealtimePostgresChangesPayload<any>
                (payload: RealtimePostgresChangesPayload<any>) => {
                    // console.log('----- Cambio en tiempo real recibido -----'); // Separator for clarity
                    // console.log(payload)
                    // console.log('Payload Event Type:', payload.eventType);
                    if (payload.new) {
                        console.log('New Task ID:', payload.new.id);  // Log ID for INSERT/UPDATE
                    }
                    if (payload.old) {
                        if (payload.old && 'id' in payload.old) {
                            console.log('Old Task ID:', payload.old.id);  // Log ID for DELETE
                        }
                    }
                    // console.log('Full Payload:', payload); // Log the entire payload object

                    switch (payload.eventType) {
                        case 'INSERT':
                            setTasks((currentTasks) => {
                                const newTask = payload.new as Task;
                                // Verificar si la tarea ya existe en el estado para evitar duplicados (por si acaso)
                                const taskExists = currentTasks.some(task => task.id === newTask.id);
                                if (taskExists) {
                                    // console.warn("Tarea duplicada recibida por Realtime (INSERT), ignorando:", newTask.id);
                                    return currentTasks; // No modificar el estado si ya existe
                                }
                                return [...currentTasks, newTask];
                            });
                            break;
                        case 'UPDATE':
                            setTasks((currentTasks) => {
                                const updatedTasks = currentTasks.map((task) =>
                                    task.id === payload.new.id ? payload.new as Task : task
                                );
                                console.log('Tasks state AFTER UPDATE:', updatedTasks.map(t => t.id));
                                return updatedTasks;
                            });
                            break;
                        case 'DELETE':
                            setTasks((currentTasks) => {
                                const updatedTasks = currentTasks.filter((task) => task.id !== payload.old.id);
                                console.log('Tasks state AFTER DELETE:', updatedTasks.map(t => t.id));
                                return updatedTasks;
                            });
                            break;
                    }
                }
            )
            .subscribe();

        // Obtener las tareas iniciales al inicio (una sola vez)
        fetchInitialTasks();

        // Limpiar la suscripción al desmontar el componente
        return () => {
            supabase.removeChannel(realtimeSubscription);
        };
    }, []); // El array de dependencias vacío asegura que useEffect se ejecute solo una vez al montar

    const fetchInitialTasks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('id', { ascending: true });
        if (error) {
            console.error('Error fetching initial tasks:', error);
        } else {
            setTasks(data || []);
        }
        setLoading(false);
    };


    // Función para agregar una nueva tarea (sin cambios aquí)
    const addTask = async () => {
        if (newTaskTitle.trim() === '') return;

        // Obtiene la sesión actual para extraer la información del usuario creador
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
            console.error('No user session found');
            return;
        }
        const creator_id = session.user.id;
        const creator_name =
            session.user.user_metadata?.full_name || session.user.email;
        const creator_avatar = session.user.user_metadata?.avatar_url || '';

        const { data, error } = await supabase
            .from('tasks')
            .insert([{ title: newTaskTitle, is_complete: false, creator_name, creator_avatar, creator_id: creator_id }])
            .select()
            .single();

        if (error) {
            console.error('Error adding task:', error);
        } else {
            setTasks([...tasks, data]); //  Ya no es necesario aquí, Realtime lo maneja, pero se deja por consistencia.
            setNewTaskTitle('');
        }
    };

    // Función para alternar el estado de completado de una tarea (sin cambios aquí)
    const toggleTaskCompletion = async (id: number, currentState: boolean) => {
        const { error } = await supabase
            .from('tasks')
            .update({ is_complete: !currentState })
            .eq('id', id);
        if (error) {
            console.error('Error updating task:', error);
        } else {
            setTasks(tasks.map(task => task.id === id ? { ...task, is_complete: !currentState } : task)); //  Ya no es necesario aquí, Realtime lo maneja, pero se deja por consistencia.
        }
    };

    // Función para eliminar una tarea (sin cambios aquí)
    const deleteTask = async (id: number) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting task:', error);
            if (error.message.includes('violates row-level security policy')) {
                alert("No tienes permiso para eliminar esta tarea.");
            } else {
                alert("Error al eliminar la tarea. Por favor, intenta de nuevo.");
            }
        } else {
            // setTasks(tasks.filter(task => task.id !== id)); // Ya no es necesario aquí, Realtime lo maneja
        }
    };

    // Función para actualizar (editar) el título de una tarea (sin cambios aquí)
    const updateTask = async (id: number, newTitle: string) => {
        const { error } = await supabase
            .from('tasks')
            .update({ title: newTitle })
            .eq('id', id);
        if (error) {
            console.error('Error updating task:', error);
            if (error.message.includes('violates row-level security policy')) {
                alert("No tienes permiso para editar esta tarea.");
            } else {
                alert("Error al actualizar la tarea. Por favor, intenta de nuevo.");
            }
        } else {
            // setTasks(tasks.map(task => task.id === id ? { ...task, title: newTitle } : task)); // Ya no es necesario aquí, Realtime lo maneja
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
                            currentUser={user} // Pasa la prop currentUser correctamente
                        />
                    ))}
                </AnimatePresence>
            )}
        </div>
    );
};

export default TaskManager;