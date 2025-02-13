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
      className="bg-white rounded-lg shadow p-4 mb-4"
    >
      {/* Cabecera con información del creador */}
      <div className="flex items-center mb-2">
        {task.creator_avatar ? (
          <img
            src={task.creator_avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full mr-2"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
            {task.creator_name.charAt(0)}
          </div>
        )}
        <span className="font-semibold">{task.creator_name}</span>
      </div>
      
      {/* Contenido editable o de solo lectura */}
      <div className="mb-2">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border p-1 rounded w-full"
          />
        ) : (
          <p className={`text-lg ${task.is_complete ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </p>
        )}
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onToggle(task.id, task.is_complete)}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          {task.is_complete ? <FaCheck /> : 'Completar'}
        </button>
        {isEditing ? (
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Guardar
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
          >
            Editar
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          <FaTrash />
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCard;
