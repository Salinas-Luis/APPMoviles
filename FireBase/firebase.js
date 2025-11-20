// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnfX6mwfVhByWlWDwyimwTzBLM3M5tbbw",
  authDomain: "primerproyecto-d7e4b.firebaseapp.com",
  projectId: "primerproyecto-d7e4b",
  storageBucket: "primerproyecto-d7e4b.firebasestorage.app",
  messagingSenderId: "478672988484",
  appId: "1:478672988484:web:558f86874bd2f705990f11",
  measurementId: "G-1HDLHTCMN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
/*/
/ Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnfX6mwfVhByWlWDwyimwTzBLM3M5tbbw",
  authDomain: "primerproyecto-d7e4b.firebaseapp.com",
  projectId: "primerproyecto-d7e4b",
  storageBucket: "primerproyecto-d7e4b.firebasestorage.app",
  messagingSenderId: "478672988484",
  appId: "1:478672988484:web:558f86874bd2f705990f11",
  measurementId: "G-1HDLHTCMN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/