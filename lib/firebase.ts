import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUNNtOVjCq40fneEp-DbDCVtIVGBVI6Pg",
  authDomain: "pet-project-1d196.firebaseapp.com",
  projectId: "pet-project-1d196",
  storageBucket: "pet-project-1d196.firebasestorage.app",
  messagingSenderId: "261670745146",
  appId: "1:261670745146:web:eaf0ff381b1184bdee3103"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
