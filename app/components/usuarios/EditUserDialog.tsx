// components/EditUserDialog.tsx
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Form } from "@remix-run/react";
import Usuario from "~/interfaces/usuarios";

interface EditUserDialogProps {
  user: Usuario;
  onClose: () => void;
  onUpdate: (updatedUser: Usuario) => void;
}

export default function EditUserDialog({ user, onClose, onUpdate }: EditUserDialogProps) {
  const [nombre, setNombre] = useState(user.nombre);
  const [apellidos, setApellidos] = useState(user.apellidos);
  const [rol, setRol] = useState(user.rol);

  const handleUpdate = () => {
    onUpdate({ ...user, nombre, apellidos, rol });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
        <Form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as Usuario["rol"])}
              className="mt-1 block w-full px-3 py-2 border rounded"
            >
              <option value="administrador">Administrador</option>
              <option value="empleado">Empleado</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancelar
            </button>
            <button type="button" onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
              Actualizar
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
