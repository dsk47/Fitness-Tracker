// frontend/js/auth.js

// Handle Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
      const data = await postJSON("/auth/login", { email, password });
      setToken(data.token);
      alert("Login successful!");
      redirectToDashboard();
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });
}

// Handle Register
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    try {
      await postJSON("/auth/register", { name, email, password });
      alert("Registration successful! Please login.");
      window.location.href = "login.html";
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  });
}

// Logout (used in navbar)
function logout() {
  clearToken();
  redirectToLogin();
}
window.logout = logout; // so you can call from HTML onclick

/* =========================
   PROFILE ICON POPUP LOGIC
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("profileContainer");
  const icon = document.getElementById("profileIcon");
  const popup = document.getElementById("profilePopup");

  // If this page doesn't have the profile icon/popup, skip
  if (!container || !icon || !popup) return;

  // Toggle dropdown on icon click
  icon.addEventListener("click", async (e) => {
    e.stopPropagation(); // don't trigger document click

    // Toggle .open class on container
    const isOpen = container.classList.toggle("open");

    // If just opened, fetch analytics and fill the small stats
    if (isOpen) {
      try {
        const data = await getJSON("/analytics/summary");
        const scoreEl = document.getElementById("popupScore");
        const workoutsEl = document.getElementById("popupWorkouts");

        if (scoreEl) {
          scoreEl.textContent = "Score: " + (data.todayScore ?? 0);
        }
        if (workoutsEl) {
          workoutsEl.textContent = "Workouts: " + (data.todayWorkouts ?? 0);
        }
      } catch (err) {
        console.error("Profile popup error:", err);
      }
    }
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      container.classList.remove("open");
    }
  });
});
