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


function enableProfileEditing() {
  const editBtn = document.getElementById("edit-profile-btn");
  const saveBtn = document.getElementById("save-profile-btn");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const form = document.getElementById("edit-form");
  const nameInput = document.getElementById("edit-name");
  const emailInput = document.getElementById("edit-email");

  if (!editBtn || !saveBtn || !cancelBtn || !form) return;

  editBtn.addEventListener("click", () => {
    const currentName = localStorage.getItem("username") || "Guest";
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === currentName);

    nameInput.value = user?.username || "";
    emailInput.value = user?.email || "";

    form.style.display = "block";
  });

  cancelBtn.addEventListener("click", () => {
    form.style.display = "none";
  });

  saveBtn.addEventListener("click", () => {
    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();

    if (!newName || !newEmail) return alert("Both fields are required.");


    const currentPw = document.getElementById("current-password")?.value.trim();
    const newPw = document.getElementById("new-password")?.value.trim();
    const confirmPw = document.getElementById("confirm-password")?.value.trim();

    if (currentPw || newPw || confirmPw) {
      const currentUser = users[userIndex];
      if (!currentPw || !newPw || !confirmPw) return alert("All password fields must be filled.");
      if (currentPw !== currentUser.password) return alert("Current password is incorrect.");
      if (newPw !== confirmPw) return alert("New passwords do not match.");
      if (newPw === "") return alert("New password cannot be empty.");
      users[userIndex].password = newPw;
    }


    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === localStorage.getItem("username"));
    if (userIndex === -1) return;

    users[userIndex].username = newName;
    users[userIndex].email = newEmail;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("username", newName);

    form.style.display = "none";
    loadProfile();
    document.getElementById("welcome-user").textContent = `Welcome, ${newName}`;
  });
}

enableProfileEditing();



document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        const games = document.querySelectorAll(".game-grid a");
        let anyVisible = false;

        games.forEach(game => {
            const label = game.querySelector("span")?.textContent.toLowerCase() || "";
            if (label.includes(query)) {
                game.style.display = "flex";
                anyVisible = true;
            } else {
                game.style.display = "none";
            }
        });

        const noResults = document.getElementById("no-results");
        if (noResults) {
            noResults.style.display = anyVisible ? "none" : "block";
        }
    });
});
