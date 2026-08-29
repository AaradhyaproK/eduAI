// Dynamic API Base URL resolver
const API_BASE_URL = (typeof window !== "undefined" && (
  window.location.protocol === "file:" || 
  ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port && window.location.port !== "3000" && window.location.port !== "5173")
))
  ? "http://localhost:3000"
  : "";

const AUTH_TOKEN_KEY = "edumindAuthToken";
const CURRENT_STUDENT_KEY = "smartStudentPortalCurrentStudent";
const RESULTS_KEY = "smartStudentPortalResults";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getCurrentStudent() {
  const current = localStorage.getItem(CURRENT_STUDENT_KEY);
  return current ? JSON.parse(current) : null;
}

export function setCurrentStudent(student) {
  localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
}

export function clearCurrentStudent() {
  localStorage.removeItem(CURRENT_STUDENT_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getLocalResults() {
  const stored = localStorage.getItem(RESULTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalResult(resultData) {
  const results = getLocalResults();
  results.push(resultData);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

async function parseJsonResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Server returned non-JSON response (${res.status}). Please check backend API server.`);
  }
  return await res.json();
}

// Direct Registration API call
export async function registerUserApi(userData) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) throw new Error(data.message || "Failed to create account");
  if (data.token) setAuthToken(data.token);
  if (data.user) setCurrentStudent(data.user);
  return data;
}

export async function loginUserApi({ username, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data.message || "Invalid username or password.");
    if (data.token) setAuthToken(data.token);
    if (data.user) setCurrentStudent(data.user);
    return data;
  } catch (err) {
    if (err.message && !err.message.includes("Failed to fetch") && !err.message.includes("NetworkError") && !err.message.includes("Server returned non-JSON")) {
      throw err;
    }
    // Demo fallback for standalone mode
    const demoUser = {
      username,
      name: username,
      schoolName: "Day Care Centre School",
      className: "Class 5"
    };
    setCurrentStudent(demoUser);
    return { user: demoUser };
  }
}

export async function sendForgotOtpApi({ username, email }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email })
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  return data;
}

export async function resetPasswordApi({ username, otp, newPassword }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, otp, newPassword })
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
  return data;
}

export async function fetchSubjectsApi(school) {
  try {
    const url = school ? `${API_BASE_URL}/api/subjects?school=${encodeURIComponent(school)}` : `${API_BASE_URL}/api/subjects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed fetching subjects");
    const data = await parseJsonResponse(res);
    return data.subjects || {};
  } catch (err) {
    console.warn("Could not fetch subjects from API, using fallback data:", err);
    return null;
  }
}

export async function saveQuizResultApi(resultData) {
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(resultData)
    });
    if (res.ok) {
      await parseJsonResponse(res);
    }
  } catch (err) {
    console.warn("Could not save to MongoDB server, saving locally:", err);
  }
  saveLocalResult(resultData);
}

export async function fetchUserResultsApi() {
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/results/summary`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed fetching results");
    return await parseJsonResponse(res);
  } catch (err) {
    console.warn("Could not fetch user results from API:", err);
    return null;
  }
}
