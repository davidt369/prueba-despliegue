import { LoaderFunction, ActionFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getLoggedUser, logOut } from '~/services/autenticacion';
import Usuario from '~/interfaces/usuarios';

export const loader: LoaderFunction = async () => {
  const usuario = await getLoggedUser();
  if (!usuario || usuario.rol !== 'vendedor') {
    return redirect('/');
  }
  return { usuario };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  if (formData.get('logOut')) {
    await logOut();
    return redirect('/');
  }
  return null;
};

type LoaderData = {
  usuario: Usuario;
};

export default function VendedorPage() {
  const { usuario } = useLoaderData<LoaderData>();

  return (
    <section className="max-w-md mx-auto mt-10 p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Bienvenido, {usuario.nombre}</h2>
      <form method="post">
        <button
          name="logOut"
          value="logOut"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar sesión
        </button>
      </form>
    </section>
  );
}