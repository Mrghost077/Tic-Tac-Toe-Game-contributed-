const gameBoard = document.querySelector("#gameBoard");
const gameInfo = document.querySelector('#gameInfo');
const restartInfo = document.querySelector('#restartInfo');
const cells = ["","","","","","","","","",];
let playTurn = "circle";

gameInfo.textContent = 'Game On, Circle goes first !';

function board ()
{
    cells.forEach((_cell, index) =>
    {
        const cellElement = document.createElement("div");
        cellElement.classList.add("square");
        cellElement.id = index;
        cellElement.addEventListener("click", addSymbol);
        gameBoard.append(cellElement);
    })
}

board();

function addSymbol (e)
{
    restartInfo.textContent = 'Press F5 in keyboard to restart the game';
    const cellSymbol = document.createElement("div");
    cellSymbol.classList.add(playTurn);
    playTurn = playTurn === "circle" ? "cross" : "circle";
    gameInfo.textContent = "Now it is " + playTurn +"'s turn !";
    e.target.removeEventListener("click", addSymbol);
    e.target.append(cellSymbol);

    calculateScore();
}

function calculateScore ()
{
    const allSquares = document.querySelectorAll(".square");
    const winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    let gameWon = false;

    winningCombinations.forEach(array =>{
       const circleWin =  array.every(cell => 
            allSquares[cell].firstChild?.classList.contains("circle"));

            if (circleWin)
                {
                    gameInfo.textContent = "Circle Wins the Game !!!"
                    gameWon = true;
                    allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
                }
        })

        winningCombinations.forEach(array =>{
            const crossWin =  array.every(cell => 
                 allSquares[cell].firstChild?.classList.contains("cross"));
     
                 if (crossWin)
                     {
                         gameInfo.textContent = "Cross Wins the Game !!!";
                         gameWon = true;
                         allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
                     }
             })

        if (!gameWon && [...allSquares].every(square => square.firstChild)) {
            gameInfo.textContent = "It's a Draw !!!";
            allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
        }
}