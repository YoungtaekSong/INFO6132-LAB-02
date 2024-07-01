import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBBlWIfVQBLA6Pw3bAjJrz6jlMKFi_YA_I",
    authDomain: "info6132-8199e.firebaseapp.com",
    projectId: "info6132-8199e",
    storageBucket: "info6132-8199e.appspot.com",
    messagingSenderId: "602327631085",
    appId: "1:602327631085:web:4314c4a3c20222396f38e4"
};

const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(app);