import { auth } from './firebase-init.js';
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const errorDisplay = document.getElementById("loginError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login error:", error.message);
    errorDisplay.classList.remove("hidden");
  }
});
