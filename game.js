// Инициализация игры 2048

const GRID_SIZE = 4;
const STORAGE_KEY = 'game2048_state';
const LEADERS_STORAGE_KEY = 'game2048_leaders';
let grid = [];
let score = 0;
let gameHistory = []; // История состояний игры для отмены ходов

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

// Сохранение состояния игры в localStorage
function saveGameStateToStorage() {
    const gameState = {
        grid: grid,
        score: score,
        timestamp: Date.now()
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
    }
}

// Загрузка состояния игры из localStorage
function loadGameStateFromStorage() {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const gameState = JSON.parse(savedState);
            grid = gameState.grid;
            score = gameState.score;
            return true;
        }
    } catch (e) {
        console.error('Ошибка загрузки из localStorage:', e);
    }
    return false;
}

// Очистка сохраненного состояния
function clearGameStateFromStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Ошибка очистки localStorage:', e);
    }
}

// Инициализация игры - добавляем 2 начальные плитки
function initGame(forceNew = false) {
    // Пытаемся загрузить сохраненное состояние, если не принудительно новая игра
    if (!forceNew && loadGameStateFromStorage()) {
        // Состояние загружено из localStorage
        updateDisplay();
        updateScore();
        hideGameOverModal();
    } else {
        // Новая игра
        initGrid();
        score = 0;
        gameHistory = []; // Очищаем историю при новой игре
        hideGameOverModal(); // Скрываем модальное окно при новой игре
        addRandomTile();
        addRandomTile();
        updateDisplay();
        updateScore();
        saveGameStateToStorage(); // Сохраняем новое состояние
    }
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
    // Сохраняем состояние после обновления счета
    saveGameStateToStorage();
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

// Сохранение текущего состояния игры
function saveGameState() {
    const state = {
        grid: copyGrid(),
        score: score
    };
    gameHistory.push(state);
    // Ограничиваем историю последними 50 ходами
    if (gameHistory.length > 50) {
        gameHistory.shift();
    }
}

// Восстановление предыдущего состояния игры
function restorePreviousState() {
    if (gameHistory.length === 0) {
        return false; // Нет истории для восстановления
    }
    
    const previousState = gameHistory.pop();
    grid = previousState.grid;
    score = previousState.score;
    
    updateDisplay();
    updateScore(); // updateScore уже сохраняет состояние
    return true;
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
    // Сохраняем текущее состояние перед ходом
    saveGameState();
    
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
        // Проверяем, не закончилась ли игра
        checkGameOver();
    } else {
        // Если ход не был сделан, удаляем сохраненное состояние
        gameHistory.pop();
    }
}

// Проверка возможности хода
function canMove() {
    // Проверяем наличие пустых ячеек
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                return true;
            }
        }
    }
    
    // Проверяем возможность слияния соседних плиток
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const current = grid[i][j];
            // Проверяем правого соседа
            if (j < GRID_SIZE - 1 && grid[i][j + 1] === current) {
                return true;
            }
            // Проверяем нижнего соседа
            if (i < GRID_SIZE - 1 && grid[i + 1][j] === current) {
                return true;
            }
        }
    }
    
    return false;
}

// Проверка окончания игры
function checkGameOver() {
    if (!canMove()) {
        showGameOverModal();
    }
}

// Показать модальное окно окончания игры
function showGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    if (modal) {
        modal.classList.add('show');
        // Очищаем поле ввода имени
        const nameInput = document.getElementById('player-name-input');
        if (nameInput) {
            nameInput.value = '';
        }
    }
}

// Скрыть модальное окно окончания игры
function hideGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Сохранение результата в таблицу лидеров
function saveLeaderResult(playerName, playerScore) {
    try {
        let leaders = JSON.parse(localStorage.getItem(LEADERS_STORAGE_KEY) || '[]');
        
        // Добавляем новый результат
        leaders.push({
            name: playerName,
            score: playerScore,
            date: Date.now()
        });
        
        // Сортируем по счету (по убыванию)
        leaders.sort((a, b) => b.score - a.score);
        
        // Оставляем только топ-10
        leaders = leaders.slice(0, 10);
        
        // Сохраняем обратно в localStorage
        localStorage.setItem(LEADERS_STORAGE_KEY, JSON.stringify(leaders));
        
        return true;
    } catch (e) {
        console.error('Ошибка сохранения результата:', e);
        return false;
    }
}

// Загрузка результатов из localStorage
function loadLeaders() {
    try {
        const leaders = JSON.parse(localStorage.getItem(LEADERS_STORAGE_KEY) || '[]');
        return leaders;
    } catch (e) {
        console.error('Ошибка загрузки результатов:', e);
        return [];
    }
}

// Отображение таблицы лидеров
function displayLeaders() {
    const leaders = loadLeaders();
    const tableBody = document.getElementById('leaders-table-body');
    
    if (!tableBody) return;
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    if (leaders.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = 'No records yet';
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
        cell.style.color = 'rgba(255, 255, 255, 0.7)';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }
    
    // Заполняем таблицу
    leaders.forEach((leader, index) => {
        const row = document.createElement('tr');
        
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = leader.name;
        row.appendChild(nameCell);
        
        const scoreCell = document.createElement('td');
        scoreCell.textContent = leader.score;
        row.appendChild(scoreCell);
        
        tableBody.appendChild(row);
    });
}

// Показать модальное окно лидеров
function showLeadersModal() {
    const modal = document.getElementById('leaders-modal');
    if (modal) {
        displayLeaders();
        modal.classList.add('show');
    }
}

// Скрыть модальное окно лидеров
function hideLeadersModal() {
    const modal = document.getElementById('leaders-modal');
    if (modal) {
        modal.classList.remove('show');
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
    
    // Обработчик кнопки "back"
    const backButton = document.getElementById('back-button');
    const backButtonBottom = document.getElementById('back-button-bottom');
    
    function handleBackClick() {
        const restored = restorePreviousState();
        if (!restored) {
            // Можно добавить визуальную обратную связь, если история пуста
            console.log('Нет ходов для отмены');
        }
    }
    
    if (backButton) {
        backButton.addEventListener('click', handleBackClick);
    }
    
    if (backButtonBottom) {
        backButtonBottom.addEventListener('click', handleBackClick);
    }
    
    // Обработчик кнопки "new" - новая игра
    const newButton = document.getElementById('new-button');
    const newButtonBottom = document.getElementById('new-button-bottom');
    
    function handleNewClick() {
        // Полностью перезапускаем игру (принудительно новая игра)
        clearGameStateFromStorage();
        initGame(true);
    }
    
    if (newButton) {
        newButton.addEventListener('click', handleNewClick);
    }
    
    if (newButtonBottom) {
        newButtonBottom.addEventListener('click', handleNewClick);
    }
    
    // Обработчик кнопки "сохранить результат" в модальном окне
    const saveResultButton = document.getElementById('save-result-button');
    if (saveResultButton) {
        saveResultButton.addEventListener('click', function() {
            const nameInput = document.getElementById('player-name-input');
            const playerName = nameInput ? nameInput.value.trim() : '';
            
            if (playerName) {
                // Сохраняем результат в таблицу лидеров
                saveLeaderResult(playerName, score);
                hideGameOverModal();
            } else {
                // Можно добавить визуальную обратную связь
                alert('Please enter your name');
            }
        });
    }
    
    // Обработчик кнопки "новая игра" в модальном окне
    const newGameModalButton = document.getElementById('new-game-modal-button');
    if (newGameModalButton) {
        newGameModalButton.addEventListener('click', function() {
            hideGameOverModal();
            clearGameStateFromStorage();
            initGame(true);
        });
    }
    
    // Обработчик кнопки "leaders"
    const leadersButton = document.getElementById('leaders-button');
    const leadersButtonBottom = document.getElementById('leaders-button-bottom');
    
    function handleLeadersClick() {
        showLeadersModal();
    }
    
    if (leadersButton) {
        leadersButton.addEventListener('click', handleLeadersClick);
    }
    
    if (leadersButtonBottom) {
        leadersButtonBottom.addEventListener('click', handleLeadersClick);
    }
    
    // Обработчик кнопки "Close" в модальном окне лидеров
    const closeLeadersButton = document.getElementById('close-leaders-button');
    if (closeLeadersButton) {
        closeLeadersButton.addEventListener('click', function() {
            hideLeadersModal();
        });
    }
    
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
