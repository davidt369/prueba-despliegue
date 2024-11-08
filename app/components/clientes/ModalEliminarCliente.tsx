// EliminarClienteModal.tsx

import React from "react";

interface EliminarClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EliminarClienteModal({ isOpen, onClose, onConfirm }: EliminarClienteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-sm rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Confirmar Eliminación</h2>
        <p className="text-center text-gray-600 mb-6">¿Estás seguro de que deseas eliminar este cliente?</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
