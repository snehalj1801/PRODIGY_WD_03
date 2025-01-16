const gameBoard = document.getElementById('gameBoard');
const message = document.getElementById('message');
const winLine = document.getElementById('winLine');
const newGameButton = document.getElementById('newGameButton');
const resetButton = document.getElementById('resetButton');
const turnIndicator = document.getElementById('turnIndicator');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function drawWinLine(pattern) {
    const cellPositions = Array.from(gameBoard.children)
        .slice(0, 9)
        .map(cell => cell.getBoundingClientRect());

    const [start, , end] = pattern.map(index => cellPositions[index]);
    const boardRect = gameBoard.getBoundingClientRect();

    const x1 = start.left + start.width / 2 - boardRect.left;
    const y1 = start.top + start.height / 2 - boardRect.top;
    const x2 = end.left + end.width / 2 - boardRect.left;
    const y2 = end.top + end.height / 2 - boardRect.top;

    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    winLine.style.top = `${y1}px`;
    winLine.style.left = `${x1}px`;
    winLine.style.width = `${length}px`;
    winLine.style.transform = `rotate(${angle}deg)`;
}

function checkWinner() {
    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            drawWinLine([a, b, c]);
            return board[a];
        }
    }
    return board.includes('') ? null : 'Draw';
}

function handleClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (!board[index]) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('taken', currentPlayer);

        const winner = checkWinner();
        if (winner) {
            message.textContent = winner === 'Draw' ? "It's a Draw!" : `🎉"${winner}" Wins!🎉`;
            gameBoard.childNodes.forEach(cell => cell.removeEventListener('click', handleClick));
            newGameButton.disabled = false;
            turnIndicator.innerHTML = `<span>Game Over! </span>`;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            turnIndicator.innerHTML = `<span>Player ${currentPlayer}'s Turn</span>`;
        }
    }
}

function initGame() {
    gameBoard.innerHTML = '<div class="win-line" id="winLine"></div>';
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    message.textContent = '';
    winLine.style.width = '0';

    newGameButton.disabled = true;
    resetButton.disabled = false;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        gameBoard.appendChild(cell);
    }

    turnIndicator.innerHTML = `<span>Player: X's Turn</span>`  ;
   
}

initGame();