import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithRedirect, GoogleAuthProvider, browserSessionPersistence, inMemoryPersistence } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDYyzCzlq4DWio0h2Xj5JHmhh_zpiCeJMI",
    authDomain: "food-app-0.firebaseapp.com",
    projectId: "food-app-0",
    storageBucket: "food-app-0.appspot.com",
    messagingSenderId: "530350391167",
    appId: "1:530350391167:web:dc8760d2c1bd79728f644a",
    measurementId: "G-78N9DPJGQK"
};

// Exports
export const firebase = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebase);
export const db = getFirestore();
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const signInMethod = signInWithRedirect;
export const persistence = inMemoryPersistence;
