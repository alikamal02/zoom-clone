// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";  

const firebaseConfig = {
  apiKey: "AIzaSyDEUcNJZMcvgRNVzYnpQv43wLky7MCU05Y",
  authDomain: "formdvideo.firebaseapp.com",
  databaseURL: "https://formdvideo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "formdvideo",
  storageBucket: "formdvideo.appspot.com",
  messagingSenderId: "546968852990",
  appId: "1:546968852990:web:338de1746380f021ff88af",
  measurementId: "G-ENJYQV1RSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
