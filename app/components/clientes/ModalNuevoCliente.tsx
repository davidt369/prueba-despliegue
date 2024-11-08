// components/RegistrarClienteModal.tsx

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Form, useNavigate } from "@remix-run/react";
import { toast, ToastContainer } from "react-toastify";
import { crearCliente, actualizarCliente } from "~/services/cliente";
import { Cliente } from "~/interfaces/clientes";

interface RegistrarClienteModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cliente?: Cliente | null;
}

export default function RegistrarClienteModal({ isOpen, setIsOpen, cliente }: RegistrarClienteModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Cliente>({
    nombreCompleto: "",
    telefono: "",
    preferencias: {
      tipoInmueble: "",
      precioMin: 0,
      precioMax: 0,
      direccion: "",
      zona: ""
    },
    fechaRegistro: new Date().toISOString(),
    activo: true,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    }
  }, [cliente]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePreferenciaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      preferencias: { ...prevData.preferencias, [name]: value },
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (cliente?.uid) {
        // Edita el cliente si ya tiene uid
        await actualizarCliente(cliente.uid, formData);
        toast.success("Cliente actualizado con éxito.");
      } else {
        // Crea un nuevo cliente si no tiene uid
        await crearCliente(formData);
        toast.success("Cliente registrado con éxito.");
      }
      setIsOpen(false);
      navigate("/clientes");
    } catch (error) {
      toast.error((error as Error).message || "Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">{cliente ? "Editar Cliente" : "Registrar Cliente"}</h2>
        <Form method="post" onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nombre Completo */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="nombreCompleto" className="text-right">Nombre Completo</label>
            <input type="text" id="nombreCompleto" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleInputChange} className="col-span-3 border p-2 rounded" required />
          </div>

          {/* Campo: Teléfono */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="telefono" className="text-right">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} className="col-span-3 border p-2 rounded" required />
          </div>

          {/* Campo: Preferencias - Tipo de Inmueble */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="tipoInmueble" className="text-right">Tipo de Inmueble</label>
            <input type="text" id="tipoInmueble" name="tipoInmueble" value={formData.preferencias.tipoInmueble} onChange={handlePreferenciaChange} className="col-span-3 border p-2 rounded" required />
          </div>

          {/* Campo: Preferencias - Precio Mínimo */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="precioMin" className="text-right">Precio Mínimo</label>
            <input type="number" id="precioMin" name="precioMin" value={formData.preferencias.precioMin} onChange={handlePreferenciaChange} className="col-span-3 border p-2 rounded" required />
          </div>

          {/* Campo: Preferencias - Precio Máximo */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="precioMax" className="text-right">Precio Máximo</label>
            <input type="number" id="precioMax" name="precioMax" value={formData.preferencias.precioMax} onChange={handlePreferenciaChange} className="col-span-3 border p-2 rounded" required />
          </div>

          {/* Campo: Preferencias - Dirección */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="direccion" className="text-right">Dirección</label>
            <input type="text" id="direccion" name="direccion" value={formData.preferencias.direccion} onChange={handlePreferenciaChange} className="col-span-3 border p-2 rounded" required />
          </div>

          {/* Campo: Preferencias - Zona */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="zona" className="text-right">Zona</label>
            <input type="text" id="zona" name="zona" value={formData.preferencias.zona} onChange={handlePreferenciaChange} className="col-span-3 border p-2 rounded" required />
          </div>

          {/* Botones de acción */}
          <div className="text-right mt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 mr-2 border rounded hover:bg-gray-100">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {loading ? "Procesando…" : cliente ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
