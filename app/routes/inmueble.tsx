// app/routes/inmueble.tsx
import { json } from "@remix-run/node";
import { useState, ChangeEvent } from "react";
import { useSubmit } from "@remix-run/react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CaracteristicasInmuebleForm from "~/components/inmueble/caracteristicas";
import InformacionInmuebleForm from "~/components/inmueble/informacion";
import PropietarioForm from "~/components/inmueble/propietario";
import type { Inmueble } from '~/interfaces/inmueble';
import { ActionFunction } from "@remix-run/node";
import { saveInmuebleWithImages } from "~/services/inmuebles";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const inmuebleData = Object.fromEntries(formData);
  console.log("Datos recibidos en el servidor:", inmuebleData);
  return json({ success: true });
};

export default function Inmuebler() {
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Estado para el botón de guardar
  const submit = useSubmit();

  const [inmueble, setInmueble] = useState<Inmueble>({
    codigo: "",
    tipo: "",
    direccion: "",
    ubicacionUrl: "",
    zona: "",
    area: "",
    precioVenta: "",
    precioPropietario: "",
    precioM2: "",
    estado: "disponible",
    numeroPisos: "",
    superficie: "",
    superficieConstruida: "",
    frente: "",
    caracteristicas: "",
    servicios: [],
    imagenesUrls: [] as string[],
    fechaRegistro: "",
    fechaVencimiento: "",
    propietario: {
      nombreCompleto: "",
      telefono: "",
      ci: "",
      domicilio: "",
      telefonoFamiliar: "",
      nombreFamiliar: "",
      procedencia: "",
    },
    eliminar: false,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setStep(1);
  };

  const resetForm = () => {
    setInmueble({
      codigo: "",
      tipo: "",
      direccion: "",
      ubicacionUrl: "",
      zona: "",
      area: "",
      precioVenta: "",
      precioPropietario: "",
      precioM2: "",
      estado: "disponible",
      numeroPisos: "",
      superficie: "",
      superficieConstruida: "",
      frente: "",
      caracteristicas: "",
      servicios: [],
      imagenesUrls: [] as string[],
      fechaRegistro: "",
      fechaVencimiento: "",
      propietario: {
        nombreCompleto: "",
        telefono: "",
        ci: "",
        domicilio: "",
        telefonoFamiliar: "",
        nombreFamiliar: "",
        procedencia: "",
      },
      eliminar: false,
    });
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const handleInmuebleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name in inmueble.propietario) {
      setInmueble((prev) => ({
        ...prev,
        propietario: { ...prev.propietario, [name]: value },
      }));
    } else {
      setInmueble((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddServicio = (servicio: string) => {
    setInmueble((prev) => ({
      ...prev,
      servicios: [...prev.servicios, { nombre: servicio }],
    }));
  };

  const handleRemoveServicio = (index: number) => {
    setInmueble((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (images: string[]) => {
    setInmueble((prev) => ({
      ...prev,
      imagenesUrls: images,
    }));
  };

  const validateForm = () => {
    return (
      inmueble.codigo &&
      inmueble.tipo &&
      inmueble.direccion &&
      inmueble.ubicacionUrl &&
      inmueble.zona &&
      inmueble.area &&
      inmueble.precioVenta &&
      inmueble.precioPropietario &&
      inmueble.precioM2 &&
      inmueble.numeroPisos &&
      inmueble.superficie &&
      inmueble.superficieConstruida &&
      inmueble.frente &&
      inmueble.caracteristicas &&
      inmueble.fechaRegistro &&
      inmueble.fechaVencimiento &&
      inmueble.propietario.nombreCompleto &&
      inmueble.propietario.telefono &&
      inmueble.propietario.ci &&
      inmueble.propietario.domicilio
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Todos los campos son requeridos.");
      return;
    }

    setIsSaving(true); // Bloquea el botón de guardar

    try {
      const inmuebleId = await saveInmuebleWithImages(inmueble, inmueble.imagenesUrls || []);
      console.log("Inmueble guardado con ID:", inmuebleId);

      toast.success("Inmueble guardado exitosamente.");
      closeModal();
      resetForm();
    } catch (error) {
      console.error("Error al guardar el inmueble:", error);
      toast.error("Error al guardar el inmueble. Intenta nuevamente.");
    } finally {
      setIsSaving(false); // Desbloquea el botón
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <ToastContainer />
      <button
        onClick={openModal}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-200"
      >
        Registrar Inmueble
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              ✕
            </button>

            <h1 className="text-3xl font-bold mb-6">Registro de Inmueble</h1>

            {step === 1 && <PropietarioForm propietario={inmueble.propietario} handleChange={handleInmuebleChange} />}
            {step === 2 && <InformacionInmuebleForm inmueble={inmueble} handleChange={handleInmuebleChange} />}
            {step === 3 && (
              <CaracteristicasInmuebleForm
                inmueble={inmueble}
                handleChange={handleInmuebleChange}
                handleAddServicio={handleAddServicio}
                handleRemoveServicio={handleRemoveServicio}
                handleImageChange={handleImageChange}
              />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition duration-200"
                >
                  Anterior
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className={`w-full sm:w-auto px-6 py-3 ${
                    isSaving ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"
                  } text-white font-semibold rounded-md transition duration-200`}
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
