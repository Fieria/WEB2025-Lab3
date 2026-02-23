// Инициализация игры 2048

const GRID_SIZE = 4;
let grid = [];

// Инициализация пустого поля
function initGrid() {
    grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = 0;
        }
    }
}

// Получить случайную пустую ячейку
function getRandomEmptyCell() {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    
    if (emptyCells.length === 0) {
        return null;
    }
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Добавить новую плитку (2 или 4)
function addRandomTile() {
    const cell = getRandomEmptyCell();
    if (cell) {
        // 90% вероятность получить 2, 10% - получить 4
        grid[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Инициализация игры - добавляем 2 начальные плитки
function initGame() {
    initGrid();
    addRandomTile();
    addRandomTile();
    updateDisplay();
}

// Обновление отображения поля
function updateDisplay() {
    const tilesContainer = document.getElementById('tiles-container');
    tilesContainer.innerHTML = '';
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] !== 0) {
                const tile = document.createElement('div');
                tile.className = `tile tile-${grid[i][j]}`;
                tile.textContent = grid[i][j];
                tile.style.gridRow = i + 1;
                tile.style.gridColumn = j + 1;
                tilesContainer.appendChild(tile);
            }
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

