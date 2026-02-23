// Инициализация игры 2048

const GRID_SIZE = 4;
let grid = [];
let score = 0;

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
    score = 0;
    addRandomTile();
    addRandomTile();
    updateDisplay();
    updateScore();
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

// Обновление отображения счета
function updateScore() {
    const headerCell = document.querySelector('.header-cell');
    if (headerCell) {
        headerCell.textContent = score;
    }
}

// Копирование сетки
function copyGrid() {
    const newGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            newGrid[i][j] = grid[i][j];
        }
    }
    return newGrid;
}

// Проверка, изменилась ли сетка
function gridsEqual(grid1, grid2) {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid1[i][j] !== grid2[i][j]) {
                return false;
            }
        }
    }
    return true;
}

// Движение влево
function moveLeft() {
    const previousGrid = copyGrid();
    let moved = false;
    let pointsEarned = 0;
    
    for (let i = 0; i < GRID_SIZE; i++) {
        const row = grid[i].filter(val => val !== 0);
        const newRow = [];
        let j = 0;
        
        while (j < row.length) {
            if (j < row.length - 1 && row[j] === row[j + 1]) {
                const mergedValue = row[j] * 2;
                newRow.push(mergedValue);
                pointsEarned += mergedValue;
                j += 2;
            } else {
                newRow.push(row[j]);
                j++;
            }
        }
        
        while (newRow.length < GRID_SIZE) {
            newRow.push(0);
        }
        
        grid[i] = newRow;
    }
    
    moved = !gridsEqual(previousGrid, grid);
    if (moved) {
        score += pointsEarned;
    }
    return moved;
}

// Движение вправо
function moveRight() {
    const previousGrid = copyGrid();
    let moved = false;
    let pointsEarned = 0;
    
    for (let i = 0; i < GRID_SIZE; i++) {
        const row = grid[i].filter(val => val !== 0);
        const newRow = [];
        let j = row.length - 1;
        
        while (j >= 0) {
            if (j > 0 && row[j] === row[j - 1]) {
                const mergedValue = row[j] * 2;
                newRow.unshift(mergedValue);
                pointsEarned += mergedValue;
                j -= 2;
            } else {
                newRow.unshift(row[j]);
                j--;
            }
        }
        
        while (newRow.length < GRID_SIZE) {
            newRow.unshift(0);
        }
        
        grid[i] = newRow;
    }
    
    moved = !gridsEqual(previousGrid, grid);
    if (moved) {
        score += pointsEarned;
    }
    return moved;
}

// Движение вверх
function moveUp() {
    const previousGrid = copyGrid();
    let moved = false;
    let pointsEarned = 0;
    
    for (let j = 0; j < GRID_SIZE; j++) {
        const column = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            if (grid[i][j] !== 0) {
                column.push(grid[i][j]);
            }
        }
        
        const newColumn = [];
        let i = 0;
        
        while (i < column.length) {
            if (i < column.length - 1 && column[i] === column[i + 1]) {
                const mergedValue = column[i] * 2;
                newColumn.push(mergedValue);
                pointsEarned += mergedValue;
                i += 2;
            } else {
                newColumn.push(column[i]);
                i++;
            }
        }
        
        while (newColumn.length < GRID_SIZE) {
            newColumn.push(0);
        }
        
        for (let i = 0; i < GRID_SIZE; i++) {
            grid[i][j] = newColumn[i];
        }
    }
    
    moved = !gridsEqual(previousGrid, grid);
    if (moved) {
        score += pointsEarned;
    }
    return moved;
}

// Движение вниз
function moveDown() {
    const previousGrid = copyGrid();
    let moved = false;
    let pointsEarned = 0;
    
    for (let j = 0; j < GRID_SIZE; j++) {
        const column = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            if (grid[i][j] !== 0) {
                column.push(grid[i][j]);
            }
        }
        
        const newColumn = [];
        let i = column.length - 1;
        
        while (i >= 0) {
            if (i > 0 && column[i] === column[i - 1]) {
                const mergedValue = column[i] * 2;
                newColumn.unshift(mergedValue);
                pointsEarned += mergedValue;
                i -= 2;
            } else {
                newColumn.unshift(column[i]);
                i--;
            }
        }
        
        while (newColumn.length < GRID_SIZE) {
            newColumn.unshift(0);
        }
        
        for (let i = 0; i < GRID_SIZE; i++) {
            grid[i][j] = newColumn[i];
        }
    }
    
    moved = !gridsEqual(previousGrid, grid);
    if (moved) {
        score += pointsEarned;
    }
    return moved;
}

// Обработка хода
function makeMove(direction) {
    let moved = false;
    
    switch(direction) {
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
    }
    
    if (moved) {
        addRandomTile();
        updateDisplay();
        updateScore();
    }
}

// Обработка нажатий клавиш (стрелки)
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        makeMove('left');
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        makeMove('right');
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        makeMove('up');
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        makeMove('down');
    }
});

// Обработка свайпов для мобильных устройств
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Горизонтальный свайп
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                makeMove('right');
            } else {
                makeMove('left');
            }
        }
    } else {
        // Вертикальный свайп
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                makeMove('down');
            } else {
                makeMove('up');
            }
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    // Инициализация обработчиков свайпов
    const gameWrapper = document.querySelector('.game-wrapper');
    
    if (gameWrapper) {
        gameWrapper.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
            touchStartY = event.changedTouches[0].screenY;
        }, { passive: true });
        
        gameWrapper.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            touchEndY = event.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }
});
