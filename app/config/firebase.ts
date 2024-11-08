// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqDMX7vQy4nAAEWmqGPvIBVuMCi_BKNHg",
  authDomain: "ecomerce-b18d2.firebaseapp.com",
  projectId: "ecomerce-b18d2",
  storageBucket: "ecomerce-b18d2.appspot.com",
  messagingSenderId: "964782725340",
  appId: "1:964782725340:web:896b52ffc7c4df6ac57c19",
  measurementId: "G-JXK5BJYTSE"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Inicializa Analytics solo en el cliente
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };