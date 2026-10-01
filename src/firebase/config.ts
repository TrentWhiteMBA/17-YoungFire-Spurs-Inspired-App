import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export interface FirebaseHealthStatus {
  isConnected: boolean;
  mode: 'live_cloud' | 'local_storage_fallback';
  error?: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const hasFirebaseEnvVars: boolean = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (hasFirebaseEnvVars) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  }
} catch (err) {
  console.warn('Firebase initialization error, running in local offline mode:', err);
}

export const checkFirebaseHealth = async (): Promise<FirebaseHealthStatus> => {
  if (!hasFirebaseEnvVars || !db) {
    return {
      isConnected: false,
      mode: 'local_storage_fallback',
      error: 'Missing VITE_FIREBASE_* environment variables. Operating in local storage cache mode.'
    };
  }

  try {
    // Quick ping to check Firestore connection
    const healthDoc = doc(db, '_health_check', 'ping');
    await getDoc(healthDoc);
    return {
      isConnected: true,
      mode: 'live_cloud'
    };
  } catch (err: any) {
    // Even if permission is denied, the network reachable test succeeded
    if (err?.code === 'permission-denied' || err?.code === 'not-found') {
      return {
        isConnected: true,
        mode: 'live_cloud'
      };
    }
    return {
      isConnected: false,
      mode: 'local_storage_fallback',
      error: err?.message || 'Network unreachable'
    };
  }
};

export { app, db, auth, storage };
export default app;
