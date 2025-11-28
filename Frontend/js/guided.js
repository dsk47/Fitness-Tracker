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

// ---------- helper: convert YouTube URL -> embed URL ----------
function toEmbedUrl(url) {
  try {
    const u = new URL(url);

    // https://www.youtube.com/watch?v=VIDEO_ID
    if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
      const v = u.searchParams.get("v");
      if (v) {
        return `https://www.youtube.com/embed/v7AYKMP6rOE`;
      }
    }

    // https://youtu.be/VIDEO_ID
    if (u.hostname.includes("youtu.be") && u.pathname === "/watch") {
      const v = u.pathname.replace("/", "");
      if (v) {
        return `https://www.youtube.com/embed/UBMk30rjy0o`;
      }
    }

    // otherwise just return original URL
    return url;
  } catch (e) {
    return url;
  }
}

// ---------- load routines ----------
async function loadRoutines() {
  try {
    const data = await getJSON("/guided");   // backend: GET /api/guided
    const all = data.all || data;           // support both {all, recommended} or plain array
    const recommended = data.recommended || [];

    // Recommended
    recommendedList.innerHTML = "";
    recommended.forEach((r) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${r.title}</strong> (${r.duration} mins, ${r.level})
        <button data-id="${r._id}" class="start-btn">Start</button>
      `;
      recommendedList.appendChild(div);
    });

    // All routines
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

// ---------- start routine & play video ----------
async function startRoutine(routineId) {
  try {
    const r = await getJSON(`/guided/${routineId}`); // backend: GET /api/guided/:id

    // clear old timer if any
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    modal.style.display = "block";
    modalTitle.textContent = r.title;

    // convert to embed URL for iframe
    modalVideo.src = toEmbedUrl(r.videoUrl);

    // countdown timer
    let remaining = (r.duration || 0) * 60; // seconds

    function updateTimer() {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      modalTimer.textContent = `Time left: ${mins}m ${secs}s`;
      remaining--;
      if (remaining < 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        finishRoutine(r);
      }
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    // cancel button handler
    modalCancel.onclick = () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      modal.style.display = "none";
      modalVideo.src = "";   // stop video
      modalTimer.textContent = "";
    };
  } catch (err) {
    alert("Failed to start routine: " + err.message);
  }
}

// ---------- log guided workout when finished ----------
async function finishRoutine(routine) {
  alert("Session complete! Logging workout.");
  modal.style.display = "none";
  modalVideo.src = "";
  modalTimer.textContent = "";

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
