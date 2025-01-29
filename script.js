const gameContainer = document.querySelector('.game-container');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const ball = document.getElementById('ball');
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');

const PADDLE_HEIGHT = 60;
const BALL_SIZE = 10;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 300;

let player1Y = 120;
let player2Y = 120;
let ballX = 195;
let ballY = 145;
let ballSpeedX = 4;
let ballSpeedY = 4;

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= GAME_HEIGHT - BALL_SIZE) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX <= 20 && ballY >= player1Y && ballY <= player1Y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballX >= GAME_WIDTH - 30 && ballY >= player2Y && ballY <= player2Y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballX <= 0 || ballX >= GAME_WIDTH - BALL_SIZE) {
        resetBall();
    }

    // Бот двигает ракетку
    if (ballY < player2Y + PADDLE_HEIGHT / 2) {
        player2Y -= 2;
    } else {
        player2Y += 2;
    }

    player1.style.top = `${player1Y}px`;
    player2.style.top = `${player2Y}px`;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(update);
}

function resetBall() {
    ballX = GAME_WIDTH / 2 - BALL_SIZE / 2;
    ballY = GAME_HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = -ballSpeedX;
}

upButton.addEventListener('mousedown', () => {
    player1Y = Math.max(player1Y - 10, 0);
});

downButton.addEventListener('mousedown', () => {
    player1Y = Math.min(player1Y + 10, GAME_HEIGHT - PADDLE_HEIGHT);
});

update();