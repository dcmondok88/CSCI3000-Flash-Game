
document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("memory-board");
    const status = document.getElementById("memory-status");
    let cards = ["🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍒", "🍒"];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matches = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        shuffle(cards);
        board.innerHTML = "";
        cards.forEach((symbol, index) => {
            const card = document.createElement("div");
            card.classList.add("favorite-card");
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.textContent = "?";
            card.addEventListener("click", flipCard);
            board.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this.textContent !== "?") return;

        this.textContent = this.dataset.symbol;

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
            firstCard = null;
            secondCard = null;
            lockBoard = false;
            matches++;
            if (matches === 4) {
                status.textContent = "You Win! +5 Points!";
                awardPoints(5);
            }
        } else {
            setTimeout(() => {
                firstCard.textContent = "?";
                secondCard.textContent = "?";
                firstCard = null;
                secondCard = null;
                lockBoard = false;
            }, 1000);
        }
    }

    function awardPoints(points) {
        const leaderboardPoints = JSON.parse(localStorage.getItem("leaderboardPoints")) || {};
        const username = localStorage.getItem("currentUser") || "Guest";
        if (!leaderboardPoints[username]) {
            leaderboardPoints[username] = 0;
        }
        leaderboardPoints[username] += points;
        localStorage.setItem("leaderboardPoints", JSON.stringify(leaderboardPoints));
    }

    createBoard();
});
