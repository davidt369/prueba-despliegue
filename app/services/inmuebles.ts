// src/services/inmuebleService.ts

import { addDoc, collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Inmueble } from '../interfaces/inmueble';

/**
 * Convierte un archivo de imagen a formato WebP en Base64.
 * @param file Archivo a convertir.
 * @returns Una promesa con el string en Base64.
 */
// inmuebleService.ts

export const convertFileToWebPBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/webp', 0.8));
        } else {
          reject(new Error("No se pudo obtener el contexto del canvas."));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
  });
};


/**
 * Sube una imagen a Firebase Storage y devuelve su URL.
 * @param base64String String en Base64 de la imagen.
 * @param uid ID único del inmueble.
 * @param fileName Nombre del archivo.
 * @returns URL de la imagen subida.
 */
const uploadImageToFirebase = async (base64String: string, uid: string, fileName: string): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `inmuebles/${uid}/${fileName}.webp`);
  await uploadString(storageRef, base64String, 'data_url');
  return getDownloadURL(storageRef);
};

/**
 * Sube varias imágenes a Firebase Storage y devuelve sus URLs.
 * @param images Base64 de las imágenes a subir.
 * @param uid ID único del inmueble.
 * @returns URLs de las imágenes subidas.
 */
export const uploadImagesToFirebase = async (images: string[], uid: string): Promise<string[]> => {
  const imageUrls: string[] = [];
  for (const [index, base64String] of images.entries()) {
    const url = await uploadImageToFirebase(base64String, uid, `image-${index}`);
    imageUrls.push(url);
  }
  return imageUrls;
};

/**
 * Guarda el inmueble en Firebase Firestore.
 * @param inmueble Datos del inmueble.
 * @returns ID del documento creado.
 */
export const createInmueble = async (inmueble: Inmueble): Promise<string> => {
  const inmuebleCollection = collection(db, 'inmuebles');
  const q = query(inmuebleCollection, where('codigo', '==', inmueble.codigo));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) throw new Error('El código del inmueble ya existe.');

  const docRef = await addDoc(inmuebleCollection, inmueble);
  return docRef.id;
};

/**
 * Actualiza el inmueble en Firestore con las URLs de las imágenes.
 * @param inmuebleId ID del inmueble.
 * @param imageUrls URLs de las imágenes.
 */
export const updateInmuebleWithImages = async (inmuebleId: string, imageUrls: string[]) => {
  const inmuebleRef = doc(db, 'inmuebles', inmuebleId);
  await setDoc(inmuebleRef, { imagenesUrls: imageUrls }, { merge: true });
};

/**
 * Crea un inmueble y sube las imágenes.
 * @param inmueble Datos del inmueble.
 * @param images Base64 de las imágenes.
 * @returns ID del inmueble creado.
 */
export const saveInmuebleWithImages = async (inmueble: Inmueble, images: string[]): Promise<string> => {
  try {
    const inmuebleId = await createInmueble(inmueble);

    const imagenesUrls = await uploadImagesToFirebase(images, inmuebleId);

    await updateInmuebleWithImages(inmuebleId, imagenesUrls);

    return inmuebleId;
  } catch (error) {
    console.error("Error al guardar el inmueble:", error);
    throw error;
  }
};


//obtener inmuebles
export const getInmuebles = async (): Promise<Inmueble[]> => {
  const inmueblesCollection = collection(db, 'inmuebles');
  const q = query(inmueblesCollection, where('eliminar', '==', false));
  const querySnapshot = await getDocs(q);
  const inmuebles: Inmueble[] = [];
  querySnapshot.forEach((doc) => {
    inmuebles.push({ id: doc.id, ...doc.data() } as Inmueble);
  });
  return inmuebles;
};


//getInmuebleByCodigo

export const getInmuebleByCodigo = async (codigo: string) => {
  const inmueblesCollection = collection(db, 'inmuebles');
  const q = query(inmueblesCollection, where('codigo', '==', codigo));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) throw new Error('Inmueble no encontrado.');
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as unknown as Inmueble;
};


//getInmuebleById

export const getInmuebleById = async (id: string) => {
  const inmuebleDoc = doc(db, 'inmuebles', id);
  const docSnap = await getDoc(inmuebleDoc);
  if (!docSnap.exists()) throw new Error('Inmueble no encontrado.');
  return { id: docSnap.id, ...docSnap.data() } as unknown as Inmueble;
};

//deleteInmueble
export const deleteInmueble = async (id: string) => {
  try {
    await setDoc(doc(db, 'inmuebles', id), { eliminar: true }, { merge: true });
  } catch (error) {
    console.error('Error al eliminar el inmueble:', error);
    throw error;
  }
};