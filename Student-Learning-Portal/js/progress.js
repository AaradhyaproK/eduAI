// Progress page logic for summarized achievements and badges.

document.addEventListener("DOMContentLoaded", () => {
  const summary = JSON.parse(sessionStorage.getItem("portalSummary") || "null");
  const results = getResults();
  const completed = summary?.completedSubjects || new Set(results.map((result) => result.subject)).size;
  const best = summary?.bestScore || (results.length ? Math.max(...results.map((result) => Number(result.percentage))) : 0);
  const average = summary?.averageScore || (results.length ? Math.round(results.reduce((sum, item) => sum + Number(item.percentage), 0) / results.length) : 0);

  document.getElementById("progressSubjects").textContent = completed;
  document.getElementById("progressBest").textContent = `${best}%`;
  document.getElementById("progressAverage").textContent = `${average}%`;
  document.getElementById("progressBar").style.width = `${Math.min(100, average)}%`;

  const badges = [];
  if (best >= 80) badges.push("🏆 Master Quiz Taker");
  if (completed >= 3) badges.push("🌟 Subject Explorer");
  if (average >= 70) badges.push("⭐ Consistent Learner");

  document.getElementById("badges").innerHTML = badges.length ? badges.map((item) => `<span class="badge bg-primary me-2 mb-2">${item}</span>`).join("") : '<span class="text-muted">Complete a quiz to unlock badges.</span>';
});
