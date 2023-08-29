import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaB5z1qAt5CYdxy0nTBzLDp-2QO6bQYts",
  authDomain: "delivery-startup-a9159.firebaseapp.com",
  projectId: "delivery-startup-a9159",
  storageBucket: "delivery-startup-a9159.appspot.com",
  messagingSenderId: "687710718186",
  appId: "1:687710718186:web:7f99309ee1a84d96a12f93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
