// components/NoteCard.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

export interface Task {
  id: number;
  title: string;
  is_complete: boolean;
  creator_name: string;
  creator_avatar: string;
}

interface NoteCardProps {
  task: Task;
  onToggle: (id: number, currentState: boolean) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newTitle: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleUpdate = () => {
    if (editTitle.trim() !== '') {
      onUpdate(task.id, editTitle);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="рыв border border-gray-300 bg-paper-light rounded-md shadow-sm p-4 mb-4" // Clases de estilo actualizadas
    >
      {/* Cabecera con información del creador */}
      <div className="flex items-center mb-2 text-sm text-gray-700"> {/* Estilo de texto de cabecera sutil */}
        {task.creator_avatar ? (
          <img
            src={task.creator_avatar}
            alt="Avatar"
            className="w-6 h-6 rounded-full mr-2" // Avatar más pequeño
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2 text-xs"> {/* Iniciales más pequeñas */}
            {task.creator_name.charAt(0)}
          </div>
        )}
        <span className="font-normal">{task.creator_name}</span> {/* Fuente normal para nombre */}
      </div>

      {/* Contenido editable o de solo lectura */}
      <div className="mb-3"> {/* Mayor margen inferior para el contenido */}
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border-b border-gray-400 p-1 rounded-none w-full focus:ring-0 focus:border-blue-500 font-note text-lg" // Estilo de input más discreto y fuente de nota
          />
        ) : (
          <p className={`text-lg font-note ${task.is_complete ? 'line-through text-gray-500' : ''}`}> {/* Fuente de nota para el texto principal */}
            {task.title}
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2 opacity-75 group-hover:opacity-100 transition-opacity duration-200"> {/* Botones más sutiles por defecto */}
        <button
          onClick={() => onToggle(task.id, task.is_complete)}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 text-xs" // Estilo de botón más suave
        >
          {task.is_complete ? <FaCheck /> : 'Completar'}
        </button>
        {isEditing ? (
          <button
            onClick={handleUpdate}
            className="bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 text-xs" // Estilo de botón más suave
          >
            Guardar
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md hover:bg-yellow-200 text-xs" // Estilo de botón más suave
          >
            Editar
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 text-xs" // Estilo de botón más suave
        >
          <FaTrash />
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCard;