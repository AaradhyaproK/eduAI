// Result page logic: display the latest quiz result and history.

document.addEventListener("DOMContentLoaded", () => {
  const lastResult = JSON.parse(sessionStorage.getItem("lastResult") || "null");
  const results = getResults();
  const summary = document.getElementById("resultSummary");
  const historyList = document.getElementById("historyList");

  if (!lastResult) {
    summary.innerHTML = "<div class='alert alert-warning'>No quiz result available yet.</div>";
    return;
  }

  summary.innerHTML = `
    <div class='alert alert-success'>
      <h4>${lastResult.studentName}</h4>
      <p><strong>School:</strong> ${lastResult.school}</p>
      <p><strong>Class:</strong> ${lastResult.className}</p>
      <p><strong>Subject:</strong> ${lastResult.subject}</p>
      <p><strong>Marks:</strong> ${lastResult.marks}</p>
      <p><strong>Percentage:</strong> ${lastResult.percentage}%</p>
      <p><strong>Date:</strong> ${lastResult.date}</p>
    </div>
  `;

  historyList.innerHTML = results.length
    ? results.map((item) => `<div class='border rounded p-3 mb-2'><strong>${item.subject}</strong> — ${item.marks} (${item.percentage}%) on ${item.date}</div>`).join("")
    : "<p class='text-muted'>No previous quiz history yet.</p>";
});
