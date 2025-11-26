// js/reminders.js
const API_BASE = window.API_BASE || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function requireAuth() {
  if (!getToken()) window.location.href = "login.html";
}

async function authFetch(url, options = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: "Bearer " + token,
    },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

async function loadReminders() {
  try {
    const data = await authFetch(`${API_BASE}/reminders`);
    const list = document.getElementById("reminderList");
    list.innerHTML = "";

    if (!data.length) {
      list.textContent = "No reminders yet.";
      return;
    }

    data.forEach((r) => {
      const div = document.createElement("div");
      div.className = "list-item";
      const d = r.date ? r.date.slice(0, 10) : "";
      const t = r.time || "";
      div.innerHTML = `
        <b>${r.title || "Reminder"}</b> 
        <span style="font-size:12px; color:#6b7280;">
          ${d} ${t} · ${r.type || "general"}
        </span>
        <button style="float:right; font-size:12px;" onclick="deleteReminder('${r._id}')">
          ✕
        </button>
      `;
      list.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    alert("Failed to load reminders");
  }
}

async function deleteReminder(id) {
  if (!confirm("Delete this reminder?")) return;
  try {
    await authFetch(`${API_BASE}/reminders/${id}`, { method: "DELETE" });
    loadReminders();
  } catch {
    alert("Failed to delete");
  }
}

async function handleReminderSubmit(e) {
  e.preventDefault();
  const title = document.getElementById("remTitle").value.trim();
  const date = document.getElementById("remDate").value;
  const time = document.getElementById("remTime").value;
  const type = document.getElementById("remType").value;

  if (!title || !date || !time) {
    alert("Please fill title, date and time");
    return;
  }

  try {
    await authFetch(`${API_BASE}/reminders`, {
      method: "POST",
      body: JSON.stringify({ title, date, time, type }),
    });
    document.getElementById("reminderForm").reset();
    loadReminders();
  } catch (e) {
    console.error(e);
    alert("Failed to save reminder");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();
  const form = document.getElementById("reminderForm");
  if (form) form.addEventListener("submit", handleReminderSubmit);
  loadReminders();
});
