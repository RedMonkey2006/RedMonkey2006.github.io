function buyUpgrade(type) {
    const upgrade = gameState.upgrades[type];
    
    if (!upgrade) {
        console.error('Неизвестный тип улучшения:', type);
        return;
    }
    
    if (gameState.score >= upgrade.cost) {
        gameState.score -= upgrade.cost;
        
        switch(type) {
            case 'clickPower':
                gameState.clickPower++;
                upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, gameState.clickPower - 1));
                break;
                
            case 'autoClicker':
                gameState.autoClicker++;
                upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.8, gameState.autoClicker));
                break;
                
            case 'clickMultiplier':
                gameState.clickMultiplier *= 2;
                upgrade.cost = upgrade.baseCost * gameState.clickMultiplier;
                break;
        }
        
        updateDisplay();
        console.log(Куплено улучшение: ${type});
        
        // Вибрация
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
        }
    } else {
        console.log('Недостаточно очков для улучшения');
    }
}

// Обновление кнопок улучшений
function updateUpgradeButtons() {
    const upgradeButtons = document.querySelectorAll('.upgrade-btn');
    
    upgradeButtons.forEach(button => {
        const type = button.getAttribute('data-type');
        const cost = gameState.upgrades[type].cost;
        
        if (gameState.score >= cost) {
            button.disabled = false;
            button.style.opacity = '1';
        } else {
            button.disabled = true;
            button.style.opacity = '0.5';
        }
    });
}

// Сохранение и загрузка прогресса
function saveProgress() {
    try {
        localStorage.setItem('telegramClickerSave', JSON.stringify(gameState));
        console.log('Прогресс сохранен');
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('telegramClickerSave');
        if (saved) {
            const loadedState = JSON.parse(saved);
            gameState = { ...gameState, ...loadedState };
            console.log('Прогресс загружен');
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

// Инициализация игры
function initGame() {
    console.log('Инициализация игры...');
    
    initTelegram();
    loadProgress();
    setupClickHandler();
    setupUpgradeHandlers();
    startAutoClicker();
    updateDisplay();
    
    console.log('Игра запущена!');
    
    // Автосохранение каждые 30 секунд
    setInterval(saveProgress, 30000);
}

// Запуск игры когда страница загружена
document.addEventListener('DOMContentLoaded', initGame);

// Для отладки - выводим состояние игры в консоль
window.getGameState = () => gameState;
