let handpose;
let video;
let predictions = [];
let modelLoaded = false;
let balls = [];
let interactionRadius = 20;
let score = 0;
let gameTimer = 60; 
let startTime;
let gameOver = false;
let gameStarted = false;


let indexFingerBuffer = [];
const bufferSize = 5;

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('canvasContainer'); 
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


  document.querySelector('.header').style.display = 'none';
}

function modelReady() {
  console.log("Model ready!");
  modelLoaded = true;
}

function draw() {
  if (!gameStarted) return;

  background(220);


  push();
  translate(width, 0); 
  scale(-1, 1); 
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
    const [x, y, z] = keypoints[8]; 

    indexFingerBuffer.push([x, y]);

    
    if (indexFingerBuffer.length > bufferSize) {
      indexFingerBuffer.shift();
    }


    let avgX = 0;
    let avgY = 0;
    for (let i = 0; i < indexFingerBuffer.length; i++) {
      avgX += indexFingerBuffer[i][0];
      avgY += indexFingerBuffer[i][1];
    }
    avgX /= indexFingerBuffer.length;
    avgY /= indexFingerBuffer.length;

    
    fill(0, 255, 0);
    noStroke();
    ellipse(width - avgX, avgY, 10, 10); 
  }
}

function checkInteractions() {
  if (indexFingerBuffer.length > 0) {
    const [indexX, indexY] = indexFingerBuffer[indexFingerBuffer.length - 1]; 
    const adjustedIndexX = width - indexX;

    
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
        this.isBroken = true; 
        score += 1;
      }
    }
  }

  isExpired() {
    
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
  balls = []; 
  setInterval(spawnBall, 1000); 
  loop(); 
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
