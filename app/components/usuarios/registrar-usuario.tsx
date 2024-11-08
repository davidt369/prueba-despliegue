import 'react-toastify/dist/ReactToastify.css';
import { useState, ChangeEvent, FormEvent } from "react";
import { Form, useNavigate } from "@remix-run/react";
import { toast, ToastContainer } from "react-toastify";
import { registerWithEmail } from '~/services/autenticacion';
import Usuario from '~/interfaces/usuarios';
import { FaUserPlus } from 'react-icons/fa6';

// Hook para gestionar datos del formulario y estado del modal
function useRegistrarUsuario() {
  const [formData, setFormData] = useState<Usuario>({
    email: "",
    contrasena: "",
    nombre: "",
    apellidos: "",
    rol: "vendedor",
    telefono: "",
    estado: true,
  
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRolChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFormData((prevData) => ({ ...prevData, rol: e.target.value as Usuario['rol'] }));
  };

  const handleEstadoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData((prevData) => ({ ...prevData, estado: e.target.checked }));
  };

  return {
    formData,
    isOpen,
    setIsOpen,
    handleInputChange,
    handleRolChange,
    handleEstadoChange,
  };
}

export default function RegistrarUsuario() {
  const navigate = useNavigate();
  const {
    formData,
    isOpen,
    setIsOpen,
    handleInputChange,
    handleRolChange,
    handleEstadoChange,
  } = useRegistrarUsuario();

  // Estado `loading` para indicar el envío
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Activa el estado de carga

    try {
      const { email, contrasena, ...usuarioData } = formData;
      const user = await registerWithEmail(email, contrasena || "", { ...usuarioData, email });
      if (user) {
        toast.success("Usuario registrado con éxito.");
        setIsOpen(false);
        navigate("/administrador"); // Redirige a la lista de usuarios o página de éxito
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Hubo un problema registrando el usuario.";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Desactiva el estado de carga al finalizar
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <button
      onClick={() => setIsOpen(true)}
      className="bg-green-500 hover:bg-green-700 text-white font-bold 
      py-2 px-4 rounded-full shadow-lg flex items-center"    >
             <FaUserPlus className="mr-2" />
        Registrar Usuario
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">Registrar Usuario</h2>
              <p className="text-gray-600">
                Complete el formulario para registrar un nuevo usuario.
              </p>
            </div>
            <Form method="post" onSubmit={handleSubmit} className="space-y-4">
              {/* Campos del formulario */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3 border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="contrasena" className="text-right">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena || ""}
                  onChange={handleInputChange}
                  className="col-span-3 border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              {/* Resto de los campos del formulario */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nombre" className="text-right">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="col-span-3 border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="apellidos" className="text-right">
                  Apellidos
                </label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  className="col-span-3 border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="rol" className="text-right">
                  Rol
                </label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleRolChange}
                  className="col-span-3 border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="administrador">Administrador</option>
                  <option value="empleado">Empleado</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="telefono" className="text-right">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="col-span-3 border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="estado" className="text-right">
                  Estado
                </label>
                <input
                  type="checkbox"
                  id="estado"
                  name="estado"
                  checked={formData.estado}
                  onChange={handleEstadoChange}
                  className="col-span-3"
                />
              </div>

              {/* Botones de enviar y cancelar */}
              <div className="text-right mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 mr-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {loading ? "Registrando…" : "Registrar"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
