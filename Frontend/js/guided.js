// frontend/js/guided.js
requireAuth();

const routineList = document.getElementById("routine-list");
const recommendedList = document.getElementById("recommended-list");

const modal = document.getElementById("session-modal");
const modalTitle = document.getElementById("session-title");
const modalTimer = document.getElementById("session-timer");
const modalVideo = document.getElementById("session-video");
const modalCancel = document.getElementById("session-cancel");

let timerInterval = null;

async function loadRoutines() {
  try {
    const data = await getJSON("/guided"); // or /routines
    const all = data.all || data;          // adjust to your backend response
    const recommended = data.recommended || [];

    // Render recommended
    recommendedList.innerHTML = "";
    recommended.forEach((r) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${r.title}</strong> (${r.duration} mins, ${r.level}) 
        <button data-id="${r._id}" class="start-btn">Start</button>
      `;
      recommendedList.appendChild(div);
    });

    // Render all routines
    routineList.innerHTML = "";
    all.forEach((r) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${r.title}</strong> (${r.duration} mins, ${r.level}) 
        <button data-id="${r._id}" class="start-btn">Start</button>
      `;
      routineList.appendChild(div);
    });

    // Attach click handlers
    document.querySelectorAll(".start-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        startRoutine(id);
      });
    });
  } catch (err) {
    alert("Failed to load routines: " + err.message);
  }
}

async function startRoutine(routineId) {
  try {
    const r = await getJSON(`/guided/${routineId}`);

    modal.style.display = "block";
    modalTitle.textContent = r.title;
    modalVideo.src = r.videoUrl;           // Use embedded YouTube URL
    let remaining = r.duration * 60;       // seconds

    function updateTimer() {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      modalTimer.textContent = `Time left: ${mins}m ${secs}s`;
      remaining--;
      if (remaining < 0) {
        clearInterval(timerInterval);
        finishRoutine(r);
      }
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    modalCancel.onclick = () => {
      clearInterval(timerInterval);
      modal.style.display = "none";
      modalVideo.src = "";
    };
  } catch (err) {
    alert("Failed to start routine: " + err.message);
  }
}

async function finishRoutine(routine) {
  alert("Session complete! Logging workout.");
  modal.style.display = "none";
  modalVideo.src = "";

  try {
    await postJSON("/workouts", {
      type: "guided",
      name: routine.title,
      duration: routine.duration,
      calories: routine.approxCalories || 0,
      source: "guided",
    });
  } catch (err) {
    alert("Failed to auto-log guided workout: " + err.message);
  }
}

loadRoutines();
