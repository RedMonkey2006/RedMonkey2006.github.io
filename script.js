let moveUpInterval;
let moveDownInterval;

upButton.addEventListener('mousedown', () => {
    moveUpInterval = setInterval(() => {
        player1Y = Math.max(player1Y - 5, 0); // Меньший шаг для плавности
    }, 16); // 16 мс ≈ 60 кадров в секунду
});

downButton.addEventListener('mousedown', () => {
    moveDownInterval = setInterval(() => {
        player1Y = Math.min(player1Y + 5, GAME_HEIGHT - PADDLE_HEIGHT); // Меньший шаг для плавности
    }, 16); // 16 мс ≈ 60 кадров в секунду
});

// Остановка движения при отпускании кнопки
upButton.addEventListener('mouseup', () => clearInterval(moveUpInterval));
upButton.addEventListener('mouseleave', () => clearInterval(moveUpInterval));

downButton.addEventListener('mouseup', () => clearInterval(moveDownInterval));
downButton.addEventListener('mouseleave', () => clearInterval(moveDownInterval));
