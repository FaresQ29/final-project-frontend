// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBDoP5lYfLGD4oLCF7BdeE69VwxqY-pKs",
  authDomain: "project-chat-3c4f0.firebaseapp.com",
  projectId: "project-chat-3c4f0",
  storageBucket: "project-chat-3c4f0.appspot.com",
  messagingSenderId: "32251055415",
  appId: "1:32251055415:web:14e3b66e70163236779eb2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage()
export const db = getFirestore(app)