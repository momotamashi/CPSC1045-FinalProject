// Variables for the game state
let score = 0;
let lives = 3;
let isJumping = false;
let isDucking = false;
let gameStarted = false;
let gameOver = false;
let xPosition = 0;
let timer;

// Get DOM elements
let scoreDisplay = document.getElementById('score');
const height = 300;
const width = 900;
const runningCanvas = document.getElementById("gameCanvas");
const ctx = runningCanvas.getContext("2d");
const startButton = document.querySelector('input[value="Start"]');
const stopButton = document.querySelector('input[value="Stop"]');

// Update start/stop buttons
startButton.value = "Start Game";
stopButton.value = "Pause Game";

// Character and obstacle properties
const character = {
    x: 50,
    y: 250,
    width: 50,
    height: 50,
    color: "green"
};

const obstacle = {
    x: 850,
    y: 250,
    width: 50,
    height: 50,
    color: "red"
};


function drawBackground() { // blue background
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, width, height);
}

function drawCharacter() { // character: green square
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

function drawObstacle() { // obstacle: red square
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.width, obstacle.width, obstacle.height);
}

function drawLives() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Lives: ${lives}`, 10, 30);
}

function moveObstacle() { // move obstacle square (same method from snowman lab)
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawCharacter();
    drawLives();

    obstacle.x -= 10;

    // Reset obstacle and increase score when it passes
    if (obstacle.x < -50) {
        obstacle.x = width;
        score += 10;
        scoreDisplay.textContent = score;
    }

    // Check for collision
    if (checkCollision()) {
        lives--;
        obstacle.x = width;
    
        if (lives <= 0) {
            gameOver = true;
            stopMovement();
            alert("Game Over! Your score: " + score);
        }
    }


    drawObstacle();
}

function drawScene() { // draw everything, move everything; for start onclick event
    if (!gameStarted) {
        gameStarted = true;
        startButton.value = "Restart Game";
        obstacleTimer();
    } else {
        // Restart game
        score = 0;
        lives = 3;
        gameOver = false;
        scoreDisplay.textContent = score;
        obstacle.x = width;
        obstacleTimer();
    }
}

function checkCollision() {
    return (
        obstacle.x < character.x + character.width &&
        obstacle.x + obstacle.width > character.x &&
        obstacle.y < character.y + character.height &&
        obstacle.y + obstacle.height > character.y
    );
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        let jumpCount = 0;
        
        function performJump() {
            if (jumpCount < 15) {
                character.y -= 10;
                jumpCount++;
            } else if (jumpCount < 30) {
                character.y += 10;
                jumpCount++;
            } else {
                isJumping = false;
                character.y = 250;
                return;
            }
            
            if (isJumping) {
                requestAnimationFrame(performJump);
            }
        }
        
        performJump();
    }
}

function duck() {
    if (!isDucking) {
        isDucking = true;
        character.height = 25;
        character.y += 25;
        
        setTimeout(() => {
            character.height = 50;
            character.y -= 25;
            isDucking = false;
        }, 500);
    }
}

function obstacleTimer() { // timer for moving obstacle
    xPosition = 0; // x coordinate for obstacle
    timer = setInterval("moveObstacle()", 25);
}

function stopMovement() { // stop obstacle movement timer
    clearInterval(timer);
    gameStarted = false;
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (!gameStarted || gameOver) return;

    switch(event.key) {
        case 'ArrowUp':
        case ' ':
            jump();
            break;
        case 'ArrowDown':
            duck();
            break;
    }
});



// Initial setup
drawBackground();
drawCharacter();
drawObstacle();