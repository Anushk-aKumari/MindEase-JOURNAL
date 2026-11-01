import { auth } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const journalBtn = document.getElementById("journalBtn");
const loginPrompt = document.getElementById("loginPrompt");

onAuthStateChanged(auth, (user) => {
  journalBtn.addEventListener('click', () => {
    if (user) {
      window.location.href = "journal.html";
    } else {
      loginPrompt.classList.remove("hidden");
    }
  });
});
