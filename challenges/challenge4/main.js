document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('map').style.display = 'block';
  document.getElementById('info').style.display = 'block';
  document.getElementById('question').style.display = 'block';
  initializeGame();
}

function initializeGame() {
  const map = L.map('map').setView([50.850346, 4.351721], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  const landmarks = [
    { lat: 50.850346, long: 4.351721, challenge: "1. What is the name of the famous statue here?", answer: "Manneken Pis" },
    { lat: 50.854457, long: 4.352202, challenge: "2. What is the primary exhibit at the Brussels City Museum?", answer: "Art and History" },
    { lat: 50.846733, long: 4.349847, challenge: "3. What year was the Grand Place built?", answer: "1698" },
    { lat: 50.857050, long: 4.354144, challenge: "4. Solve this riddle: I am a gallery but not for art, what am I?", answer: "Royal Gallery of Saint Hubert" },
    { lat: 50.843608, long: 4.360192, challenge: "5. What is the main feature of the Parc de Bruxelles?", answer: "Fountain" },
  ];

  let score = 0;
  const completedTasks = new Set();
  const markers = {};

  landmarks.forEach(landmark => {
    const marker = L.marker([landmark.lat, landmark.long]).addTo(map)
      .on('click', () => {
        if (completedTasks.has(`${landmark.lat}-${landmark.long}`)) {
          showMessage("You have already completed this challenge!");
          return;
        }
        showQuestion(landmark);
      });
    markers[`${landmark.lat}-${landmark.long}`] = marker;
  });

  window.checkAnswer = (lat, long, correctAnswer) => {
    const userAnswer = document.getElementById('answer').value;
    const marker = markers[`${lat}-${long}`];

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      displayResult("Correct!", true);
      score += 10;
      marker.setIcon(new L.Icon({
        iconUrl: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }));
      completedTasks.add(`${lat}-${long}`);
      disableQuestion();
      updateInfo();
    } else {
      displayResult("Wrong answer! Try again.", false);
    }
  };

  function showQuestion(landmark) {
    const questionDiv = document.getElementById('question');
    questionDiv.innerHTML = `
      <h2>Question:</h2>
      <p>${landmark.challenge}</p>
      <input type="text" id="answer" placeholder="Your answer here">
      <button id="submit-answer" onclick="checkAnswer('${landmark.lat}', '${landmark.long}', '${landmark.answer}')">Submit</button>
      <p id="result"></p>
    `;
  }

  function displayResult(message, isCorrect) {
    const resultDiv = document.getElementById('result');
    const answerInput = document.getElementById('answer');
    resultDiv.textContent = message;
    if (isCorrect) {
      resultDiv.classList.remove('wrong');
      answerInput.classList.remove('wrong');
      resultDiv.classList.add('correct');
      answerInput.classList.add('correct');
    } else {
      resultDiv.classList.remove('correct');
      answerInput.classList.remove('correct');
      resultDiv.classList.add('wrong');
      answerInput.classList.add('wrong');
    }
  }

  function disableQuestion() {
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit-answer');
    if (answerInput && submitButton) {
      answerInput.disabled = true;
      submitButton.disabled = true;
    }
  }

  function showMessage(message) {
    const questionDiv = document.getElementById('question');
    questionDiv.innerHTML = `<p>${message}</p>`;
  }

  function updateInfo() {
    let infoDiv = document.getElementById('info');
    infoDiv.innerHTML = `<h2>Score: ${score}</h2>`;
  }

  updateInfo();
}
