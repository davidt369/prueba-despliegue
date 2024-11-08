// app/components/inmueble/InformacionInmuebleForm.tsx
import { Form } from "@remix-run/react";
import { useState, ChangeEvent } from "react";
import LocationMap from "../ubicacion";
import { Inmueble } from "~/interfaces/inmueble";

interface InformacionInmuebleFormProps {
  inmueble: Inmueble;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function InformacionInmuebleForm({
  inmueble,
  handleChange,
}: InformacionInmuebleFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationSelect = (lat: number, lon: number, url: string) => {
    handleChange({ target: { name: "ubicacionUrl", value: url } } as any);
    setIsModalOpen(false);
  };

  // Función para calcular la fecha de vencimiento (6 meses después de la fecha de registro)
  const calculateVencimiento = (fechaRegistro: string) => {
    const fecha = new Date(fechaRegistro);
    fecha.setMonth(fecha.getMonth() + 6); // Agrega 6 meses
    return fecha.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const handleFechaRegistroChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleChange(e); // Actualiza la fecha de registro en el estado
    // Calcula y actualiza automáticamente la fecha de vencimiento
    handleChange({
      target: { name: "fechaVencimiento", value: calculateVencimiento(value) },
    } as any);
  };
  return (
    <Form method="post" className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Información del Inmueble</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="codigo" className="text-gray-600 font-medium">Código</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={inmueble.codigo}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="tipo" className="text-gray-600 font-medium">Tipo</label>
          <input
            type="text"
            id="tipo"
            name="tipo"
            value={inmueble.tipo}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="direccion" className="text-gray-600 font-medium">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={inmueble.direccion}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:col-span-2">
          <label className="text-gray-600 font-medium">Ubicación URL</label>
          <input
            type="url"
            name="ubicacionUrl"
            value={inmueble.ubicacionUrl}
            readOnly
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Seleccionar ubicación en el mapa
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                ✕
              </button>
              <LocationMap onLocationSelect={handleLocationSelect} onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
        
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Zona</label>
          <input
            type="text"
            name="zona"
            value={inmueble.zona}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Área</label>
          <input
            type="text"
            name="area"
            value={inmueble.area}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Precio Venta</label>
          <input
            type="number"
            name="precioVenta"
            value={inmueble.precioVenta}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Precio Propietario</label>
          <input
            type="number"
            name="precioPropietario"
            value={inmueble.precioPropietario}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Precio M2</label>
          <input
            type="number"
            name="precioM2"
            value={inmueble.precioM2}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Estado</label>
          <select
            name="estado"
            value={inmueble.estado}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="disponible">Disponible</option>
            <option value="en_tramite">En Trámite</option>
            <option value="vendido">Vendido</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Fecha Registro</label>
          <input
            type="date"
            name="fechaRegistro"
            value={inmueble.fechaRegistro}
            onChange={handleFechaRegistroChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Fecha Vencimiento</label>
          <input
            type="date"
            name="fechaVencimiento"
            value={inmueble.fechaVencimiento}
            readOnly
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
          />
        </div>
    
      </div>
    </Form>
  );
}
