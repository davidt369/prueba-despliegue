
import { addDoc, collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Cliente } from '~/interfaces/clientes';

// Función para crear un Cliente
export async function crearCliente(cliente: Cliente): Promise<void> {
    try {
        // Agregamos el campo `activo` como `true` al crear un nuevo cliente
        await addDoc(collection(db, 'clientes'), { ...cliente, activo: true });
        console.log('Cliente creado con éxito en Firestore.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error añadiendo el documento: ', error.message);
        } else {
            console.error('Error desconocido añadiendo el documento');
        }
        throw error;
    }
}

// Función para obtener todos los Clientes activos
export async function obtenerClientes(): Promise<Cliente[]> {
    try {
        const q = query(collection(db, 'clientes'), where('activo', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as Cliente[];
    } catch (error) {
        console.error('Error obteniendo los documentos: ', error);
        throw error;
    }
}

// Función para obtener un Cliente por ID (incluye chequeo de estado activo)
export async function obtenerClientePorId(uid: string): Promise<Cliente | null> {
    try {
        const clienteRef = doc(db, 'clientes', uid);
        const docSnap = await getDoc(clienteRef);

        if (docSnap.exists()) {
            const cliente = { uid: docSnap.id, ...docSnap.data() } as Cliente;
            return cliente.activo ? cliente : null; // Devuelve solo si está activo
        } else {
            console.log('No se encontró el cliente');
            return null;
        }
    } catch (error) {
        console.error('Error obteniendo el documento: ', error);
        throw error;
    }
}

// Función para actualizar un Cliente
export async function actualizarCliente(uid: string, cliente: Partial<Cliente>): Promise<void> {
    try {
        const clienteRef = doc(db, "clientes", uid);
        await setDoc(clienteRef, cliente, { merge: true });
        console.log("Cliente actualizado con éxito en Firestore.");
    } catch (error) {
        console.error("Error actualizando el documento: ", error);
        throw new Error("No se pudo actualizar el cliente. Por favor, intente de nuevo.");
    }
}
// Función para "eliminar" un Cliente lógicamente
export async function eliminarCliente(uid: string): Promise<void> {
    try {
        const clienteRef = doc(db, 'clientes', uid);
        await setDoc(clienteRef, { activo: false }, { merge: true }); // Eliminación lógica
        console.log('Cliente marcado como inactivo en Firestore.');
    } catch (error) {
        console.error('Error eliminando el documento: ', error);
        throw error;
    }
}