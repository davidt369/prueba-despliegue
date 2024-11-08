import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "~/config/firebase";
import Usuario from "~/interfaces/usuarios";

export async function crearUsuario(usuario: Usuario): Promise<void> {
  try {
    if (!usuario.uid) {
      throw new Error("El UID del usuario es indefinido.");
    }
    await setDoc(doc(db, "usuarios", usuario.uid), usuario);
    console.log("Documento creado con éxito en Firestore.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error añadiendo el documento: ", error.message);
    } else {
      console.error("Error desconocido añadiendo el documento");
    }
    throw error;
  }
}


//getUsuarios


export  async function getUsuarios(): Promise<Usuario[]> {
  const usuarios: Usuario[] = []; // Inicializar el array de usuarios

  try {
    const usuariosCollection = collection(db, "usuarios");
    const querySnapshot = await getDocs(usuariosCollection);

    querySnapshot.forEach((doc) => {
      usuarios.push(doc.data() as Usuario);
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }

  return usuarios;
}

export  async function updateUsuario(usuario: Usuario): Promise<void> {
  try {
    if (!usuario.uid) {
      throw new Error("El UID del usuario es indefinido.");
    }

    // Solo actualizamos los campos necesarios usando merge: true
    await setDoc(doc(db, "usuarios", usuario.uid), usuario, { merge: true });
    console.log("Documento actualizado con éxito en Firestore.");
  } catch (error) {
    console.error("Error actualizando el documento:", error instanceof Error ? error.message : error);
    throw error;
  }
}


export async function deleteUsuario(uid: string): Promise<void> {
  try {
    await setDoc(doc(db, "usuarios", uid), { estado: false }, { merge: true });
    console.log("Usuario eliminado con éxito.");
  } catch (error) {
    console.error("Error eliminando el usuario:", error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getUsuario(uid: string): Promise<Usuario | null> {
  try {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Usuario;
    }
  } catch (error) {
    console.error("Error obteniendo el usuario:", error instanceof Error ? error.message : error);
  }

  return null;
}