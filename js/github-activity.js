function simulateGitHubActivity(container, message = null) {
  // Clear existing content
  container.innerHTML = "";

  // Optional: Show fallback message
  if (message) {
    const messageEl = document.createElement("div");
    messageEl.className = "github-calendar-message";
    messageEl.style.color = "var(--color-warning, #f39c12)";
    messageEl.style.marginBottom = "10px";
    messageEl.style.fontSize = "0.85rem";
    messageEl.textContent = message;
    container.appendChild(messageEl);
  }

  // Create calendar grid (Simulated data)
  const calendarGrid = document.createElement("div");
  calendarGrid.className = "github-calendar-grid";
  calendarGrid.style.display = "grid";
  calendarGrid.style.gridTemplateColumns = "repeat(52, 1fr)";
  calendarGrid.style.gridGap = "3px";
  calendarGrid.style.marginTop = "10px";

  // Generate random activity data
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);

  for (let week = 0; week < 52; week++) {
    const weekEl = document.createElement("div");
    weekEl.className = "github-calendar-week";
    weekEl.style.display = "grid";
    weekEl.style.gridTemplateRows = "repeat(7, 1fr)";
    weekEl.style.gridGap = "3px";

    for (let day = 0; day < 7; day++) {
      const dayEl = document.createElement("div");
      dayEl.className = "github-calendar-day";
      dayEl.style.width = "10px";
      dayEl.style.height = "10px";
      dayEl.style.borderRadius = "2px";

      const activityLevel = Math.floor(Math.random() * 5);

      let color;
      if (activityLevel === 0) {
        color = "var(--color-border)";
      } else if (activityLevel === 1) {
        color = "#9be9a8";
      } else if (activityLevel === 2) {
        color = "#40c463";
      } else if (activityLevel === 3) {
        color = "#30a14e";
      } else {
        color = "#216e39";
      }

      dayEl.style.backgroundColor = color;

      const cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + week * 7 + day);

      const dateStr = cellDate.toDateString();
      const count = activityLevel === 0 ? "No" : activityLevel * 3;
      dayEl.title = `${dateStr}: ${count} contributions`;

      weekEl.appendChild(dayEl);
    }

    calendarGrid.appendChild(weekEl);
  }

  // Add stats
  const stats = document.createElement("div");
  stats.className = "github-calendar-stats";
  stats.style.marginTop = "20px";
  stats.style.display = "flex";
  stats.style.justifyContent = "space-between";
  stats.style.fontSize = "0.875rem";
  stats.style.color = "var(--color-text-light)";

  const totalContributions = Math.floor(Math.random() * 2000) + 500;

  stats.innerHTML = `
    <div>
      <strong>${totalContributions}</strong> contributions in the last year
    </div>
    <div>
      <strong>${Math.floor(totalContributions / 52)}</strong> weekly average
    </div>
  `;

  container.appendChild(calendarGrid);
  container.appendChild(stats);
}

document.addEventListener("DOMContentLoaded", () => {
  const githubCalendar = document.getElementById("github-calendar");

  if (githubCalendar) {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const targetURL = "https://github.com/users/natty4/contributions/";

    fetch(proxy + targetURL)
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const rects = svgDoc.querySelectorAll("rect.day");

        const hasValidData = rects.length > 0 &&
          Array.from(rects).some(rect => parseInt(rect.getAttribute("data-count")) > 0);

        if (!hasValidData) {
          simulateGitHubActivity(githubCalendar, "Unable to load GitHub activity. Showing simulated data instead.");
        } else {
          simulateGitHubActivity(githubCalendar, null); // you could adapt it to build from real data here too
        }
      })
      .catch(err => {
        console.error("Error fetching GitHub activity:", err);
        simulateGitHubActivity(githubCalendar, "Unable to load GitHub activity. Showing simulated data instead.");
      });
  }
});
