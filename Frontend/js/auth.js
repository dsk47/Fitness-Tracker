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
