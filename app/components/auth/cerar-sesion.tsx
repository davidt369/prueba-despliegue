// components/LogoutButton.tsx
import { Form } from "@remix-run/react";

export default function LogoutButton() {
  return (
    <Form method="post" action="/">
      <button
        name="logOut"
        value="logOut"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Cerrar sesión
      </button>
    </Form>
  );
}
