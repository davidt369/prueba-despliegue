import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  createUserWithEmailAndPassword,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '~/config/firebase';
import Usuario from '~/interfaces/usuarios';

export const logOut = (): Promise<void> => signOut(auth);

export const getLoggedUser = async (): Promise<Usuario | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as Usuario;
          resolve({ uid: user.uid, ...userData });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

interface LoginResult {
  redirectUrl: string;
}

// Iniciar sesión con correo y contraseña
// Iniciar sesión con correo y contraseña
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener documento del usuario en Firestore
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado en la base de datos.');
    }

    const userData = userDoc.data() as Usuario;

    // Verificar si el usuario está activo
    if (!userData.estado) {
      throw new Error('Su cuenta está inactiva. Comuníquese con el administrador.');
    }

    const rol = userData.rol;

    // Redirigir según el rol del usuario
    switch (rol) {
      case 'administrador':
        return { redirectUrl: '/administrador' };
      case 'vendedor':
        return { redirectUrl: '/vendedor' };
      case 'empleado':
        return { redirectUrl: '/empleado' };
      default:
        throw new Error('Rol de usuario desconocido.');
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};


// Registrar usuario con correo y contraseña y crear su documento en Firestore
export const registerWithEmail = async (
  email: string,
  password: string,
  usuarioData: Omit<Usuario, "uid"> // Excluye `uid` aquí, se añadirá luego
): Promise<User | null> => {
  try {
    // Crea el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user || !user.uid) {
      throw new Error("No se pudo obtener el UID del usuario después del registro.");
    }

    // Crea el documento del usuario en Firestore usando el `uid` como ID
    await setDoc(doc(db, "usuarios", user.uid), {
      ...usuarioData,
      uid: user.uid, // Añade `uid` al documento
    });

    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Manejo de errores específicos de Firebase
      if (error.message.includes('auth/email-already-in-use')) {
        throw new Error('El correo electrónico ya está en uso.');
      } else if (error.message.includes('auth/invalid-email')) {
        throw new Error('El correo electrónico no es válido.');
      } else if (error.message.includes('auth/weak-password')) {
        throw new Error('La contraseña es demasiado débil.');
      }
      console.error('Error en el registro:', error.message);
    } else {
      console.error('Error en el registro:', error);
    }
    throw error;
  }
};


//recuperar contraseña

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Correo de recuperación enviado con éxito.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error enviando correo de recuperación:", error.message);
    } else {
      console.error("Error desconocido enviando correo de recuperación");
    }
    throw error;
  }
};