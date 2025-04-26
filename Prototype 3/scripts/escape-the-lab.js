
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Adjustable size
const cols = Math.floor(Math.random() * 5) * 2 + 11; // 11,13,...19
const rows = cols;
const tileSize = canvas.width / cols;

let maze = [];
let player = { x: 1, y: 1 };
let goal = { x: cols - 2, y: rows - 2 };

// Initialize maze
function generateMaze() {
    for (let y = 0; y < rows; y++) {
        maze[y] = [];
        for (let x = 0; x < cols; x++) {
            maze[y][x] = 0; // wall
        }
    }

    function carve(x, y) {
        const dirs = [
            [0, -2], [2, 0], [0, 2], [-2, 0]
        ];
        shuffle(dirs);
        dirs.forEach(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;
            if (ny > 0 && ny < rows - 1 && nx > 0 && nx < cols - 1 && maze[ny][nx] === 0) {
                maze[ny][nx] = 1;
                maze[y + dy / 2][x + dx / 2] = 1;
                carve(nx, ny);
            }
        });
    }

    maze[1][1] = 1;
    carve(1, 1);
    maze[goal.y][goal.x] = 2;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function drawMaze() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 0) ctx.fillStyle = "#333";
            else if (maze[y][x] === 1) ctx.fillStyle = "#fff";
            else if (maze[y][x] === 2) ctx.fillStyle = "#9b6fe7";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function checkWin() {
    if (player.x === goal.x && player.y === goal.y) {
        alert("You escaped the lab! +5 Points!");
        const username = localStorage.getItem("currentUser") || "Guest";
        const leaderboardPoints = JSON.parse(localStorage.getItem("leaderboardPoints")) || {};
        leaderboardPoints[username] = (leaderboardPoints[username] || 0) + 5;
        localStorage.setItem("leaderboardPoints", JSON.stringify(leaderboardPoints));
        document.location.reload();
    }
}

document.addEventListener("keydown", (e) => {
    let nx = player.x;
    let ny = player.y;
    if (e.key === "ArrowUp") ny--;
    if (e.key === "ArrowDown") ny++;
    if (e.key === "ArrowLeft") nx--;
    if (e.key === "ArrowRight") nx++;
    if (maze[ny] && maze[ny][nx] > 0) {
        player.x = nx;
        player.y = ny;
    }
    drawMaze();
    checkWin();
});

generateMaze();
drawMaze();
