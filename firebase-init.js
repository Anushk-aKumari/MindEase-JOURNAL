// scripts/firebase-init.js

// Import Firebase modules via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBY40UTZmDSucvQ3dfQAMW_18mjVUdwQP4",
  authDomain: "mindease-journal.firebaseapp.com",
  projectId: "mindease-journal",
  storageBucket: "mindease-journal.firebasestorage.app",
  messagingSenderId: "516767013356",
  appId: "1:516767013356:web:81805feac8ba01066548c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth and db for use in other files
export { auth, db };
