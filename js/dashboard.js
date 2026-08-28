// Dashboard page logic: display student profile and progress summary.

document.addEventListener("DOMContentLoaded", () => {
  const student = getCurrentStudent();
  if (!student) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("dashName").textContent = student.name;
  document.getElementById("dashNameValue").textContent = student.name;
  document.getElementById("dashPassword").textContent = student.password;
  document.getElementById("profileName").textContent = student.name;

  const results = getResults();
  const completed = new Set(results.map((result) => result.subject)).size;
  const best = results.length ? Math.max(...results.map((result) => Number(result.percentage))) : 0;
  const average = results.length ? Math.round(results.reduce((sum, item) => sum + Number(item.percentage), 0) / results.length) : 0;

  document.getElementById("completedSubjects").textContent = completed;
  document.getElementById("bestScore").textContent = `${best}%`;

  // Store summary for progress page.
  const summary = { completedSubjects: completed, bestScore: best, averageScore: average };
  sessionStorage.setItem("portalSummary", JSON.stringify(summary));
});
