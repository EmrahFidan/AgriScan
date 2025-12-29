import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ImageData } from '../types';

export async function getImages(): Promise<ImageData[]> {
  const q = query(collection(db, 'images'), orderBy('uploadedAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
  })) as ImageData[];
}

export function subscribeToImages(callback: (images: ImageData[]) => void) {
  const q = query(collection(db, 'images'), orderBy('uploadedAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const images = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
    })) as ImageData[];
    
    callback(images);
  });
}
