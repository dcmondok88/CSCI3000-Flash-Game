let dragged = null;
let moveCount = 0;
const totalDisks = 5;

function createDisks() {
  const peg = document.getElementById("peg-1");
  for (let i = totalDisks; i >= 1; i--) {
    const disk = document.createElement("div");
    disk.className = "disk";
    disk.dataset.size = i;
    disk.draggable = false;
    disk.style.width = (60 + i * 20) + "px";
    disk.style.backgroundColor = getColor(i);
    peg.appendChild(disk);
  }
  updateDraggableDisks();
}

function getColor(size) {
  const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#3498db", "#2ecc71"];
  return colors[size - 1] || "#9b6fe7";
}

function updateDraggableDisks() {
  document.querySelectorAll(".disk").forEach(d => {
    d.draggable = false;
    d.removeEventListener("dragstart", dragStartHandler);
  });

  document.querySelectorAll(".peg").forEach(peg => {
    const top = peg.lastElementChild;
    if (top) {
      top.draggable = true;
      top.addEventListener("dragstart", dragStartHandler);
    }
  });
}

function dragStartHandler(e) {
  dragged = e.target;
}

document.querySelectorAll(".peg").forEach(peg => {
  peg.addEventListener("dragover", (e) => e.preventDefault());

  peg.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!dragged) return;

    const topDisk = peg.lastElementChild;
    const draggedSize = parseInt(dragged.dataset.size);
    const topSize = topDisk ? parseInt(topDisk.dataset.size) : Infinity;

    if (dragged.parentElement === peg) return;
    if (draggedSize < topSize) {
      peg.appendChild(dragged);
      moveCount++;
      document.getElementById("move-count").textContent = `Moves: ${moveCount}`;
      updateDraggableDisks();
      checkWin();
    }
  });
});

function checkWin() {
  const peg3 = document.getElementById("peg-3");
  if (peg3.children.length === totalDisks) {
    setTimeout(() => {
      alert(`🎉 You won in ${moveCount} moves!`);
      saveHanoiWin();
    }, 100);
  }
}

function saveHanoiWin() {
  const username = localStorage.getItem("username");
  if (!username) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username);
  if (user) {
    user.hanoiWins = (user.hanoiWins || 0) + 1;
    user.bestHanoiMoves = Math.min(user.bestHanoiMoves ?? Infinity, moveCount);
    localStorage.setItem("users", JSON.stringify(users));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createDisks();
  document.getElementById("move-count").textContent = `Moves: ${moveCount}`;
});