const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{x: 9 * box, y: 10 * box}];
let food = {x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box};
let direction = null;
let score = 0;
let game;

document.addEventListener('keydown', changeDirection);
document.getElementById('restartButton').addEventListener('click', restartGame);

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
let xDown = null;
let yDown = null;

function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            direction = 'LEFT';
        } else {
            direction = 'RIGHT';
        }
    } else {
        if (yDiff > 0) {
            direction = 'UP';
        } else {
            direction = 'DOWN';
        }
    }

    xDown = null;
    yDown = null;
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (key === 38 && direction !== 'DOWN') direction = 'UP';
    else if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (key === 40 && direction !== 'UP') direction = 'DOWN';
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } else {
        snake.pop();
    }

    const newHead = {x: snakeX, y: snakeY};

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    snake = [{x: 9 * box, y: 10 * box}];
    food = {x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box};
    direction = null;
    score = 0;
    clearInterval(game);
    game = setInterval(drawGame, 100);
}

game = setInterval(drawGame, 100);
