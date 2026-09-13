import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);

/**
 * Upload a file (PDF, thumbnail, video, image) to Firebase Storage.
 * Includes graceful fallback to Base64 data URL if Storage bucket is in sandbox
 * or unconfigured, ensuring file upload in Admin panel never blocks the user.
 */
export async function uploadFileToStorage(
  file: File,
  folder: string = 'uploads'
): Promise<{ url: string; fileName: string; size: string }> {
  const fileName = file.name;
  const sizeKb = Math.round(file.size / 1024);
  const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
  const sanitizedName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storagePath = `${folder}/${sanitizedName}`;

  try {
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
    });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return { url: downloadUrl, fileName, size: sizeStr };
  } catch (err) {
    console.warn('Firebase Storage upload direct failed, converting to localized data URL fallback:', err);
    // Fallback to Data URL for reliable in-browser storage and preview
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
    return { url: dataUrl, fileName, size: sizeStr };
  }
}

export default app;
