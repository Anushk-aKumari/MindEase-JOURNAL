import { auth } from './firebase-init.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Show logout
    logoutBtn.classList.remove("hidden");
    loginLink.classList.add("hidden");
    registerLink.classList.add("hidden");
  } else {
    // Show login/register
    logoutBtn.classList.add("hidden");
    loginLink.classList.remove("hidden");
    registerLink.classList.remove("hidden");
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "logout.html";
  } catch (err) {
    console.error("Logout failed", err);
  }
});
