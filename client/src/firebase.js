// src/firebase.js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBk800T_MCU14Wf4b3WpZwCtmVr-00rm60",
  authDomain: "resume-screener-53aac.firebaseapp.com",
  projectId: "resume-screener-53aac",
  storageBucket: "resume-screener-53aac.firebasestorage.app",
  messagingSenderId: "705849028217",
  appId: "1:705849028217:web:c101fe23445ae97976eea8"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };