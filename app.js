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
let cells = Array(9).fill("");
let playTurn = "circle";
let gameActive = true;
let gameMode = "twoPlayers"; // Default mode

// Event listeners
restartButton.addEventListener('click', restartGame);
modeSelect.addEventListener('change', changeMode); // Add event listener for mode change

// Initialize game
initializeGame();

function initializeGame() {
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
    restartInfo.textContent = 'Press F5 or click Restart Game to start over';

    if (gameMode === "onePlayer" && playTurn === "cross") {
        setTimeout(autoPlay, 500); // Auto play for cross
    }
}

function autoPlay() {
    const emptyCells = cells.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = document.getElementById(randomIndex);
    cell.click();
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6] // Diagonals
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
    restartGame();
}