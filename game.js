const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
//We will need the gamecontainer to make it blury
//When we display the end menu
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/bird_sing.png';

//Game constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 26;
const BIRD_HEIGHT = 36;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//Bird variables
let birdX = 26;
let birdY = 36;
let birdVelocity = 0;
let birdAcceleration = 0.25;

//Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

//Score
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

//We add a bool variable, so we can check when flappy passes we increase
//the value
let scored = false

//Lets us control the bird with thee space key
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

//Lets us restart the game if we hit game-over
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})

function increaseScore() {
    //Increase now our counter when our flappy passes the pipes
    if(birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
            !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }

}

function collisionCheck() {
    //Create bounding Boxes for the bird and the pipes

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    //Check for collision with upper pipe box
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    //Check for collision with lower pipe box
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }

    //Check if bird hits boundaries
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;

}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    //This way we update always our highscore at the end our game
    //If we have a higher highscore than the previous
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

//We reset the values to the beginning ss we start
//with the bird at the beginnnig
function resetGame() {
    birdX = 26;
    birdY = 36;
    birdVelocity = 0;
    birdAcceleration = 0.2;

    pipeX = 400;
    pipeY = canvas.height - 200; 

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // Reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Flappy Bird
    ctx.drawImage(flappyImg, birdX, birdY);

    //Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //Now we woould need to add a collision check to display our end-menu
    //And end the game
    //The collisionCheck will return us true if we have a colision
    //Otherwise flase
    if (collisionCheck()) {
        endGame();
        return;
    }

    //Forgot to move the pipes
    pipeX -= 1.5;
    // if the pipe moves out of the frame we need to the pipe
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    //App gravity to the bird and let it move
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    //Always check if you call the function ...
    increaseScore()
    requestAnimationFrame(loop);
}

loop();