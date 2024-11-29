// Variables for the game state
let score = 0;
let lives = 3;
let isJumping = false;
let isDucking = false;
let gameStarted = false;
let gameOver = false;
let xPosition = 0;
let timer;
let intervalSpeed = 25;

// Get DOM elements
let scoreDisplay = document.getElementById('score');
const height = 300;
const width = 900;
const runningCanvas = document.getElementById("gameCanvas");
const ctx = runningCanvas.getContext("2d");
let startButton = document.querySelector('input[value="Start Game"]');
let stopButton = document.querySelector('input[value="Stop Game"]');

// Character and obstacle properties
const character = {
    x: 50,
    y: 250,
    width: 50,
    height: 50,
    color: "green"
};

const obstacle = {
    x: width, // starts obstacle coming in from right
    y: 150, //fixes bug where obstacle collides before touching green square
    width: 50,
    height: 50,
    color: "red"
};

// blue background
function drawBackground() { 
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, width, height);
}

// character: green square
function drawCharacter() { 
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

// obstacle: red square
function drawObstacle() { 
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawLives() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Lives: ${lives}`, 10, 30);
}

// move obstacle square (same method from snowman lab)
function moveObstacle() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawCharacter();
    drawLives();

    obstacle.x -= 10;

    // Reset obstacle and increase score when it passes
    if (obstacle.x < -50) {
        obstacle.x = width;
        score += 10; //increases score
        scoreDisplay.textContent = score; //updates score
    }

    console.log(`Character (x: ${character.x}, y: ${character.y}), Obstacle (x: ${obstacle.x}, y: ${obstacle.y})`);

    // Check for collision
    if (checkCollision()) {
        lives--;
        obstacle.x = width;
    
        if (lives <= 0) {
            gameOver = true;
            stopMovement();
            alert("Game Over! Your score: " + score);
            startButton.value = "Start Game";
            score = 0;
            lives = 3;
            scoreDisplay.textContent = score;
            obstacle.x = width;
            ctx.clearRect(0, 0, width, height);
            drawBackground();
            drawCharacter();
        }
    }


    drawObstacle();
}

// Start game
function drawScene() { 
    if (!gameStarted) {
        gameStarted = true;
        startButton.value = "Restart Game";
        obstacleTimer();
    } else {
        // Restart game
        score = 0;
        lives = 3;
        scoreDisplay.textContent = score;
        obstacle.x = width;
        clearInterval(timer);
        obstacleTimer();
    }
}

function checkCollision() {
    const horizontalCollision = obstacle.x < character.x + character.width && obstacle.x + obstacle.width > character.x;
    
    const verticalCollision = obstacle.y + obstacle.height > character.y && obstacle.y < character.y + character.height;

    return horizontalCollision && verticalCollision;
     /* OLD CHECKCOLLISION
    return (
        obstacle.x < character.x + character.width &&
        obstacle.x + obstacle.width > character.x &&
        obstacle.y < character.y + character.height &&
        obstacle.y + obstacle.height > character.y
    );
    */
}

let jumpHeight = 10;

function jump() {
    if (!isJumping) {
        isJumping = true;
        jumpHeight = 15;
        let jumpSpeed = 15;
        let gravity = 3;
        let maxHeight = 200;

        performJump(jumpSpeed, gravity, maxHeight);
    }

    function performJump(jumpSpeed, gravity, maxHeight) {
        let jumpInterval = setInterval(() => {
            if (jumpHeight < maxHeight) {
                character.y -= jumpSpeed;
                jumpHeight += jumpSpeed;
            }
            else {
                character.y += gravity;
            }

            if (character.y >= 250) {
                clearInterval(jumpInterval);
                isJumping = false;
                character.y = 250;
            }
        }, 20);
    }
}
        /*Old performJump() function
        function performJump() {
            if (jumpCount < 15) {
                character.y -= jumpSpeed;
                jumpCount++;
            } 
            else if (jumpCount < 30) {
                old else if (jumpcount > 30)
                character.y += fallSpeed;
                jumpCount++; 
            } 
            else {
                isJumping = false;
                character.y = 250;
                return;
            }
            
            if (isJumping) {
                requestAnimationFrame(performJump);
            }
        }
        
        performJump();
        */

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

 // Timer for moving obstacle
function obstacleTimer() {
    // x coordinate for obstacle
    xPosition = 0;
    timer = setInterval("moveObstacle()", intervalSpeed);
}

// Stop obstacle movement timer
function stopMovement() {
    clearInterval(timer);
    gameStarted = false;
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    
    if (!gameStarted || gameOver) return;

    switch(event.key) {
        case 'ArrowUp': // Jump
        case ' ':
            event.preventDefault();
            jump();
            break;
        case 'ArrowDown': //Duck
            event.preventDefault();
            duck();
            break;
    }
});



// Initial setup
drawBackground();
drawCharacter();
drawObstacle();