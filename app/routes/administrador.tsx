import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getLoggedUser, logOut, resetPassword } from "~/services/autenticacion";
import { updateUsuario, deleteUsuario, getUsuarios } from "~/services/usuarios";
import Usuario from "~/interfaces/usuarios";
import { FaUserPlus, FaUser, FaEdit, FaTrash, FaLock } from "react-icons/fa";

import EditUserDialog from "~/components/usuarios/EditUserDialog";
import DeleteUserDialog from "~/components/usuarios/DeleteUserDialog";
import RegistrarUsuario from "~/components/usuarios/registrar-usuario";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "~/components/Navabar";

export const loader: LoaderFunction = async () => {
  const usuario = await getLoggedUser();
  if (!usuario || usuario.rol !== "administrador") {
    return redirect("/");
  }
  const users = await getUsuarios();
  return json({ usuario, users });
};

export default function Administrador() {
  const { usuario, users } = useLoaderData<{ usuario: Usuario; users: Usuario[] }>();
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [resettingUser, setResettingUser] = useState<{ [uid: string]: boolean }>({});

  const handleUpdate = async (updatedUser: Usuario) => {
    await updateUsuario(updatedUser);
    setEditingUser(null);
  };

  const handleDelete = async (uid: string) => {
    await deleteUsuario(uid);
    setDeletingUser(null);
  };

  const handleResetPassword = async (user: Usuario) => {
    const lastReset = localStorage.getItem(`reset_${user.uid}`);
    const now = new Date().getTime();

    if (lastReset && now - parseInt(lastReset) < 3600000) {
      toast.error("Ya se envió un correo de recuperación recientemente. Inténtalo más tarde.");
      return;
    }

    try {
      await resetPassword(user.email);
      localStorage.setItem(`reset_${user.uid}`, now.toString());
      setResettingUser({ ...resettingUser, [String(user.uid)]: true });
      toast.success("Correo de recuperación enviado correctamente.");
    } catch (error) {
      toast.error("Error enviando correo de recuperación.");
    }
  };

  return (
<>
  <Navbar />
  <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6">
    <div className="flex justify-center sm:justify-end mb-6">
      <RegistrarUsuario />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {users.map((user) => (
        <div
          key={user.uid}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <div className="p-4 md:p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-blue-700 text-3xl md:text-4xl" />
                  <div className="text-center sm:text-left">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                      {user.nombre} {user.apellidos}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <span
                  className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full ${user.estado
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {user.estado ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="mb-4 text-center sm:text-left">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${user.rol === "administrador"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                    }`}
                >
                  {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-between items-center space-y-2 sm:space-y-0 space-x-2 sm:space-x-0 sm:space-x-2 mt-4">
              <button
                onClick={() => setEditingUser(user)}
                className="w-full sm:w-auto flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
              >
                <FaEdit className="mr-1" /> Editar
              </button>
              <button
                onClick={() => user.uid && setDeletingUser(user.uid)}
                className="w-full sm:w-auto flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
              >
                <FaTrash className="mr-1" /> Eliminar
              </button>
              <button
                onClick={() => handleResetPassword(user)}
                className={`w-full sm:w-auto flex items-center justify-center text-white font-bold py-2 px-3 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 ${resettingUser[user.uid || '']
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-800"
                  }`}
                disabled={user.uid ? resettingUser[user.uid] : false}
              >
                <FaLock className="mr-1" />
                {user.uid && resettingUser[user.uid] ? "Enviado" : "Recuperar"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Dialogs for editing and deleting */}
    {editingUser && (
      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={handleUpdate}
      />
    )}
    {deletingUser && (
      <DeleteUserDialog
        uid={deletingUser}
        onClose={() => setDeletingUser(null)}
        onDelete={handleDelete}
      />
    )}
  </div>
</>

  );
}
