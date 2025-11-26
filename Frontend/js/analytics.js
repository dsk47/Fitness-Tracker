// analytics.js
requireAuth();

const scoreEl = document.getElementById("score");
const summaryEl = document.getElementById("summary");
const heatmapEl = document.getElementById("heatmap");

(async () => {
  try {
    const data = await getJSON("/analytics/summary");

    // Fitness Score
    scoreEl.textContent = data.fitnessScore ?? "No data";

    // Last 7 days summary
    summaryEl.textContent =
      `Workouts: ${data.last7.workouts}, ` +
      `Calories Burned: ${data.last7.calories}, ` +
      `Steps: ${data.last7.steps}`;

    // Heatmap
    heatmapEl.innerHTML = "";
    data.heatmap.forEach(day => {
      const box = document.createElement("div");
      box.className = "heatmap-box";
      if (day.active) box.classList.add("active");
      heatmapEl.appendChild(box);
    });

  } catch (e) {
    alert("Analytics error: " + e.message);
  }
})();
