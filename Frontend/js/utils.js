// frontend/js/utils.js
const API_BASE_URL = "http://localhost:5000/api";

// ----- Token helpers -----
function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

// ----- Simple redirect helpers -----
function redirectToLogin() {
  window.location.href = "login.html";
}

function redirectToDashboard() {
  window.location.href = "dashboard.html";
}

// Require auth on protected pages
function requireAuth() {
  const token = getToken();
  if (!token) {
    redirectToLogin();
  }
}

// ----- Generic API helpers -----
async function apiRequest(path, method = "GET", body = null) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

function getJSON(path) {
  return apiRequest(path, "GET");
}

function postJSON(path, data) {
  return apiRequest(path, "POST", data);
}

function putJSON(path, data) {
  return apiRequest(path, "PUT", data);
}

function deleteJSON(path) {
  return apiRequest(path, "DELETE");
}
