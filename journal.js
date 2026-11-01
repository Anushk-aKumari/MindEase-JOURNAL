import { auth, db } from './firebase-init.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
  startOfDay,
  subDays
} from "https://cdn.skypack.dev/date-fns"; // optional if we do weekly range

const journalEntry = document.getElementById("journalEntry");
const saveBtn = document.getElementById("saveEntryBtn");
const saveMessage = document.getElementById("saveMessage");
const wordCount = document.getElementById("wordCount");
const entryDate = document.getElementById("entryDate");
const entryList = document.getElementById("entryList"); // 📌 for history

// Mood Selection
let selectedMood = "";
const moodButtons = document.querySelectorAll(".mood-btn");
moodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    moodButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMood = btn.dataset.mood;
  });
});

// Word count
journalEntry.addEventListener("input", () => {
  wordCount.textContent = journalEntry.value.trim().split(/\s+/).filter(Boolean).length;
});

// Date display
const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
entryDate.textContent = today;

// 🔄 Load past entries
async function loadEntries(user) {
  const q = query(
    collection(db, "journalEntries"),
    where("uid", "==", user.uid),
    orderBy("timestamp", "desc")
  );
  console.log("Loading entries for user:", user.uid);
  const snapshot = await getDocs(q);
  entryList.innerHTML = "";

  snapshot.forEach(doc => {
    console.log("Fetched doc:", doc.data());
    const data = doc.data();
    const date = data.timestamp?.toDate().toLocaleString();
    const mood = data.mood || "📝";
    const text = data.entry.length > 200 ? data.entry.slice(0, 200) + "..." : data.entry;

    const card = document.createElement("div");
    card.classList.add("entry-card");

    card.innerHTML = `
        <div class="entry-meta">
            ${mood} • ${date}
            <button class="delete-btn" data-id="${doc.id}" title="Delete Entry">Delete</button>
        </div>
        <div class="entry-text">${text}</div>
        <button class="reflect-btn" data-text="${data.entry}" title="Get AI Reflection">Reflect</button>
        <div class="reflection-response hidden"></div>
    `;


    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete this entry?");
        if (!confirmDelete) return;

        try {
        await deleteDoc(doc.ref);
        loadEntries(user); // Refresh after delete
        } catch (err) {
            console.error("Failed to delete entry:", err);
        }
    
    });

    const reflectBtn = card.querySelector(".reflect-btn");
    const reflectionBox = card.querySelector(".reflection-response");

    reflectBtn.addEventListener("click", async () => {
        reflectBtn.disabled = true;
        reflectBtn.textContent = "Thinking...";

        try {
    // For now: fake reflection
            const fakeResponse = `It seems like you were processing some deep thoughts. It's completely okay to feel that way. Keep going.`;

            reflectionBox.textContent = fakeResponse;
            reflectionBox.classList.remove("hidden");
        } catch (err) {
            reflectionBox.textContent = "Something went wrong while reflecting.";
            reflectionBox.classList.remove("hidden");
            console.error("AI Reflection Error:", err);
        }

    reflectBtn.disabled = false;
    reflectBtn.textContent = "🧠 Reflect";
    });


    entryList.appendChild(card);
  });
}

// Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    // Load entries on page load
    loadEntries(user);
    drawMoodChart(user);

    // Save new entry
    saveBtn.addEventListener("click", async () => {
      const entry = journalEntry.value.trim();
      if (!entry || !selectedMood) return;

      try {
        await addDoc(collection(db, "journalEntries"), {
          uid: user.uid,
          mood: selectedMood,
          entry: entry,
          timestamp: serverTimestamp()
        });

        journalEntry.value = "";
        selectedMood = "";
        moodButtons.forEach(b => b.classList.remove("active"));
        wordCount.textContent = "0";
        saveMessage.classList.remove("hidden");

        setTimeout(() => {
          saveMessage.classList.add("hidden");
        }, 3000);

        // Reload journal history
        loadEntries(user);
      } catch (err) {
        console.error("Error saving entry:", err);
      }
    });
  }
});

// Draw mood chart
async function drawMoodChart(user) {
  const q = query(
    collection(db, "journalEntries"),
    where("uid", "==", user.uid),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);
  const moodCounts = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const mood = data.mood || "Unknown";
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  const moods = Object.keys(moodCounts);
  const counts = Object.values(moodCounts);

  const ctx = document.getElementById("moodChart").getContext("2d");

  new Chart(ctx, {
    type: "bar", // or 'line'
    data: {
      labels: moods,
      datasets: [{
        label: "Mood Frequency",
        data: counts,
        backgroundColor: "#76c7a5",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}
