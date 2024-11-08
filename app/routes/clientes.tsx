// ClientesPage.tsx

import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { obtenerClientes, eliminarCliente } from "~/services/cliente";
import { Cliente } from "~/interfaces/clientes";
import ListaClientes from "~/components/clientes/ModalEditarCliente";
import RegistrarClienteModal from "~/components/clientes/ModalNuevoCliente";
import EliminarClienteModal from "~/components/clientes/ModalEliminarCliente";
import Navbar from "~/components/Navabar";

export async function loader() {
  const clientes = await obtenerClientes();
  return { clientes };
}

export default function ClientesPage() {
  const { clientes: initialClientes } = useLoaderData<{ clientes: Cliente[] }>();
  const [clientes, setClientes] = useState(initialClientes);
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [clienteEdit, setClienteEdit] = useState<Cliente | null>(null);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState<string | null>(null);

  const handleEdit = (cliente: Cliente) => {
    setClienteEdit(cliente);
    setIsRegistrarOpen(true);
  };

  const handleDeleteRequest = (uid: string) => {
    setClienteAEliminar(uid);
    setIsEliminarModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (clienteAEliminar) {
      try {
        await eliminarCliente(clienteAEliminar);
        setClientes(clientes.filter(cliente => cliente.uid !== clienteAEliminar));
        setClienteAEliminar(null);
        setIsEliminarModalOpen(false);
      } catch (error) {
        console.error("Error eliminando cliente:", error);
      }
    }
  };

  return (
    <>
     <Navbar />   
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
      <button onClick={() => { setClienteEdit(null); setIsRegistrarOpen(true); }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center">
        Registrar Cliente
      </button>

      <ListaClientes clientes={clientes} onEdit={handleEdit} onDeleteRequest={handleDeleteRequest} />
      
      <RegistrarClienteModal isOpen={isRegistrarOpen} setIsOpen={setIsRegistrarOpen} cliente={clienteEdit} />
      
      <EliminarClienteModal
        isOpen={isEliminarModalOpen}
        onClose={() => setIsEliminarModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>

    </>
   
  );
}
