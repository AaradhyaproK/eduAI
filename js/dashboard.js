// Dashboard page logic: display student profile and progress summary.

document.addEventListener("DOMContentLoaded", () => {
  const student = getCurrentStudent();
  if (!student) {
    window.location.href = "index.html";
    return;
  }

  const name = student.name || student.username || "Student";
  const username = student.username || student.name || "Student";
  const school = student.schoolName || student.school || "School";
  const className = student.className || student.class || "Class";
  const password = student.password || "••••••••";

  if (document.getElementById("dashName")) document.getElementById("dashName").textContent = name;
  if (document.getElementById("dashNameValue")) document.getElementById("dashNameValue").textContent = username;
  if (document.getElementById("dashPassword")) document.getElementById("dashPassword").textContent = password;
  if (document.getElementById("profileName")) document.getElementById("profileName").textContent = name;
  if (document.getElementById("profileSchool")) document.getElementById("profileSchool").textContent = school;
  if (document.getElementById("profileClass")) document.getElementById("profileClass").textContent = className;

  const results = typeof getResults === "function" ? getResults() : [];
  const completed = new Set(results.map((result) => result.subject)).size;
  const best = results.length ? Math.max(...results.map((result) => Number(result.percentage))) : 0;
  const average = results.length ? Math.round(results.reduce((sum, item) => sum + Number(item.percentage), 0) / results.length) : 0;

  if (document.getElementById("completedSubjects")) document.getElementById("completedSubjects").textContent = completed;
  if (document.getElementById("bestScore")) document.getElementById("bestScore").textContent = `${best}%`;

  // Store summary for progress page.
  const summary = { completedSubjects: completed, bestScore: best, averageScore: average };
  sessionStorage.setItem("portalSummary", JSON.stringify(summary));
});
