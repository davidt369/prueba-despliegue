// components/DeleteUserDialog.tsx
import { Form } from "@remix-run/react";
import { FaTrash } from "react-icons/fa";

interface DeleteUserDialogProps {
  uid: string;
  onClose: () => void;
  onDelete: (uid: string) => void;
}

export default function DeleteUserDialog({ uid, onClose, onDelete }: DeleteUserDialogProps) {
  const handleDelete = () => {
    onDelete(uid);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4 text-red-600">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este usuario?</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancelar
          </button>
          <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
