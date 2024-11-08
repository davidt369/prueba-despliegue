// app/components/inmueble/CaracteristicasInmuebleForm.tsx
import { Form } from "@remix-run/react";
import { useState, ChangeEvent } from "react";
import { Inmueble } from "~/interfaces/inmueble";
import ImageUploader from "./ImageUploader";

interface CaracteristicasInmuebleFormProps {
  inmueble: Inmueble;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAddServicio: (servicio: string) => void;
  handleRemoveServicio: (index: number) => void;
  handleImageChange: (images: string[]) => void;
}

export default function CaracteristicasInmuebleForm({
  inmueble,
  handleChange,
  handleAddServicio,
  handleRemoveServicio,
  handleImageChange,
}: CaracteristicasInmuebleFormProps) {
  const [servicio, setServicio] = useState("");

  const onAddServicio = () => {
    if (servicio.trim()) {
      handleAddServicio(servicio);
      setServicio("");
    }
  };

  return (
    <Form method="post" className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Características y Servicios</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Número de Pisos</label>
          <input
            type="number"
            name="numeroPisos"
            value={inmueble.numeroPisos}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Superficie</label>
          <input
            type="text"
            name="superficie"
            value={inmueble.superficie}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Superficie Construida</label>
          <input
            type="text"
            name="superficieConstruida"
            value={inmueble.superficieConstruida}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Frente</label>
          <input
            type="text"
            name="frente"
            value={inmueble.frente}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:col-span-2">
          <label className="text-gray-600 font-medium">Características</label>
          <textarea
            name="caracteristicas"
            value={inmueble.caracteristicas}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Servicios */}
        <div className="flex flex-col sm:col-span-2">
          <label className="text-gray-600 font-medium">Servicios</label>
          <div className="flex space-x-2 mt-2">
            <input
              type="text"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              placeholder="Ingrese un servicio"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={onAddServicio}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Agregar
            </button>
          </div>

          {/* Lista de servicios añadidos */}
          <ul className="mt-2 space-y-1">
            {inmueble.servicios.map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-gray-700">{item.nombre}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveServicio(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ImageUploader para subir imágenes */}
        <div className="sm:col-span-2">
          <ImageUploader onImageChange={handleImageChange} />
        </div>
      </div>
    </Form>
  );
}
