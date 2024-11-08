import { LoaderFunction, ActionFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getLoggedUser, logOut } from '~/services/autenticacion';
import Usuario from '~/interfaces/usuarios';
import LogoutButton from '~/components/auth/cerar-sesion';

export const loader: LoaderFunction = async () => {
  const usuario = await getLoggedUser();
  if (!usuario || usuario.rol !== 'empleado' || usuario.estado !== true) {
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

export default function EmpleadoPage() {
  const { usuario } = useLoaderData<LoaderData>();

  return (
    <section className="max-w-md mx-auto mt-10 p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Bienvenido, {usuario.nombre}</h2>
      <LogoutButton />
    </section>
  );
}