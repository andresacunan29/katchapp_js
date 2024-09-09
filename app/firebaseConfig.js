import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";  // Uncomment if you plan to use analytics

const firebaseConfig = {
  apiKey: "AIzaSyDUq6EAAJVrbKtxYp8nA2-GhOkuk9gf5zs",
  authDomain: "katchapp-cd9f1.firebaseapp.com",
  projectId: "katchapp-cd9f1",
  storageBucket: "katchapp-cd9f1.appspot.com",
  messagingSenderId: "97234867062",
  appId: "1:97234867062:web:687f2eb05d78695d882057",
  measurementId: "G-NHQ8GZXWE3"
};

let app;
let auth;
// let analytics;  // Uncomment if you plan to use analytics

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // analytics = getAnalytics(app);  // Uncomment if you plan to use analytics
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { app, auth };
// export { app, auth, analytics };  // Use this line instead if you're using analytics