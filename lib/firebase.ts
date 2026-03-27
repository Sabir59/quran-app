import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAXuz3y1KlTQO_Xe78hbnTYWVy89ObSLBY',
  authDomain: 'alquran-app-f30d6.firebaseapp.com',
  projectId: 'alquran-app-f30d6',
  storageBucket: 'alquran-app-f30d6.firebasestorage.app',
  messagingSenderId: '530346082853',
  appId: '1:530346082853:web:9a95f3d74b2fbfadc2b5cc',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
