import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { db } from "~/config/firebase";


const convertFileToWebPBase64 = async (file: File): Promise<string> => {
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
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
              }
            },
            'image/webp',
            0.8
          );
        }
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
  });
};

const uploadImageToFirebase = async (base64String: string, uid: string, fileName: string): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `inmuebles/${uid}/${fileName}.webp`);
  await uploadString(storageRef, base64String, 'data_url');
  return getDownloadURL(storageRef);
};

export const uploadImagesToFirebase = async (files: File[], uid: string): Promise<string[]> => {
  const imageUrls = [];
  for (const file of files) {
    const base64String = await convertFileToWebPBase64(file);
    const url = await uploadImageToFirebase(base64String, uid, file.name);
    imageUrls.push(url);
  }
  return imageUrls;
};

export const updateInmuebleWithImages = async (inmuebleId: string, imageUrls: string[]) => {
  const inmuebleRef = doc(db, 'inmuebles', inmuebleId);
  await setDoc(inmuebleRef, { imagenesUrls: imageUrls }, { merge: true });
}