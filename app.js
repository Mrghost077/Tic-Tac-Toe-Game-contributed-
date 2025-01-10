// Initialize game elements
const gameBoard = document.querySelector("#gameBoard");
const gameInfo = document.querySelector('#gameInfo');
const restartInfo = document.querySelector('#restartInfo');
const restartButton = document.querySelector('#restartButton');
let cells = Array(9).fill("");
let playTurn = "circle";
let gameActive = true;

// Cursor effect setup
const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

const colors = ['#ff0000', '#ff8700', '#ffd300', '#deff0a', '#a4ff0a', '#0aff99', '#0aefff', '#147df5', '#580aff', '#be0aff'];
let colorIndex = 0;

// Add cursor trail
const trailCount = 20;
const trails = [];
for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    trail.style.opacity = 1 - (i / trailCount);
    document.body.appendChild(trail);
    trails.push({ element: trail, x: 0, y: 0 });
}

let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

// Event listeners
document.addEventListener('mousemove', updateCursor);
restartButton.addEventListener('click', restartGame);
document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
document.addEventListener('mouseup', () => cursor.classList.remove('cursor-click'));
document.addEventListener('click', createSplash);

// Initialize game
initializeGame();

function updateCursor(e) {
    targetX = e.clientX - 10;
    targetY = e.clientY - 10;
}

function animateCursor() {
    // Smooth movement with lerp
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;

    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
    cursor.style.borderColor = colors[colorIndex];

    // Update trails
    trails.forEach((trail, index) => {
        setTimeout(() => {
            trail.x += (currentX - trail.x) * 0.3;
            trail.y += (currentY - trail.y) * 0.3;
            trail.element.style.left = `${trail.x}px`;
            trail.element.style.top = `${trail.y}px`;
            trail.element.style.borderColor = colors[(colorIndex + index) % colors.length];
        }, index * 30);
    });

    colorIndex = (colorIndex + 1) % colors.length;
    requestAnimationFrame(animateCursor);
}

// Start animation
animateCursor();

function createSplash(e) {
    const splash = document.createElement('div');
    splash.className = 'splash';
    splash.style.left = `${e.clientX - 50}px`;
    splash.style.top = `${e.clientY - 50}px`;

    const particleCount = 12;
    const colors = ['#FF69B4', '#00FFFF', '#FF1493', '#7B68EE', '#00FA9A'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'splash-particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const angle = (i * (360 / particleCount)) * (Math.PI / 180);
        const distance = 50 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        splash.appendChild(particle);
    }

    document.body.appendChild(splash);
    setTimeout(() => splash.remove(), 1000);
}

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