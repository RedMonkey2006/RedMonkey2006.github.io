const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Размеры и позиции ракеток
const paddleWidth = 10, paddleHeight = 100;
let playerPaddleY = (canvas.height - paddleHeight) / 2;
let botPaddleY = (canvas.height - paddleHeight) / 2;

// Позиция и скорость мяча
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballRadius = 10;

// Управление ракеткой игрока
let upPressed = false;
let downPressed = false;

// Кнопки управления
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const restartButton = document.getElementById("restartButton");

// Обработка нажатия кнопок
upButton.addEventListener("touchstart", (e) => {
  e.preventDefault();
  upPressed = true;
});
upButton.addEventListener("touchend", () => {
  upPressed = false;
});

downButton.addEventListener("touchstart", (e) => {
  e.preventDefault();
  downPressed = true;
});
downButton.addEventListener("touchend", () => {
  downPressed = false;
});

// Перезапуск игры
restartButton.addEventListener("click", () => {
  resetGame();
});

// Логика бота
function moveBot() {
  const botPaddleCenter = botPaddleY + paddleHeight / 2;
  if (botPaddleCenter < ballY - 10) {
    botPaddleY += 5;
  } else if (botPaddleCenter > ballY + 10) {
    botPaddleY -= 5;
  }
}

// Сброс игры
function resetGame() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5;
  ballSpeedY = 5;
  playerPaddleY = (canvas.height - paddleHeight) / 2;
  botPaddleY = (canvas.height - paddleHeight) / 2;
}

function update() {
  // Движение ракетки игрока
  if (upPressed && playerPaddleY > 0) playerPaddleY -= 7;
  if (downPressed && playerPaddleY < canvas.height - paddleHeight) playerPaddleY += 7;

  // Движение ракетки бота
  moveBot();

  // Движение мяча
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Отскок мяча от верхней и нижней стенок
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Отскок мяча от ракеток
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > playerPaddleY &&
    ballY < playerPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > botPaddleY &&
    ballY < botPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Если мяч ушел за пределы поля, сброс позиции
  if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
    resetGame();
  }
}

function draw() {
  // Очистка холста
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Рисуем ракетки
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, playerPaddleY, paddleWidth, paddleHeight); // Ракетка игрока
  ctx.fillRect(canvas.width - paddleWidth, botPaddleY, paddleWidth, paddleHeight); // Ракетка бота

  // Рисуем мяч
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();

  // Рисуем разделительную линию
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();