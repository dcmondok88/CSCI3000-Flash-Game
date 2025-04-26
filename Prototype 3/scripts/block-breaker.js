
const canvas = document.getElementById("blockCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const rowCount = 3;
const columnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < columnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < rowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#9b6fe7";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#f39c12";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  let remaining = 0;
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        remaining++;
        if (
          x > b.x && x < b.x + brickWidth &&
          y > b.y && y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
        }
      }
    }
  }
  if (remaining === 0) {
    alert("You Win! +5 Points!");
    awardBlockBreakerPoints();
    document.location.reload();
  }
}

function awardBlockBreakerPoints() {
  const username = localStorage.getItem("currentUser") || "Guest";
  const leaderboardPoints = JSON.parse(localStorage.getItem("leaderboardPoints")) || {};
  leaderboardPoints[username] = (leaderboardPoints[username] || 0) + 5;
  localStorage.setItem("leaderboardPoints", JSON.stringify(leaderboardPoints));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else {
      alert("Game Over");
      document.location.reload();
    }
  }

  x += dx;
  y += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;

  requestAnimationFrame(draw);
}

draw();
