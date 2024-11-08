import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import RegistrarUsuario from "~/components/usuarios/registrar-usuario";
import { loginWithEmail, getLoggedUser } from "~/services/autenticacion";
import { useState } from "react";

interface ActionData {
  error?: string;
}

// Loader para redirigir al usuario a su página según su rol si ya está autenticado
export const loader: LoaderFunction = async () => {
  const usuario = await getLoggedUser();
  if (usuario) {
    // Redirige al usuario a su ruta según el rol
    switch (usuario.rol) {
      case 'administrador':
        return redirect('/administrador');
      case 'vendedor':
        return redirect('/vendedor');
      case 'empleado':
        return redirect('/empleado');
      default:
        return redirect('/');
    }
  }
  return null; // Permite cargar la página de inicio de sesión si no está autenticado
};

// Manejo de la acción de inicio de sesión
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Correo y contraseña son requeridos." };
  }

  try {
    const result = await loginWithEmail(email, password);
    // Redirige después de iniciar sesión, según el rol del usuario
    return redirect(result.redirectUrl);
  } catch (error) {
    return { error: (error as Error).message };
  }
};

// Componente de la página de inicio de sesión
export default function Login() {
  const actionData = useActionData<ActionData>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg bg-white rounded-lg">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-blue-600">Inicio de sesión</h2>
      <p className="text-gray-600">Por favor, ingrese sus credenciales</p>
    </div>
    <Form method="post" className="mt-6 space-y-4">
      {actionData?.error && (
        <p className="text-red-600 text-center">{actionData.error}</p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="correo@example.com"
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="contraseña"
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Iniciar sesión
        </button>
      </div>
    </Form>
 
    <div className="text-center mt-4">
  
    </div>
  </div>
  );
}
