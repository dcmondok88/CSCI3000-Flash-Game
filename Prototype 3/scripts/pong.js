const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 80;
let leftY = canvas.height / 2 - paddleHeight / 2;
let rightY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 10;
let gameRunning = false;

let leftScore = 0;
let rightScore = 0;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  dx: 4,
  dy: 3
};

document.addEventListener("keydown", (e) => {
  if (e.key === " " && !gameRunning) {
    gameRunning = true;
    draw();
  }
  if (e.key === "w") leftY -= paddleSpeed;
  if (e.key === "s") leftY += paddleSpeed;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") rightY -= paddleSpeed;
  if (e.key === "ArrowDown") rightY += paddleSpeed;
});

function drawPaddle(x, y) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`${leftScore}`, canvas.width / 2 - 40, 30);
  ctx.fillText(`${rightScore}`, canvas.width / 2 + 25, 30);
}

function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Press SPACE to Start Pong", canvas.width / 2, canvas.height / 2);
}

function update() {
  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Bounce off top/bottom
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Left paddle collision
  if (
    ball.x - ball.radius < 20 &&
    ball.y > leftY &&
    ball.y < leftY + paddleHeight
  ) {
    ball.dx *= -1;
  }

  // Right paddle (AI) collision
  if (
    ball.x + ball.radius > canvas.width - 20 &&
    ball.y > rightY &&
    ball.y < rightY + paddleHeight
  ) {
    ball.dx *= -1;
  }

  // Scoring
  if (ball.x < 0) {
    rightScore++;
    resetBall();
  }

  if (ball.x > canvas.width) {
    leftScore++;
    resetBall();
  }

  // Simple AI
  const aiCenter = rightY + paddleHeight / 2;
  const margin = 20;
  const aiSpeed = 2.5;
  if (aiCenter < ball.y - margin) rightY += aiSpeed;
  else if (aiCenter > ball.y + margin) rightY -= aiSpeed;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1;
  ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  if (!gameRunning) {
    drawStartScreen();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(10, leftY);
  drawPaddle(canvas.width - 20, rightY);
  drawBall();
  drawScore();

  update();

  // Save score if user is logged in
  const username = localStorage.getItem("username");
  if (username) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.username === username);
    if (currentUser) {
      currentUser.totalScore = (currentUser.totalScore || 0) + (leftScore - rightScore);
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

  
  // Save latest score
  if (username) {
    const gameScores = JSON.parse(localStorage.getItem("gameScores")) || {};
    gameScores.pong = gameScores.pong || {};
    gameScores.pong[username] = leftScore;
    localStorage.setItem("gameScores", JSON.stringify(gameScores));
  }

  requestAnimationFrame(draw);
}

drawStartScreen();

// Award points if enough score

if (typeof awardPongPointsIfScored === "function") {
    awardPongPointsIfScored(player.score);
}
