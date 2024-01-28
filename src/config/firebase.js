import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDF7Ckhn9mLxRIsBcyDmjsTpDr-bwrLKBk",
  authDomain: "chatbot-gemini-api.firebaseapp.com",
  projectId: "chatbot-gemini-api",
  storageBucket: "chatbot-gemini-api.appspot.com",
  messagingSenderId: "1026986453987",
  appId: "1:1026986453987:web:b70eeac83fb3b97abd8ed6",
  measurementId: "G-R385XGPPC1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
