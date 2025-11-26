// frontend/js/diet.js
requireAuth();

const mealForm  = document.getElementById("mealForm");
const mealList  = document.getElementById("mealList");
const mealTotal = document.getElementById("dailyTotal");

/* ---------- SUGGESTED FOODS (SIMPLE CALORIE GUIDE) ---------- */
const FOOD_SUGGESTIONS = [
  { name: "2 Idlis + Sambar",      calories: 220 },
  { name: "Plain Dosa",           calories: 180 },
  { name: "Chapathi + Curry",     calories: 250 },
  { name: "Curd Rice (1 bowl)",   calories: 200 },
  { name: "Upma (1 plate)",       calories: 230 },
  { name: "Boiled Egg",           calories: 70  },
  { name: "Sprouts Salad",        calories: 120 },
  { name: "Fruit Bowl",           calories: 150 }
];

function renderFoodSuggestions() {
  const box = document.getElementById("foodSuggestions");
  if (!box) return;

  box.innerHTML = "";
  FOOD_SUGGESTIONS.forEach(f => {
    const div = document.createElement("div");
    div.className = "suggest-card";
    div.innerHTML = `
      <div class="suggest-card-title">${f.name}</div>
      <div style="font-size:12px;">~${f.calories} calories</div>
    `;
    div.onclick = () => {
      document.getElementById("foodName").value = f.name;
      document.getElementById("foodCalories").value = f.calories;
    };
    box.appendChild(div);
  });
}

/* ---------- LOAD TODAY'S MEALS FROM BACKEND ---------- */
async function loadMeals() {
  try {
    const data = await getJSON("/meals?date=today"); // uses utils.js
    mealList.innerHTML = "";
    let total = 0;

    if (!data.length) {
      mealList.textContent = "No meals logged today.";
      mealTotal.textContent = "0 calories";
      return;
    }

    data.forEach(m => {
      total += m.calories || 0;
      const div = document.createElement("div");
      div.className = "list-item";
      div.textContent = `${m.mealType}: ${m.foodName} (${m.calories || 0} cal)`;
      mealList.appendChild(div);
    });

    mealTotal.textContent = `${total} calories`;
  } catch (e) {
    alert("Load meals error: " + e.message);
  }
}

/* ---------- HANDLE ADD MEAL FORM SUBMIT ---------- */
if (mealForm) {
  mealForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      mealType: document.getElementById("mealType").value.trim(),
      foodName: document.getElementById("foodName").value.trim(),
      calories: Number(document.getElementById("foodCalories").value) || 0,
    };

    if (!payload.foodName) {
      alert("Please enter a food name");
      return;
    }

    try {
      await postJSON("/meals", payload); // uses utils.js
      mealForm.reset();
      loadMeals();
    } catch (e2) {
      alert("Add meal error: " + e2.message);
    }
  });
}

/* ---------- INITIALIZE PAGE ---------- */
renderFoodSuggestions();
loadMeals();
