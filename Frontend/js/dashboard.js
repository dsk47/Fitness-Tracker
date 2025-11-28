// frontend/js/dashboard.js

requireAuth();

// ------- DASHBOARD SUMMARY -------
async function loadDashboard() {
  try {
    const data = await getJSON("/analytics/summary");
    const summaryEl = document.getElementById("summary-text");

    if (summaryEl) {
      summaryEl.textContent =
        `Fitness Score Today: ${data.todayScore ?? 0} | ` +
        `Workouts Today: ${data.todayWorkouts || 0}`;
    }

    // We removed upcoming session UI, so we skip upcomingRoutine usage
  } catch (err) {
    alert("Failed to load dashboard: " + err.message);
  }
}

// ------- MOTIVATIONAL QUOTE CAROUSEL -------
document.addEventListener("DOMContentLoaded", () => {
  const quotes = [
    "Small steps every day lead to big results.",
    "Your only competition is the person you were yesterday.",
    "Discipline beats motivation. Show up today.",
    "Progress is progress, no matter how small.",
    "Your body can stand almost anything. It’s your mind you must convince.",
    "Consistency is the secret. Keep going."
  ];

  const quoteBox = document.getElementById("quoteCarousel");
  if (!quoteBox) {
    console.warn("quoteCarousel element not found!");
    return;
  }

  let quoteIndex = 0;

  function showNextQuote() {
    quoteBox.style.opacity = 0;
    setTimeout(() => {
      quoteBox.textContent = `"${quotes[quoteIndex]}"`;
      quoteBox.style.opacity = 1;
      quoteIndex = (quoteIndex + 1) % quotes.length;
    }, 600);
  }

  showNextQuote();                 // show first quote
  setInterval(showNextQuote, 4000); // rotate every 4s

  // Also load dashboard data
  loadDashboard();
});
