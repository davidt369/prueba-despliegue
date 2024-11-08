// app/components/inmueble/PropietarioForm.tsx
import { Form } from "@remix-run/react";
import { Propietario } from "~/interfaces/inmueble";

interface PropietarioFormProps {
  propietario: Propietario;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PropietarioForm({ propietario, handleChange }: PropietarioFormProps) {
  return (
    <Form method="post" className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Datos del Propietario</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Nombre Completo</label>
          <input
            type="text"
            name="nombreCompleto"
            value={propietario.nombreCompleto}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={propietario.telefono}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">CI</label>
          <input
            type="text"
            name="ci"
            value={propietario.ci}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Domicilio</label>
          <input
            type="text"
            name="domicilio"
            value={propietario.domicilio}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Teléfono Familiar</label>
          <input
            type="text"
            name="telefonoFamiliar"
            value={propietario.telefonoFamiliar}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Nombre Familiar</label>
          <input
            type="text"
            name="nombreFamiliar"
            value={propietario.nombreFamiliar}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col sm:col-span-2">
          <label className="text-gray-600 font-medium">Procedencia</label>
          <input
            type="text"
            name="procedencia"
            value={propietario.procedencia}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </Form>
  );
}
