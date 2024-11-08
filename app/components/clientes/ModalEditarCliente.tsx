// components/ListaClientes.tsx

import React from "react";
import { Cliente } from "~/interfaces/clientes";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

interface ListaClientesProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDeleteRequest: (uid: string) => void;
}

export default function ListaClientes({ clientes, onEdit, onDeleteRequest }: ListaClientesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {clientes.map((cliente) => (
        <div key={cliente.uid} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between h-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">{cliente.nombreCompleto}</h3>
            <p className="text-gray-600 mb-1">Teléfono: {cliente.telefono}</p>
            <p className="text-gray-600 mb-1">Fecha de Registro: {new Date(cliente.fechaRegistro).toLocaleDateString()}</p>
            <h4 className="text-lg font-semibold mt-4">Preferencias</h4>
            <p className="text-gray-600">Tipo de Inmueble: {cliente.preferencias.tipoInmueble}</p>
            <p className="text-gray-600">Precio Mínimo: ${cliente.preferencias.precioMin}</p>
            <p className="text-gray-600">Precio Máximo: ${cliente.preferencias.precioMax}</p>
            <p className="text-gray-600">Dirección: {cliente.preferencias.direccion}</p>
            <p className="text-gray-600">Zona: {cliente.preferencias.zona}</p>
          </div>
          <div className="flex justify-end space-x-4">
            <button onClick={() => onEdit(cliente)} className="text-blue-500 hover:text-blue-700">
              <FaEdit className="w-5 h-5" />
            </button>
            <button onClick={() => onDeleteRequest(cliente.uid!)} className="text-red-500 hover:text-red-700">
              <FaTrashAlt className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
