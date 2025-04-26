
const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas.getContext("2d");

let bubbles = [];
let popped = 0;
let target = 10;
let awarded = false;

function spawnBubble() {
  const radius = 20;
  const x = radius + Math.random() * (canvas.width - 2 * radius);
  const y = radius + Math.random() * (canvas.height - 2 * radius);
  bubbles.push({ x, y, r: radius });
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  bubbles = bubbles.filter(b => {
    const dist = Math.hypot(mx - b.x, my - b.y);
    if (dist <= b.r) {
      popped++;
      return false;
    }
    return true;
  });

  if (popped >= target && !awarded) {
    alert("You popped them all! +5 Points!");
    awardBubblePopPoints();
    awarded = true;
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = "skyblue";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
  });
  ctx.fillStyle = "#000";
  ctx.fillText("Popped: " + popped, 10, 20);
}

function update() {
  if (bubbles.length < 5) spawnBubble();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function awardBubblePopPoints() {
  const username = localStorage.getItem("currentUser") || "Guest";
  const leaderboardPoints = JSON.parse(localStorage.getItem("leaderboardPoints")) || {};
  leaderboardPoints[username] = (leaderboardPoints[username] || 0) + 5;
  localStorage.setItem("leaderboardPoints", JSON.stringify(leaderboardPoints));
}

loop();
