// Progress page logic for summarized achievements and badges.

document.addEventListener("DOMContentLoaded", async () => {
  let completed = 0;
  let best = 0;
  let average = 0;

  if (typeof fetchUserResultsFromMongo === "function") {
    const mongoData = await fetchUserResultsFromMongo();
    if (mongoData) {
      completed = mongoData.completedSubjects || 0;
      best = parseInt(mongoData.bestScore, 10) || 0;
      average = parseInt(mongoData.averageScore, 10) || 0;
    }
  }

  if (!completed && !best && !average) {
    const summary = JSON.parse(sessionStorage.getItem("portalSummary") || "null");
    const results = typeof getResults === "function" ? getResults() : [];
    completed = summary?.completedSubjects || new Set(results.map((result) => result.subject)).size;
    best = summary?.bestScore || (results.length ? Math.max(...results.map((result) => Number(result.percentage))) : 0);
    average = summary?.averageScore || (results.length ? Math.round(results.reduce((sum, item) => sum + Number(item.percentage), 0) / results.length) : 0);
  }

  const subjElem = document.getElementById("progressSubjects");
  const bestElem = document.getElementById("progressBest");
  const avgElem = document.getElementById("progressAverage");
  const barElem = document.getElementById("progressBar");

  if (subjElem) subjElem.textContent = completed;
  if (bestElem) bestElem.textContent = `${best}%`;
  if (avgElem) avgElem.textContent = `${average}%`;
  if (barElem) barElem.style.width = `${Math.min(100, average)}%`;

  const badges = [];
  if (best >= 80) badges.push("🏆 Master Quiz Taker");
  if (completed >= 3) badges.push("🌟 Subject Explorer");
  if (average >= 70) badges.push("⭐ Consistent Learner");

  const badgeElem = document.getElementById("badges");
  if (badgeElem) {
    badgeElem.innerHTML = badges.length
      ? badges.map((item) => `<span class="badge bg-primary me-2 mb-2 px-3 py-2 fs-6">${item}</span>`).join("")
      : '<span class="text-muted">Complete a quiz to unlock badges.</span>';
  }
});
