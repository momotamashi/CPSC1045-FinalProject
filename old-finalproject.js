// Game Configuration
var GAME_CONFIG = {
    width: 900,
    height: 300,
    characterStartX: 50,
    characterStartY: 230,
    obstacleSpeed: 10,
    scoreIncrement: 10,
    lives: 3
};

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

// DOM elements Canvas and Context Setup
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');


// Load Images
var frogCharacter = new Image();
frogCharacter.src = 'images/frogWborder.png';

var rockObstacle = new Image();
rockObstacle.src = 'images/brown_rocks.png';

var birdObstacle = new Image();
birdObstacle.src = 'images/blue_bird.png';

var backgroundImage = new Image();
backgroundImage.src = 'images/forest_river.png';


// Background Variables
var backgroundX = 0; // starting position for the background image
var backgroundSpeed = 2; //speed at which the background image moves


// Character and Obstacle  constructor properties
function Character() {
    this.x = GAME_CONFIG.characterStartX;
    this.y = GAME_CONFIG.characterStartY;
    this.width = 80;
    this.height = 67;
    this.jumpHeight = 0;
    this.maxJumpHeight = 150;

     // Added velocity for smoother movement
    this.dx = 0;  // horizontal velocity
    this.dy = 0;  // vertical velocity

    this.draw = function() {
        ctx.drawImage(frogCharacter, this.x, this.y, this.width, this.height);
    };

    this.jump = function() {
        if (!gameState.isJumping && !gameState.isDucking) {
            gameState.isJumping = true;
            //this.jumpHeight = 0;
            
            // Use velocity for more natural jump
            this.dy = -10;  // Initial upward velocity
        }
    };

    this.duck = function() {
        if (!gameState.isJumping && !gameState.isDucking) {
            gameState.isDucking = true;
            this.height = 35;
            this.y += 35;

            setTimeout(function() {
                this.height = 67;
                this.y -= 35;
                gameState.isDucking = false;
            }.bind(this), 350);
        }
    };

    this.update = function() {
        if (gameState.isJumping) {
            this.dy += 0.5;  // Simulates gravity
            this.y += this.dy;
            this.jumpHeight += Math.abs(this.dy);

            // Check if character has landed
            if (this.y >= GAME_CONFIG.characterStartY) {
                this.y = GAME_CONFIG.characterStartY;
                this.dy = 0;
                gameState.isJumping = false;
            }

            //if (this.jumpHeight < this.maxJumpHeight) {
            //    this.y -= 10;
            //    this.jumpHeight += 12;
            //} else {
            //    this.y += 10;
                
            //    if (this.y >= GAME_CONFIG.characterStartY) {
            //        this.y = GAME_CONFIG.characterStartY;
            //        gameState.isJumping = false;
            //    }
        }
    }
};



function Obstacle(type) {
    this.type = type;
    this.width = type === 'ground' ? 70 : 60;
    this.height = type === 'ground' ? 55 : 60;
    this.x = GAME_CONFIG.width;

    if(type === 'ground') {
        this.y = 240;
    } else if (type === 'flying') {
        this.y = 190;
    }
    /*
    this.y = type === 'ground' ? 250 : 201;
    //this.color = type === 'ground' ? 'red' : 'purple';
    */
    this.image = type === 'ground' ? rockObstacle : birdObstacle;

    this.draw = function() {
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };

    this.move = function() {
        this.x -= GAME_CONFIG.obstacleSpeed;
    };
}


backgroundImage.onload = function() {
    renderGame();
}

// main function game renderer
function renderGame() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale the background to fit the canvas width and height
    var imageWidth = backgroundImage.width;
    var imageHeight = backgroundImage.height;

    // background
    //ctx.fillStyle = '#87CEEB';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height); //draws the first image
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height); //draws the next image right after the first
    
    //moves the background to the left
    backgroundX -= backgroundSpeed;

    // reset the background position if it has moved off-screen
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }

    // draw character
    character.draw();

    // draw obstacles
    gameState.obstacles.forEach(function(obstacle) {
        obstacle.draw();
    });

    // renders score and lives directly inside of the game div, still experimental on how we want it
    ctx.font = 'bold 16px "Press Start 2P"';
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.fillStyle = 'white';
    ctx.fillText('SCORE: ' + gameState.score, 10, 20);
    ctx.fillText('LIVES: ' + gameState.lives, canvas.width - 150, 20);
    //resets shadow properties to avoid drawings
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    let scoreDisplay = document.getElementById('score');
    let livesDisplay = document.getElementById('lives');
    scoreDisplay.innerHTML = gameState.score;
    livesDisplay.innerHTML = gameState.lives;
}


// game update logic, variable for function updateGame
var obstacleTimer = 0;
// increased delay between obstacle spawns
var obstacleSpawnDelay = 120;
var lastObstacleType = null;

// function to game update main
function updateGame() {
    // update character
    character.update();

    // move and remove off-screen obstacles
    gameState.obstacles = gameState.obstacles.filter(function(obstacle) {
        obstacle.move();
        return obstacle.x > -50;
    });


    // improved obstacle spawning logic
    if (obstacleTimer % obstacleSpawnDelay === 0) {
        // Prevent spawning the same type of obstacle consecutively
        var type;
        do {
            type = Math.random() > 0.5 ? 'ground' : 'flying';
        } while (type === lastObstacleType);

        lastObstacleType = type;
        gameState.obstacles.push(new Obstacle(type));
    }

    /*
    // spawn new obstacles
    if (Math.random() > 0.98) {
        var type = Math.random() > 0.35 ? 'ground' : 'flying';
        gameState.obstacles.push(new Obstacle(type));
        gameState.score += 10;
    }
    

    // spawn new obstacles based on timer
    if (obstacleTimer % 55 === 0) { // measured in every 55 frames
        var type = Math.random() > 0.5 ? 'ground' : 'flying';
        gameState.obstacles.push(new Obstacle(type));
    }
    */
    obstacleTimer++;

    // Increment score
    gameState.score += 1;

    // Increase obstacle speed based on score
    if (gameState.score % 100 === 0 && GAME_CONFIG.obstacleSpeed < 20) {
        GAME_CONFIG.obstacleSpeed++;
        // increase spawn delay to maintain difficulty
        obstacleSpawnDelay = Math.max(60, obstacleSpawnDelay - 10);
    }

    // collision detection with more forgiving hitbox
    gameState.obstacles.forEach(function(obstacle, index) {

        // reduced hitbox size to make collisions feel more fair
        var collisionMargin = 10; // Pixels to reduce from hitbox

        // precompute adjusted obstacle boundaries
        var obstacleLeft = obstacle.x + collisionMargin;
        var obstacleRight = obstacle.x + obstacle.width - collisionMargin;
        var obstacleTop = obstacle.y + collisionMargin;
        var obstacleBottom = obstacle.y + obstacle.height - collisionMargin;

        // precompute adjusted character boundaries
        var characterRight = character.x + character.width;
        var characterBottom = character.y + character.height;

        // check for collision
        var collision = 
            character.x < obstacleRight &&
            characterRight > obstacleLeft &&
            character.y < obstacleBottom &&
            characterBottom > obstacleTop;

        if (collision) {
            gameState.lives--; // decrease lives
            gameState.obstacles.splice(index, 1); // removes the collided obstacle

            // handle game over condition
            if (gameState.lives <= 0) {
                gameOver();
            }
        }
    });

    renderGame();
}



// Game Over function
function gameOver() {
    gameState.gameOver = true;
    clearInterval(gameState.timer);
    alert('Game Over! Score: ' + gameState.score);
    
    // Reset game state
    gameState.score = 0;
    gameState.lives = GAME_CONFIG.lives;
    gameState.obstacles = [];
    gameState.gameOver = false;
    gameState.gameStarted = false;
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

// create game entities
var character = new Character();

// event listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);

document.addEventListener('keydown', function (event) {
    if (!gameState.gameStarted || gameState.gameOver) return;

    switch (event.key) {
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
















//======================================================================
// old code
/*
// Get DOM elements
let scoreDisplay = document.getElementById('score');
const height = 300;
const width = 900;
const runningCanvas = document.getElementById("gameCanvas");
const ctx = runningCanvas.getContext("2d");
let startButton = document.querySelector('input[value="Start Game"]');
let stopButton = document.querySelector('input[value="Stop Game"]');

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
