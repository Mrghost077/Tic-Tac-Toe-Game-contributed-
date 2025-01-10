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

// Event listeners
document.addEventListener('mousemove', updateCursor);
restartButton.addEventListener('click', restartGame);

// Initialize game
initializeGame();

function updateCursor(e) {
    cursor.style.left = `${e.clientX - 10}px`;
    cursor.style.top = `${e.clientY - 10}px`;
    cursor.style.borderColor = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
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