let handpose;
let video;
let predictions = [];
let modelLoaded = false;
let balls = [];
let interactionRadius = 20;
let score = 0;
let gameTimer = 60; // Game duration in seconds
let startTime;
let gameOver = false;
let gameStarted = false;

// Buffer for recent index finger positions
let indexFingerBuffer = [];
const bufferSize = 5;

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('canvasContainer'); // Attach canvas to the container
  video = createCapture(VIDEO);
  video.size(640, 480);

  handpose = ml5.handpose(video, modelReady);

  handpose.on("predict", results => {
    predictions = results;
  });

  video.hide();

  document.getElementById('playButton').addEventListener('click', startGame);
  document.getElementById('instructionsButton').addEventListener('click', showInstructions);
  document.getElementById('backButton').addEventListener('click', hideInstructions);
  document.getElementById('restartButton').addEventListener('click', restartGame);

  // Hide score and timer initially
  document.querySelector('.header').style.display = 'none';
}

function modelReady() {
  console.log("Model ready!");
  modelLoaded = true;
}

function draw() {
  if (!gameStarted) return;

  background(220);

  // Draw flipped video at the center of the canvas
  push();
  translate(width, 0); // Move the origin to the top-right corner
  scale(-1, 1); // Flip the x-axis
  image(video, 0, 0, width, height);
  pop();

  if (modelLoaded && !gameOver) {
    drawIndexFingerTip();
    checkInteractions();
    updateTimer();
  }

  
  for (let i = balls.length - 1; i >= 0; i--) {
    balls[i].update();
    if (balls[i].isBroken || balls[i].isExpired()) {
      balls.splice(i, 1); 
    } else {
      balls[i].display();
    }
  }

 
  document.getElementById('score').textContent = 'Score: ' + score;
  document.getElementById('timer').textContent = 'Time: ' + max(0, gameTimer - int((millis() - startTime) / 1000));

  if (gameOver) {
    noLoop();
    document.getElementById('endMessage').textContent = 'Game Over';
    document.getElementById('finalScore').textContent = 'Score: ' + score;
    document.getElementById('endScreen').style.display = 'flex';
    document.getElementById('canvasContainer').style.display = 'none';
  }
}

function drawIndexFingerTip() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].landmarks;
    const [x, y, z] = keypoints[8]; // Index finger tip

    // Add to buffer
    indexFingerBuffer.push([x, y]);

    // Maintain buffer size
    if (indexFingerBuffer.length > bufferSize) {
      indexFingerBuffer.shift();
    }

    // Calculate average position
    let avgX = 0;
    let avgY = 0;
    for (let i = 0; i < indexFingerBuffer.length; i++) {
      avgX += indexFingerBuffer[i][0];
      avgY += indexFingerBuffer[i][1];
    }
    avgX /= indexFingerBuffer.length;
    avgY /= indexFingerBuffer.length;

    // Draw the smoothed position
    fill(0, 255, 0);
    noStroke();
    ellipse(width - avgX, avgY, 10, 10); // Adjust position for flipped video
  }
}

function checkInteractions() {
  if (indexFingerBuffer.length > 0) {
    const [indexX, indexY] = indexFingerBuffer[indexFingerBuffer.length - 1]; // Use the latest buffered position
    const adjustedIndexX = width - indexX; // Adjust x position for flipped video

    // Check for breaking objects
    for (let ball of balls) {
      ball.checkHit(adjustedIndexX, indexY);
    }
  }
}

function spawnBall() {
  if (!gameOver) {
    balls.push(new Ball(random(width), random(height), 20, millis()));
  }
}

class Ball {
  constructor(x, y, r, spawnTime) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color(random(255), random(255), random(255));
    this.isBroken = false;
    this.spawnTime = spawnTime;
  }

  update() {
    // Ball logic can go here if needed
  }

  display() {
    if (!this.isBroken) {
      fill(this.color);
      noStroke();
      ellipse(this.x, this.y, this.r * 2);
    }
  }

  checkHit(px, py) {
    if (!this.isBroken) {
      let d = dist(px, py, this.x, this.y);
      if (d < this.r + interactionRadius) {
        this.isBroken = true; // Break the ball
        score += 1; // Increase score
      }
    }
  }

  isExpired() {
    // Check if the ball has existed for more than 3 seconds
    return millis() - this.spawnTime > 3000;
  }
}

function updateTimer() {
  let currentTime = millis();
  let remainingTime = gameTimer - int((currentTime - startTime) / 1000);

  if (remainingTime <= 0) {
    gameOver = true;
    remainingTime = 0;
  }
}

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.querySelector('.header').style.display = 'flex';
  document.getElementById('canvasContainer').style.display = 'block';
  gameStarted = true;
  startTime = millis();
  score = 0;
  gameOver = false;
  balls = []; // Reset the balls array
  setInterval(spawnBall, 1000); // Spawn a new ball every second
  loop(); // Start the draw loop
}

function showInstructions() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('instructionsScreen').style.display = 'block';
}

function hideInstructions() {
  document.getElementById('instructionsScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
}

function restartGame() {
  document.getElementById('endScreen').style.display = 'none';
  startGame();
}
