// Redirect to auth page if not signed in
const protectedPages = ["profile.html"];
const currentPage = window.location.pathname.split("/").pop();
if (protectedPages.includes(currentPage) && !localStorage.getItem("username")) {
  window.location.href = "auth.html";
}

// Load user profile from localStorage
function loadProfile() {
  const name = localStorage.getItem("username") || "Guest";
  const gamesPlayed = localStorage.getItem("gamesPlayed") || 0;
  const highScore = localStorage.getItem("highScore") || "N/A";

  const nameEl = document.getElementById("profile-name");
  const gamesEl = document.getElementById("profile-games");
  const scoreEl = document.getElementById("profile-score");

  if (nameEl && gamesEl && scoreEl) {
    nameEl.textContent = name;
    gamesEl.textContent = `Games Played: ${gamesPlayed}`;
    scoreEl.textContent = `Highest Score: ${highScore}`;
  }

  const profileInfo = document.getElementById("profile-display");
  if (profileInfo) {
    profileInfo.innerHTML = `
      <p><strong>Username:</strong> ${name}</p>
      <p><strong>Games Played:</strong> ${gamesPlayed}</p>
      <p><strong>Highest Score:</strong> ${highScore}</p>
    `;
  }
}

// Sample leaderboard
const leaderboardData = [
  { username: "PlayerOne", score: 9990 },
  { username: "GameMaster", score: 8700 },
  { username: "NoobSlayer", score: 7600 },
];

function renderLeaderboardPreview() {
  const listEl = document.getElementById("leaderboard-list");
  if (!listEl) return;

  leaderboardData.forEach(player => {
    const li = document.createElement("li");
    li.textContent = `${player.username}: ${player.score}`;
    listEl.appendChild(li);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  renderLeaderboardPreview();

  const welcomeEl = document.getElementById("welcome-user");
  const user = localStorage.getItem("username");
  if (welcomeEl && user) {
    welcomeEl.textContent = `Welcome, ${user}`;
  }
});

// Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("gamesPlayed");
    localStorage.removeItem("highScore");
    window.location.href = "index.html";
  });
}