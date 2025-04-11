// Load user profile from localStorage
function loadProfile() {
    const name = localStorage.getItem("username") || "Guest123";
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
  }
  
  // Sample leaderboard data
  const leaderboardData = [
    { username: "PlayerOne", score: 9990 },
    { username: "GameMaster", score: 8700 },
    { username: "NoobSlayer", score: 7600 },
  ];
  
  // Render leaderboard preview on hover
  function renderLeaderboardPreview() {
    const listEl = document.getElementById("leaderboard-list");
    if (!listEl) return;
  
    leaderboardData.forEach(player => {
      const li = document.createElement("li");
      li.textContent = `${player.username}: ${player.score}`;
      listEl.appendChild(li);
    });
  }
  
  // Initialize everything on page load
  window.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    renderLeaderboardPreview();
  });
  