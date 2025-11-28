// frontend/js/metrics.js
requireAuth();

const metricForm = document.getElementById("metric-form");
const metricList = document.getElementById("metric-list");

async function loadMetrics() {
  try {
    const metrics = await getJSON("/metrics");
    metricList.innerHTML = "";
    metrics.forEach((m) => {
  const li = document.createElement("li");

  // Format date as yyyy-mm-dd (remove time)
  const onlyDate = new Date(m.date).toISOString().split("T")[0];

  li.textContent = `${onlyDate} - ${m.weight} kg, body fat: ${m.bodyFat || "-"}%`;
  metricList.appendChild(li);
});

  } catch (err) {
    alert("Failed to load metrics: " + err.message);
  }
}

if (metricForm) {
  metricForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      date: document.getElementById("metric-date").value,
      weight: Number(document.getElementById("metric-weight").value),
      bodyFat: Number(document.getElementById("metric-bodyfat").value) || null,
    };
    try {
      await postJSON("/metrics", payload);
      metricForm.reset();
      loadMetrics();
    } catch (err) {
      alert("Failed to save metric: " + err.message);
    }
  });
}

loadMetrics();
