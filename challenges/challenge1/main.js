const questions = [
  {
    question: "Who is the NBA all-time top scorer?",
    options: ["Kareem Abdul-Jabbar", "LeBron James", "Michael Jordan"],
    answer: "LeBron James"
  },
  {
    question: "How many players are on a court at the same time?",
    options: ["10", "12", "8"],
    answer: "10"
  },
  {
    question: "How many points is a free throw worth?",
    options: ["1", "2", "3"],
    answer: "1"
  },
  {
    question: "Which team has won the most NBA titles?",
    options: ["Los Angeles Lakers", "Chicago Bulls", "Boston Celtics"],
    answer: "Boston Celtics"
  },
  {
    question: "What is the diameter of a basketball hoop?",
    options: ["18 inches", "20 inches", "22 inches"],
    answer: "18 inches"
  },
  {
    question: "Which player is known as 'The Black Mamba'?",
    options: ["Kobe Bryant", "Shaquille O'Neal", "Kevin Durant"],
    answer: "Kobe Bryant"
  },
  {
    question: "Which team won the 2020 NBA Championship?",
    options: ["Miami Heat", "Los Angeles Lakers", "Golden State Warriors"],
    answer: "Los Angeles Lakers"
  },
  {
    question: "How many points is a three-pointer worth?",
    options: ["2", "3", "4"],
    answer: "3"
  },
  {
    question: "What is the regulation height of a basketball hoop?",
    options: ["10 feet", "11 feet", "12 feet"],
    answer: "10 feet"
  },
  {
    question: "Which player has the nickname 'The King'?",
    options: ["LeBron James", "Stephen Curry", "Giannis Antetokounmpo"],
    answer: "LeBron James"
  }
];

let currentQuestionIndex = 0;
let score = 0;
const language = 'en-US';

document.getElementById('startButton').addEventListener('click', startQuiz);
document.getElementById('speakQuestionBtn').addEventListener('click', speakQuestion);
document.getElementById('speakAnswerBtn').addEventListener('click', recognizeSpeech);
document.getElementById('retryButton').addEventListener('click', retryQuiz);

function startQuiz() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('question-container').style.display = 'block';
  displayQuestion();
}

function speakQuestion() {
  const question = questions[currentQuestionIndex].question;
  const options = questions[currentQuestionIndex].options.join(", ");
  const utterance = new SpeechSynthesisUtterance(`${question} The possible answers are: ${options}`);
  utterance.lang = language;
  speechSynthesis.speak(utterance);
}

function recognizeSpeech() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = language;
  recognition.start();

  recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    checkAnswer(speechResult);
  }

  recognition.onerror = function(event) {
    document.getElementById('result').textContent = 'Error recognizing speech. Please try again.';
  }
}

function checkAnswer(speechResult) {
  const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();
  if (speechResult.includes(correctAnswer.toLowerCase())) {
    document.getElementById('result').textContent = 'Correct!';
    score++;
    speakResult('Correct!');
  } else {
    document.getElementById('result').textContent = 'Wrong!';
    speakResult('Wrong!');
  }

  setTimeout(nextQuestion, 2000); // Wait for 2 seconds before moving to the next question
}

function speakResult(resultText) {
  const utterance = new SpeechSynthesisUtterance(resultText);
  utterance.lang = language;
  speechSynthesis.speak(utterance);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
  } else {
    displayQuestion();
  }
}

function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  document.getElementById('question').textContent = currentQuestion.question;
  const optionsList = document.getElementById('options');
  optionsList.innerHTML = '';
  currentQuestion.options.forEach(option => {
    const li = document.createElement('li');
    li.textContent = option;
    optionsList.appendChild(li);
  });
  document.getElementById('result').textContent = '';
}

function endQuiz() {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('endScreen').style.display = 'block';
  document.getElementById('finalScore').textContent = `Your Score: ${score}/10`;
}

function retryQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById('endScreen').style.display = 'none';
  document.getElementById('question-container').style.display = 'block';
  displayQuestion();
}

displayQuestion();
