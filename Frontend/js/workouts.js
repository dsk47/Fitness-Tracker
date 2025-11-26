// frontend/js/workouts.js
requireAuth();

const workoutForm = document.getElementById("workoutForm");
const workoutList = document.getElementById("workoutList");

/* ---------- QUICK SUGGESTIONS DATA ---------- */
const WORKOUT_SUGGESTIONS = [
  { type: "Cardio",      name: "Morning Run",         duration: 30, calories: 250, steps: 4000 },
  { type: "Cardio",      name: "Evening Walk",        duration: 20, calories: 120, steps: 3000 },
  { type: "Strength",    name: "Upper Body Dumbbells",duration: 25, calories: 180, steps: 1500 },
  { type: "Strength",    name: "Leg Day Workout",     duration: 30, calories: 220, steps: 2000 },
  { type: "HIIT",        name: "Tabata Session",      duration: 15, calories: 200, steps: 2500 },
  { type: "Flexibility", name: "Yoga Flow",           duration: 30, calories: 100, steps: 500  },
];

/* ---------- RENDER SUGGESTION CARDS ---------- */
function renderWorkoutSuggestions() {
  const box = document.getElementById("workoutSuggestions");
  if (!box) return;

  box.innerHTML = "";
  WORKOUT_SUGGESTIONS.forEach((w) => {
    const div = document.createElement("div");
    div.className = "suggest-card";
    div.innerHTML = `
      <div class="suggest-card-title">${w.name}</div>
      <div class="tag-pill">${w.type}</div>
      <div style="font-size:12px;margin-top:4px;">
        ~${w.duration} min · ${w.calories} cal
      </div>
    `;
    div.onclick = () => {
      document.getElementById("workoutType").value = w.type;
      document.getElementById("workoutName").value = w.name;
      document.getElementById("workoutDuration").value = w.duration || "";
      document.getElementById("workoutCalories").value = w.calories || "";
      document.getElementById("workoutSteps").value = w.steps || "";
    };
    box.appendChild(div);
  });
}

/* ---------- LOAD WORKOUTS FROM BACKEND ---------- */
async function loadWorkouts() {
  try {
    const workouts = await getJSON("/workouts"); // uses utils.js
    workoutList.innerHTML = "";

    if (!workouts.length) {
      workoutList.textContent = "No workouts logged yet.";
      return;
    }

    workouts.forEach((w) => {
      const div = document.createElement("div");
      div.className = "list-item";
      const date = w.date ? w.date.slice(0, 10) : "";
      div.textContent = `${date} - ${w.name || "Workout"} (${w.duration || 0} mins, ${w.calories || 0} cal)`;
      workoutList.appendChild(div);
    });
  } catch (err) {
    alert("Failed to load workouts: " + err.message);
  }
}

/* ---------- HANDLE FORM SUBMIT ---------- */
if (workoutForm) {
  workoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      type: document.getElementById("workoutType").value.trim(),
      name: document.getElementById("workoutName").value.trim(),
      duration: Number(document.getElementById("workoutDuration").value) || 0,
      calories: Number(document.getElementById("workoutCalories").value) || 0,
      steps: Number(document.getElementById("workoutSteps").value) || 0,
      source: "manual",
    };

    try {
      await postJSON("/workouts", payload); // uses utils.js
      workoutForm.reset();
      loadWorkouts();
    } catch (err) {
      alert("Failed to add workout: " + err.message);
    }
  });
}

/* ---------- INITIALIZE PAGE ---------- */
renderWorkoutSuggestions();
loadWorkouts();
