document.addEventListener('DOMContentLoaded', () => {
    const dino = document.getElementById('dino');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const gameOverMessage = document.getElementById('game-over-message');
    const ground = document.getElementById('ground'); // Get the ground element

    let dinoBottom = 0;
    let dinoLeft = 50;
    let isJumping = false;
    let gravity = 0.9;
    let jumpForce = 15; // Adjusted jump force for better feel
    let gameSpeed = 5; // Speed at which obstacles and ground move
    let score = 0;
    let obstacles = [];
    let gameTimerId;
    let obstacleGeneratorId;
    let isGameOver = false;

    // Set initial dino position
    dino.style.left = dinoLeft + 'px';
    dino.style.bottom = dinoBottom + 'px';

    function jump() {
        if (isJumping || isGameOver) return;
        isJumping = true;
        let upInterval = setInterval(() => {
            dinoBottom += jumpForce;
            jumpForce -= gravity; // Apply gravity to jump force
            dino.style.bottom = dinoBottom + 'px';

            if (dinoBottom <= 0) { // Landed
                clearInterval(upInterval);
                isJumping = false;
                dinoBottom = 0;
                dino.style.bottom = dinoBottom + 'px';
                jumpForce = 15; // Reset jump force
            }
        }, 20);
    }

    function generateObstacle() {
        if (isGameOver) return;

        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        let obstacleLeft = gameContainer.offsetWidth;
        let obstacleBottom = 0;
        let obstacleWidth = Math.random() * (40 - 20) + 20; // Random width
        let obstacleHeight = Math.random() * (60 - 30) + 30; // Random height

        // Randomly choose obstacle type (e.g., cactus or pterodactyl - simple for now)
        // For now, all obstacles are styled the same by '.obstacle' class
        obstacle.style.width = obstacleWidth + 'px';
        obstacle.style.height = obstacleHeight + 'px';
        obstacle.style.left = obstacleLeft + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';
        // obstacle.style.backgroundColor = 'green'; // Example for different types

        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);

        moveObstacle(obstacle, obstacleLeft);
    }

    function moveObstacle(obstacle, obstacleLeft) {
        let moveInterval = setInterval(() => {
            if (isGameOver) {
                clearInterval(moveInterval);
                return;
            }
            obstacleLeft -= gameSpeed;
            obstacle.style.left = obstacleLeft + 'px';

            // Collision detection
            if (
                obstacleLeft < dinoLeft + 60 && // dino width is 60
                obstacleLeft + parseInt(obstacle.style.width) > dinoLeft &&
                dinoBottom < parseInt(obstacle.style.height) // dino height is 60, obstacle height from its bottom
            ) {
                clearInterval(moveInterval);
                gameOver();
            }

            if (obstacleLeft < -parseInt(obstacle.style.width)) { // Obstacle off screen
                clearInterval(moveInterval);
                gameContainer.removeChild(obstacle);
                obstacles = obstacles.filter(obs => obs !== obstacle);
                // Increment score when obstacle is passed
                if (!isGameOver) {
                    score++;
                    scoreDisplay.textContent = 'Score: ' + score;
                }
            }
        }, 20); // Match refresh rate with jump for smoothness
    }

    // Move ground
    let groundLeft = 0;
    function moveGround() {
        if (isGameOver) return;
        groundLeft -= gameSpeed;
        ground.style.backgroundPositionX = groundLeft + 'px'; // This needs ground to be an image or have a repeating pattern
                                                            // For a solid color, this won't show movement.
                                                            // A common technique is to have two ground elements moving.
                                                            // For simplicity, we'll use a placeholder for now.
                                                            // To actually see movement, style #ground with a repeating background image.
                                                            // e.g., background: url('ground.png') repeat-x;

        // Reset ground position to create illusion of infinite ground
        // This simple reset won't work perfectly for a single div with background-color.
        // It's better with a repeating background image or multiple ground divs.
        if (groundLeft <= -gameContainer.offsetWidth) {
            // groundLeft = 0; // This would cause a jump with a single colored div
        }
    }


    function gameOver() {
        isGameOver = true;
        clearInterval(gameTimerId);
        clearInterval(obstacleGeneratorId);
        gameOverMessage.style.display = 'block';
        // Stop all obstacle movements
        obstacles.forEach(obstacle => {
            // This requires storing and clearing intervals for each obstacle,
            // or a more robust way to stop their movement.
            // For now, the individual moveObstacle intervals handle their own clearing on game over.
        });
    }

    function restartGame() {
        isGameOver = false;
        gameOverMessage.style.display = 'none';
        score = 0;
        scoreDisplay.textContent = 'Score: ' + score;
        dinoBottom = 0;
        dino.style.bottom = dinoBottom + 'px';
        isJumping = false;
        jumpForce = 15;

        // Clear existing obstacles
        obstacles.forEach(obstacle => gameContainer.removeChild(obstacle));
        obstacles = [];

        startGame();
    }

    function startGame() {
        isGameOver = false;
        gameOverMessage.style.display = 'none';
        score = 0;
        scoreDisplay.textContent = 'Score: ' + score;
        dinoBottom = 0;
        dino.style.bottom = dinoBottom + 'px';
        isJumping = false;
        jumpForce = 15;
        groundLeft = 0; // Reset ground position

        // Clear any existing intervals if restarting
        if (gameTimerId) clearInterval(gameTimerId);
        if (obstacleGeneratorId) clearInterval(obstacleGeneratorId);

        // Clear existing obstacles from screen and array
        obstacles.forEach(obstacle => {
            if (obstacle.parentElement) gameContainer.removeChild(obstacle);
        });
        obstacles = [];

        gameTimerId = setInterval(() => {
            if (!isGameOver) {
                moveGround(); // Call moveGround in the main game loop
            }
        }, 20); // Main game loop interval
        obstacleGeneratorId = setInterval(generateObstacle, Math.random() * (3000 - 1500) + 1500); // Generate obstacles at random intervals
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (isGameOver) {
                restartGame();
            } else {
                jump();
            }
        }
    });

    // Initial call to start the game
    startGame();
});
