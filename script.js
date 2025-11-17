// Игровые переменные
let gameState = {
    score: 0,
    level: 1,
    clickPower: 1,
    autoClicker: 0,
    clickMultiplier: 1,
    upgrades: {
        clickPower: { baseCost: 10, cost: 10 },
        autoClicker: { baseCost: 50, cost: 50 },
        clickMultiplier: { baseCost: 100, cost: 100 }
    }
};

// Элементы DOM
const elements = {
    score: document.getElementById('score'),
    level: document.getElementById('level'),
    clickPower: document.getElementById('clickPower'),
    cps: document.getElementById('cps'),
    clickBtn: document.getElementById('clickBtn'),
    costElements: {
        clickPower: document.getElementById('clickPowerCost'),
        autoClicker: document.getElementById('autoClickerCost'),
        multiplier: document.getElementById('multiplierCost')
    }
};

// Инициализация Telegram Web App
function initTelegram() {
    try {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        console.log('Telegram Web App инициализирован');
    } catch (error) {
        console.log('Telegram Web App не доступен, работаем в браузере');
    }
}

// Основной клик
function setupClickHandler() {
    elements.clickBtn.addEventListener('click', handleClick);
    console.log('Обработчик клика установлен');
}

function handleClick() {
    const points = gameState.clickPower * gameState.clickMultiplier;
    gameState.score += points;
    
    updateDisplay();
    animateClick();
    
    // Вибрация если доступна
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
    
    console.log(Клик! +${points} очков, всего: ${gameState.score});
}

// Анимация клика
function animateClick() {
    elements.clickBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        elements.clickBtn.style.transform = 'scale(1)';
    }, 100);
}

// Автокликер
function startAutoClicker() {
    setInterval(() => {
        if (gameState.autoClicker > 0) {
            const autoPoints = gameState.autoClicker * gameState.clickMultiplier;
            gameState.score += autoPoints;
            updateDisplay();
            
            // Показываем автоклики в консоли для отладки
            if (autoPoints > 0) {
                console.log(Автоклик! +${autoPoints} очков);
            }
        }
    }, 1000);
}

// Обновление отображения
function updateDisplay() {
    elements.score.textContent = Math.floor(gameState.score);
    elements.level.textContent = gameState.level;
    elements.clickPower.textContent = gameState.clickPower * gameState.clickMultiplier;
    elements.cps.textContent = gameState.autoClicker * gameState.clickMultiplier;
    
    // Обновляем цены
    elements.costElements.clickPower.textContent = gameState.upgrades.clickPower.cost;
    elements.costElements.autoClicker.textContent = gameState.upgrades.autoClicker.cost;
    elements.costElements.multiplier.textContent = gameState.upgrades.clickMultiplier.cost;
    
    // Проверяем уровень
    checkLevel();
    
    // Обновляем доступность кнопок улучшений
    updateUpgradeButtons();
}

// Проверка уровня
function checkLevel() {
    const newLevel = Math.floor(gameState.score / 1000) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        showLevelUpMessage();
    }
}

// Сообщение о новом уровне
function showLevelUpMessage() {
    try {
        Telegram.WebApp.showPopup({
            title: '🎉 Новый уровень!',
            message: Ты достиг ${gameState.level} уровня!,
            buttons: [{ type: 'ok' }]
        });
    } catch (error) {
        alert(🎉 Новый уровень! Ты достиг ${gameState.level} уровня!);
    }
}

// Система улучшений
function setupUpgradeHandlers() {
    const upgradeButtons = document.querySelectorAll('.upgrade-btn');
    
    upgradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            buyUpgrade(type);
        });
    });
    
    console.log('Обработчики улучшений установлены');
}
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
