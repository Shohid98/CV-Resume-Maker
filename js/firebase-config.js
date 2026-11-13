// ==========================================
// Firebase Configuration & Auth/DB Setup
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
      import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
      import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyCxvKQFLWXJF77U5hgssFkr_do_GZv8OBI",
        authDomain: "resume-maker-b05b6.firebaseapp.com",
        projectId: "resume-maker-b05b6",
        storageBucket: "resume-maker-b05b6.firebasestorage.app",
        messagingSenderId: "275583785714",
        appId: "1:275583785714:web:7f371d98725405cf6c4e6b",
        measurementId: "G-QL0E1GH373"
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      window.firebaseAuth = auth;
      window.firebaseDb = db;
      window.firebaseMethods = { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc, sendPasswordResetEmail };
