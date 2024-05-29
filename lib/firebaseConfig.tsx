// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const database = getDatabase(app); // add this

export { database }; // add this