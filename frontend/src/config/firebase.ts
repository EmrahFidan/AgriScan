import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmH4B-LGhfuSSIeDf9Pbog6e0Vng-dNps",
  authDomain: "agriscan-3ea8d.firebaseapp.com",
  projectId: "agriscan-3ea8d",
  storageBucket: "agriscan-3ea8d.firebasestorage.app",
  messagingSenderId: "780748696312",
  appId: "1:780748696312:web:21eced1c41f69add02290d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;
