// Variables for the game state
var gameState = {
    score: 0,
    lives: GAME_CONFIG.lives,
    isJumping: false,
    isDucking: false,
    gameStarted: false,
    gameOver: false,
    obstacles: [],
    timer: null
};

// Game Configuration
var GAME_CONFIG = {
    width: 900,
    height: 300,
    characterStartX: 50,
    characterStartY: 250,
    obstacleSpeed: 10,
    scoreIncrement: 10,
    lives: 3
};

// DOM elements Canvas and Context Setup
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');


/*
// Get DOM elements
let scoreDisplay = document.getElementById('score');
const height = 300;
const width = 900;
const runningCanvas = document.getElementById("gameCanvas");
const ctx = runningCanvas.getContext("2d");
let startButton = document.querySelector('input[value="Start Game"]');
let stopButton = document.querySelector('input[value="Stop Game"]');
*/

// Character and obstacle properties
/*
const character = {
    x: 50,
    y: 250,
    width: 50,
    height: 50,
    color: "green"
};
*/

function Character() {
    this.x = GAME_CONFIG.characterStartX;
    this.y = GAME_CONFIG.characterStartY;
    this.width = 50;
    this.height = 50;
    this.jumpHeight = 0;
    this.maxJumpHeight = 100;

    this.draw = function() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.jump = function() {
        if (!gameState.isJumping && !gameState.isDucking) {
            gameState.isJumping = true;
            this.jumpHeight = 0;
        }
    };

    this.duck = function() {
        if (!gameState.isJumping && !gameState.isDucking) {
            gameState.isDucking = true;
            this.height = 25;
            this.y += 25;

            setTimeout(function() {
                this.height = 50;
                this.y -= 25;
                gameState.isDucking = false;
            }.bind(this), 500);
        }
    };

    this.update = function() {
        if (gameState.isJumping) {
            if (this.jumpHeight < this.maxJumpHeight) {
                this.y -= 10;
                this.jumpHeight += 10;
            } else {
                this.y += 10;
                
                if (this.y >= GAME_CONFIG.characterStartY) {
                    this.y = GAME_CONFIG.characterStartY;
                    gameState.isJumping = false;
                }
            }
        }
    };
}

/*
const obstacle = {
    x: width, // starts obstacle coming in from right
    y: 150, //fixes bug where obstacle collides before touching green square
    width: 50,
    height: 50,
    color: "red"
};
*/
function Obstacle(type) {
    this.type = type;
    this.width = 50;
    this.height = 50;
    this.x = GAME_CONFIG.width;
    this.y = type === 'ground' ? 250 : 200;
    this.color = type === 'ground' ? 'red' : 'purple';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.move = function() {
        this.x -= GAME_CONFIG.obstacleSpeed;
    };
}
/*
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
*/

// main function game renderer
function renderGame() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw character
    character.draw();

    // draw obstacles
    gameState.obstacles.forEach(function(obstacle) {
        obstacle.draw();
    });

    // render pixel font
    var pixelFont = createPixelFont(ctx);
    pixelFont.drawText('SCORE: ' + gameState.score, 10, 10);
    pixelFont.drawText('LIVES: ' + gameState.lives, canvas.width - 150, 10);
}


// function to game update main
function updateGame() {
    // update character
    character.update();

    // move and remove off-screen obstacles
    gameState.obstacles = gameState.obstacles.filter(function(obstacle) {
        obstacle.move();
        return obstacle.x > -50;
    });

    // spawn new obstacles
    if (Math.random() > 0.95) {
        var type = Math.random() > 0.5 ? 'ground' : 'flying';
        gameState.obstacles.push(new Obstacle(type));
        gameState.score += 10;
    }

    // collision detection
    gameState.obstacles.forEach(function(obstacle, index) {
        var collision = 
            obstacle.x < character.x + character.width &&
            obstacle.x + obstacle.width > character.x &&
            obstacle.y < character.y + character.height &&
            obstacle.y + obstacle.height > character.y;

        if (collision) {
            gameState.lives--;
            gameState.obstacles.splice(index, 1);

            if (gameState.lives <= 0) {
                gameOver();
            }
        }
    });

    renderGame();
}


/*
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
            gameOver = false;
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
    
}
*/

// Game Over function
function gameOver() {
    gameState.gameOver = true;
    clearInterval(gameState.timer);
    alert('Game Over! Score: ' + gameState.score);
    
    // Reset game state
    gameState.score = 0;
    gameState.lives = GAME_CONFIG.lives;
    gameState.obstacles = [];
}

// Start Game Function
function startGame() {
    if (!gameState.gameStarted) {
        gameState.gameStarted = true;
        gameState.timer = setInterval(updateGame, 1000 / 60); // 60 FPS
    }
}

// Pause Game Function
function pauseGame() {
    if (gameState.gameStarted && !gameState.gameOver) {
        clearInterval(gameState.timer);
        gameState.gameStarted = false;
    }
}



/*
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
        case 'ArrowDown': // Duck
            event.preventDefault();
            duck();
            break;
    }
});
*/

// create game entities
var character = new Character();

// event listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);

document.addEventListener('keydown', function(event) {
    if (!gameState.gameStarted || gameState.gameOver) return;

    switch(event.key) {
        case 'ArrowUp':
        case ' ':
            event.preventDefault();
            character.jump();
            break;
        case 'ArrowDown':
            event.preventDefault();
            character.duck();
            break;
    }
});

// initial setup
renderGame();