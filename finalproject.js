// Variables for the game state
let score = 0;
let isJumping = false;
let isDucking = false;
let scoreDisplay = document.getElementById('score');

const height = 300;
const width = 900;

var runningCanvas = document.getElementById("gameCanvas");
var ctx = runningCanvas.getContext("2d");

function drawBackground() { // blue background
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, width, height);
}

function drawCharacter() { // character: green square
    ctx.fillStyle = "green";
    ctx.fillRect(50, 250, 50, 50);
}

function drawObstacle() { // obstacle: red square
    ctx.fillStyle = "red";
    ctx.fillRect(850, 250, 50, 50);
}

drawBackground();
drawCharacter();
drawObstacle();

function drawScene() { // draw everything, move everything; for start onclick event
    obstacleTimer();
}

function moveObstacle() { // move obstacle square (same method from snowman lab)
    ctx.save();
    drawBackground();
    drawCharacter();
    ctx.translate(xPosition, 0);
    drawObstacle();
    ctx.restore();
    xPosition = xPosition - 10;
}

function obstacleTimer() { // timer for moving obstacle
    xPosition = 0; // x coordinate for obstacle
    timer = setInterval("moveObstacle()", 25);
}

function stopMovement() { // stop obstacle movement timer
    clearInterval(timer);
}