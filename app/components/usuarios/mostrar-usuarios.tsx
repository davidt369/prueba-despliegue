// components/usuarios/mostrar-usuarios.tsx
import { FaArrowLeft, FaUserPlus, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "@remix-run/react";
import Usuario from "~/interfaces/usuarios";

interface UsuariosProps {
  users: Usuario[];
  openModal: (user?: Usuario) => void;
  openDeleteModal: (user: Usuario) => void;
  error?: string;
}

export default function UsuariosPage({ users, openModal, openDeleteModal, error }: UsuariosProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      {/* Navbar */}
      <nav className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin-panel" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
              <FaArrowLeft className="mr-6" /> {/* Icono de flecha hacia la izquierda */}
              Panel de Administrador
            </Link>
            <h1 className="text-2xl font-bold text-blue-800">Gestión de Usuarios</h1>
          </div>
        </div>
      </nav>

      {/* Botón para agregar usuario */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => openModal()}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
        >
          <FaUserPlus className="mr-2" />
          Agregar Usuario
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Grid de tarjetas de usuario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.uid}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <FaUser className="text-blue-800 text-2xl lg:text-4xl mr-2" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {user.nombre} {user.apellidos}
                      </h2>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="mb-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.rol === "administrador" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.rol}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => openModal(user)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Editar
                </button>
                <button
                  onClick={() => openDeleteModal(user)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
