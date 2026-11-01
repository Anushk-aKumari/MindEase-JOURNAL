// MindEaseJournal/scripts/register.js
import { auth } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const form = document.getElementById("registerForm");
const errorDisplay = document.getElementById("registerError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });
    window.location.href = "index.html";
  } catch (error) {
    console.error("Registration error:", error.message);
    errorDisplay.classList.remove("hidden");
  }
});
