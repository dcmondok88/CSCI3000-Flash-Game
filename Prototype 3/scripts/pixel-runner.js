
const canvas = document.getElementById("runnerCanvas");
const ctx = canvas.getContext("2d");

let runner = { x: 50, y: 250, w: 30, h: 30, vy: 0, grounded: true };
let gravity = 1.5;
let obstacles = [];
let frame = 0;
let score = 0;
let awarded = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && runner.grounded) {
    runner.vy = -18;
    runner.grounded = false;
  }
});

function addObstacle() {
  const height = 30 + Math.random() * 30;
  obstacles.push({ x: canvas.width, y: canvas.height - height, w: 20, h: height });
}

function update() {
  frame++;
  if (frame % 60 === 0) addObstacle();

  runner.vy += gravity;
  runner.y += runner.vy;

  if (runner.y + runner.h > canvas.height) {
    runner.y = canvas.height - runner.h;
    runner.vy = 0;
    runner.grounded = true;
  }

  obstacles.forEach(o => o.x -= 6);
  obstacles = obstacles.filter(o => o.x + o.w > 0);

  for (let o of obstacles) {
    if (
      runner.x < o.x + o.w &&
      runner.x + runner.w > o.x &&
      runner.y < o.y + o.h &&
      runner.y + runner.h > o.y
    ) {
      alert("Game Over! Score: " + score);
      document.location.reload();
      return;
    }
  }

  score++;
  if (score >= 300 && !awarded) {
    alert("Runner Survived! +5 Points!");
    awardPixelRunnerPoints();
    awarded = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(runner.x, runner.y, runner.w, runner.h);

  ctx.fillStyle = "#ff6347";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

  ctx.fillStyle = "#000";
  ctx.fillText("Score: " + score, 10, 20);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function awardPixelRunnerPoints() {
  const username = localStorage.getItem("currentUser") || "Guest";
  const leaderboardPoints = JSON.parse(localStorage.getItem("leaderboardPoints")) || {};
  leaderboardPoints[username] = (leaderboardPoints[username] || 0) + 5;
  localStorage.setItem("leaderboardPoints", JSON.stringify(leaderboardPoints));
}

loop();
