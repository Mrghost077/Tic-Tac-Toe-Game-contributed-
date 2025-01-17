// Background Animation Setup
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create particles
const particles = [];
const particleCount = 100;
const particleColors = ['#FF69B4', '#00FFFF', '#FF1493', '#7B68EE', '#00FA9A'];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}
animate();

// Initialize game elements
const gameBoard = document.querySelector("#gameBoard");
const gameInfo = document.querySelector('#gameInfo');
const restartInfo = document.querySelector('#restartInfo');
const restartButton = document.querySelector('#restartButton');
const modeSelect = document.querySelector('#modeSelect'); // Add mode selection element
const difficultySelectContainer = document.querySelector('#difficultySelectContainer');
const difficultySelect = document.querySelector('#difficultySelect');
let cells = Array(9).fill("");
let playTurn = "circle";
let gameActive = true;
let gameMode = "onePlayer"; // Default mode
let difficultyLevel = "normal"; // Default difficulty level

// Event listeners
restartButton.addEventListener('click', restartGame);
modeSelect.addEventListener('change', changeMode); // Add event listener for mode change
difficultySelect.addEventListener('change', changeDifficulty);

// Initialize game
initializeGame();

function initializeGame() {
    modeSelect.value = gameMode; // Set the default mode in the dropdown
    difficultySelect.value = difficultyLevel;
    difficultySelect.style.display = gameMode === "onePlayer" ? "block" : "none"; // Show difficulty select only in onePlayer mode
    gameInfo.textContent = 'Game On, Circle goes first!';
    createBoard();
}

function createBoard() {
    gameBoard.innerHTML = '';
    cells.forEach((_, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("square");
        cellElement.id = index;
        cellElement.addEventListener("click", handleCellClick);
        gameBoard.appendChild(cellElement);
    });
}

function handleCellClick(e) {
    const cell = e.target;
    if (!gameActive || cell.classList.contains('circle') || cell.classList.contains('cross')) {
        return;
    }

    cell.classList.add(playTurn);
    cells[cell.id] = playTurn;

    if (checkWinner()) {
        endGame(`${playTurn.charAt(0).toUpperCase() + playTurn.slice(1)} Wins the Game!!!`);
        return;
    }

    if (checkDraw()) {
        endGame("It's a Draw!!!");
        return;
    }

    playTurn = playTurn === "circle" ? "cross" : "circle";
    gameInfo.textContent = `Now it is ${playTurn}'s turn!`;
    restartInfo.textContent = ''; // Remove the restart info text

    if (gameMode === "onePlayer" && playTurn === "cross") {
        setTimeout(autoPlay, 500); // Auto play for cross
    }
}

function autoPlay() {
    let bestMove;
    if (difficultyLevel === "easy") {
        bestMove = findRandomMove();
    } else if (difficultyLevel === "normal") {
        bestMove = normalMode();
    } else {
        bestMove = findBestMove();
    }
    const cell = document.getElementById(bestMove);
    cell.click();
}

function findRandomMove() {
    const availableMoves = cells.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function findWinningMove(board, player) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], 
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], 
        [2, 4, 6]             
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        const values = [board[a], board[b], board[c]];

        // Count how many times the player appears in this combo
        const count = values.filter(val => val === player).length;
        const emptyIndex = values.indexOf(""); // Find empty spot

        // If 2 out of 3 positions belong to the player and one is empty, return that index
        if (count === 2 && emptyIndex !== -1) {
            return combo[emptyIndex]; // Return the winning/blocking move
        }
    }

    return null; // No winning move found
}

function getStrategicSpots(board) {
    // Prioritize corners first
    const corners = [0, 2, 6, 8].filter(index => board[index] === "");
    if (corners.length > 0) {
        return corners;
    }

    // Then prioritize sides
    const sides = [1, 3, 5, 7].filter(index => board[index] === "");
    if (sides.length > 0) {
        console.log("Available sides:", sides);
        return sides;
    }

    // If no strategic spots available, return an empty array
    return [];
}


function normalMode() {
    

    // 70% chance to play strategically, 30% chance to play randomly
    if (Math.random() < 0.7) {

        // Try to win in one move
        const winningMove = findWinningMove(cells, 'cross'); // AI is 'cross'
        if (winningMove !== null) {
            return winningMove;
        }

        // Try to block opponent's winning move
        const blockingMove = findWinningMove(cells, 'circle'); // Opponent is 'circle'
        if (blockingMove !== null) {
            return blockingMove;
        }

        // If center is available, 50% chance to take it
        if (cells[4] === "" && Math.random() < 0.5) {
            return 4;
        }

        // Get strategic spots (e.g., corners or best available positions)
        const strategicSpots = getStrategicSpots(cells);
        if (strategicSpots.length > 0) {
            const chosenSpot = strategicSpots[Math.floor(Math.random() * strategicSpots.length)];
            console.log("AI picking a strategic spot:", chosenSpot);
            return chosenSpot;
        }
    }

    // Fall back to a completely random move
    const randomMove = findRandomMove();
    console.log("AI making a random move:", randomMove);
    return randomMove;
}

    

function findBestMove(depthLimit = Infinity) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i] === "") {
            cells[i] = playTurn;
            let moveVal = minimax(cells, 0, false, depthLimit);
            cells[i] = "";

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing, depthLimit) {
    if (depth >= depthLimit) return 0;

    const score = evaluate(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = playTurn;
                best = Math.max(best, minimax(board, depth + 1, false, depthLimit));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        const opponent = playTurn === "circle" ? "cross" : "circle";
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = opponent;
                best = Math.min(best, minimax(board, depth + 1, true, depthLimit));
                board[i] = "";
            }
        }
        return best;
    }
}

function evaluate(board) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], 
        [0, 4, 8],
        [2, 4, 6] 
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] === board[b] && board[b] === board[c]) {
            if (board[a] === playTurn) return 10;
            if (board[a] === (playTurn === "circle" ? "cross" : "circle")) return -10;
        }
    }
    return 0;
}

function isBoardFull(board) {
    return board.every(cell => cell !== "");
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], 
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6] 
    ];

    return winningCombos.some(combo => {
        return combo.every(index => {
            const cell = document.getElementById(index);
            return cell.classList.contains(playTurn);
        });
    });
}

function checkDraw() {
    return [...document.querySelectorAll('.square')]
        .every(cell => cell.classList.contains('circle') || cell.classList.contains('cross'));
}

function endGame(message) {
    gameActive = false;
    gameInfo.textContent = message;
    document.querySelectorAll('.square')
        .forEach(square => square.removeEventListener('click', handleCellClick));
}

function restartGame() {
    cells = Array(9).fill("");
    playTurn = "circle";
    gameActive = true;
    gameInfo.textContent = 'Game On, Circle goes first!';
    restartInfo.textContent = '';
    createBoard();
}

function changeMode() {
    gameMode = modeSelect.value;
    // Show difficulty select only in onePlayer mode
    difficultySelect.style.display = gameMode === "onePlayer" ? "block" : "none"; 
    restartGame();
}

function changeDifficulty() {
    difficultyLevel = difficultySelect.value;
    restartGame();
}