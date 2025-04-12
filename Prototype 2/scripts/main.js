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
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === name);
  const totalScore = user ? user.totalScore || 0 : 0;
  const email = user ? user.email || "—" : "—";
  const hanoiWins = user ? user.hanoiWins || 0 : 0;
  const bestHanoi = user ? user.bestHanoiMoves ?? "—" : "—";

  if (document.getElementById("profile-name")) document.getElementById("profile-name").textContent = name;
  if (document.getElementById("profile-email")) document.getElementById("profile-email").textContent = email;
  if (document.getElementById("profile-games")) document.getElementById("profile-games").textContent = gamesPlayed;
  if (document.getElementById("profile-score")) document.getElementById("profile-score").textContent = highScore;
  if (document.getElementById("profile-total")) document.getElementById("profile-total").textContent = totalScore;
  if (document.getElementById("profile-hanoi-wins")) document.getElementById("profile-hanoi-wins").textContent = hanoiWins;
  if (document.getElementById("profile-best-hanoi")) document.getElementById("profile-best-hanoi").textContent = bestHanoi;

  const favContainer = document.getElementById("favorite-games");
  if (favContainer && user?.favorites?.length > 0) {
    favContainer.innerHTML = "";
    user.favorites.forEach(fav => {
      const anchor = document.createElement("a");
      anchor.href = fav.link;
      anchor.innerHTML = `
        <div class="favorite-card">
          <img src="${fav.img || 'assets/images/default-thumb.png'}" alt="${fav.title}" class="game-thumb" />
          <span>${fav.title} ♥</span>
        </div>
      `;
      favContainer.appendChild(anchor);
    });
  }

  const profileInfo = document.getElementById("profile-display");
  if (profileInfo && !document.getElementById("profile-email")) {
    profileInfo.innerHTML = `
      <p><strong>Username:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Games Played:</strong> ${gamesPlayed}</p>
      <p><strong>Highest Score:</strong> ${highScore}</p>
      <p><strong>Total Score:</strong> ${totalScore}</p>
      <p><strong>Hanoi Wins:</strong> ${hanoiWins}</p>
      <p><strong>Best Hanoi:</strong> ${bestHanoi} moves</p>
    `;
  }
}

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

  const favBtn = document.getElementById("favorite-btn");
  if (favBtn && user) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === user);
    if (userIndex !== -1) {
      const currentUser = users[userIndex];
      const pageTitle = document.title.replace(" | Simple Game Zone", "");
      const gamePath = window.location.pathname;

      const thumbMap = {
        "Pong": "assets/images/thumbnail_pong.png",
        "Tower of Hanoi": "assets/images/thumbnail_hanoi.png"
      };

      const isFav = currentUser.favorites?.some(g => g.link === gamePath);
      favBtn.textContent = isFav ? "♥ Favorited" : "♥ Favorite";

      favBtn.addEventListener("click", () => {
        const favorites = currentUser.favorites || [];
        const favIndex = favorites.findIndex(f => f.link === gamePath);

        if (favIndex !== -1) {
          favorites.splice(favIndex, 1);
          favBtn.textContent = "♥ Favorite";
        } else {
          favorites.push({
            title: pageTitle,
            link: gamePath,
            img: thumbMap[pageTitle] || "assets/images/default-thumb.png"
          });
          favBtn.textContent = "♥ Favorited";
        }

        users[userIndex].favorites = favorites;
        localStorage.setItem("users", JSON.stringify(users));
      });
    }
  }
});

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("gamesPlayed");
    localStorage.removeItem("highScore");
    window.location.href = "index.html";
  });
}