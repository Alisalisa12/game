let levelCount = 1;
let scoreCount = 0;
let bonusCount = 1;
let time = 60;
let timerInterval;

let correctAnswerCount = 0;
let totalAttempts = 0;

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const countdownScreen = document.getElementById("countdownScreen");
const countdown = document.getElementById("countdown");
const gameContainer = document.getElementById("gameContainer");
const level = document.getElementById("level");
const score = document.getElementById("score");
const bonus = document.getElementById("bonus");
const number = document.getElementById("number");
const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const resultScreen = document.getElementById("resultScreen");
const tutorialScreen = document.getElementById("tutorialScreen");

function startCountdown() {
  let count = 3;
  countdown.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdown.textContent = count;
    } else {
      clearInterval(interval);
      countdownScreen.style.display = "none";
      gameContainer.style.display = "block";
      startTimer();
      generateLevel();
      updateInfo();
    }
  }, 1000);
}

function startTimer() {
  timerDisplay.textContent = formatTime(time);
  timerInterval = setInterval(() => {
    time--;
    timerDisplay.textContent = formatTime(time);

    if (time <= 0) {
      clearInterval(timerInterval);
      setTimeout(showResults, 300);
    }
  }, 1000);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' + s : s}`;
}

const colors = ["#6a5acd", "#32cd32", "#1e90ff", "#ff8c00", "#ff6347", "#00ced1", "#ff1493", "#20b2aa"];

function getButtonCount(levelCount) {
  if (levelCount <= 3) return 6;
  if (levelCount <= 5) return 12;
  if (levelCount <= 7) return 16;
  return 20;
}

function generateUniqueNumbers(count, levelCount) {
  const numbers = new Set();

  function getNumber() {
    if (levelCount === 1) return Math.floor(Math.random() * 10) + 1;
    if (levelCount === 2) return Math.floor(Math.random() * 90) + 10;
    if (levelCount >= 3 && levelCount <= 7) return Math.floor(Math.random() * 900) + 100;
    return Math.floor(Math.random() * 9000) + 1000;
  }

  while (numbers.size < count) {
    numbers.add(getNumber());
  }

  return Array.from(numbers);
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function getFontSize(num) {
  const length = num.toString().length;
  if (length < 3) return "40px";
  if (length == 3) return "32px";
  return "24px";
}

function getButtonSize(buttonCount) {
  if (buttonCount <= 6) return "120px";
  if (buttonCount <= 9) return "100px";
  if (buttonCount <= 12) return "80px";
  if (buttonCount <= 16) return "80px";
  if (buttonCount <= 20) return "60px";
  return "60px";
}

function applyAnimation(button, type) {
  button.classList.add(type);
  button.addEventListener("animationend", () => {
    button.classList.remove(type);
  }, { once: true });
}

function updateInfo() {
  level.textContent = `${levelCount}`;
  score.textContent = `${scoreCount}`;

  const bonusElement = document.getElementById("bonus");
  bonusElement.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot", i < bonusCount ? "filled" : "empty");
    bonusElement.appendChild(dot);
  }

  const count = document.createElement("span");
  count.classList.add("bonus-count");
  count.textContent = `X${bonusCount}`;
  bonusElement.appendChild(count);
}

function showFeedback(type) {
  const img = document.createElement("img");

  if (type === "correct") {
    img.src = "img/true.png";
  } else {
    img.src = "img/false.png";
  }

  feedback.innerHTML = "";
  feedback.appendChild(img);
  feedback.classList.add("show");

  setTimeout(() => {
    feedback.classList.remove("show");
    feedback.innerHTML = "";
  }, 800);
}

function showResults() {
  gameContainer.style.display = "none";
  resultScreen.style.display = "flex";

  document.getElementById("finalScore").textContent = scoreCount;
  document.getElementById("correctAnswers").textContent = correctAnswerCount;
  document.getElementById("totalAttempts").textContent = totalAttempts;

  const accuracy = totalAttempts > 0
    ? Math.round((correctAnswerCount / totalAttempts) * 100)
    : 0;

  document.getElementById("accuracy").textContent = `${accuracy}%`;
}

function generateLevel() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gameContainer.style.backgroundColor = randomColor;
  grid.innerHTML = "";

  const count = getButtonCount(levelCount);
  const numbers = generateUniqueNumbers(count, levelCount);
  const buttonSize = getButtonSize(count);
  const correctIndex = Math.floor(Math.random() * count);
  const correctNumber = numbers[correctIndex];
  number.textContent = correctNumber;
  const columns = count <= 6 ? 3 : count <= 25 ? 4 : 5;
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  numbers.forEach((num) => {
    const btn = document.createElement("button");
    btn.textContent = num;
    btn.className = "game-container__number-btn";
    btn.style.backgroundColor = getRandomColor();
    btn.style.fontSize = getFontSize(num);
    btn.style.height = buttonSize;


    if (levelCount >= 3) {
      const effects = ["none", "blink", "shake"];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      if (randomEffect !== "none") {
        applyAnimation(btn, randomEffect);
      }
    }

    btn.addEventListener("click", () => {
      totalAttempts++;

      if (num === correctNumber) {
        correctAnswerCount++;
        showFeedback("correct");
        scoreCount += 10 * bonusCount;
        levelCount += 1;
        if (bonusCount < 5) bonusCount += 1;
        updateInfo();

        if (levelCount > 9) {
          clearInterval(timerInterval);
          setTimeout(showResults, 500);
        } else {
          grid.classList.add("slide-left");
          grid.addEventListener("animationend", () => {
            grid.classList.remove("slide-left");
            generateLevel();
          }, { once: true });
        }

      } else {
        showFeedback("wrong");
        bonusCount = 1;
        updateInfo();

        grid.classList.add("slide-left");
        grid.addEventListener("animationend", () => {
          grid.classList.remove("slide-left");
          generateLevel();
        }, { once: true });
      }
    });

    grid.appendChild(btn);
  });
}

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  tutorialScreen.style.display = "flex";
});


tutorialScreen.addEventListener("click", () => {
  tutorialScreen.style.display = "none";
  countdownScreen.style.display = "flex";
  startCountdown();
});

window.addEventListener("load", () => {
  gameContainer.style.display = "none";
  countdownScreen.style.display = "none";
  resultScreen.style.display = "none";
  tutorialScreen.style.display = "none";
});
