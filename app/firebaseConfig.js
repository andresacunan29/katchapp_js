import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDUq6EAAJVrbKtxYp8nA2-GhOkuk9gf5zs",
  authDomain: "katchapp-cd9f1.firebaseapp.com",
  projectId: "katchapp-cd9f1",
  storageBucket: "katchapp-cd9f1.appspot.com",
  messagingSenderId: "97234867062",
  appId: "1:97234867062:web:687f2eb05d78695d882057",
  measurementId: "G-NHQ8GZXWE3"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };