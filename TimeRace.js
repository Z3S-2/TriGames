document.addEventListener("DOMContentLoaded", function () {
  let score = 0;
  let level = 1;
  let timer = 20;
  let speed = 2.5;
  let gameInterval = null;
  let timerInterval = null;
  let direction = 1;
  let totalClicks = 0;
  let startTime = 0;

  const indicator = document.querySelector(".indicator");
  const targetZone = document.querySelector(".target-zone");
  const game = document.querySelector(".game");
  const startBtn = document.querySelector(".start-btn");
  const scoreDisplay = document.getElementById("score");
  const levelDisplay = document.getElementById("level");
  const timerDisplay = document.getElementById("timer");
  const highestScoreDisplay = document.getElementById("highest-score");
  const clicksPerSecDisplay = document.getElementById("clicks-per-sec");

  let highestScore = localStorage.getItem("highestScore") || 0;
  highestScoreDisplay.textContent = highestScore;

  function resetGame() {
    score = 0;
    level = 1;
    timer = 20;
    speed = 2.5;
    totalClicks = 0;
    startTime = Date.now();
    updateDisplay();
  }

  function updateDisplay() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    timerDisplay.textContent = timer;
    clicksPerSecDisplay.textContent = ((totalClicks / ((Date.now() - startTime) / 1000)) || 0).toFixed(2);
  }

  function moveIndicator() {
    const gameWidth = game.offsetWidth;
    const indicatorWidth = indicator.offsetWidth;
    let left = parseFloat(getComputedStyle(indicator).left) || 0;

    if (left + indicatorWidth >= gameWidth || left <= 0) {
      direction *= -1;
    }

    left += direction * speed;
    indicator.style.left = `${left}px`;
  }

  function checkHit() {
    totalClicks++;
    const indicatorRect = indicator.getBoundingClientRect();
    const targetRect = targetZone.getBoundingClientRect();

    const hit = (
      indicatorRect.left + indicatorRect.width / 2 >= targetRect.left &&
      indicatorRect.left + indicatorRect.width / 2 <= targetRect.right
    );

    if (hit) {
      score++;
      level++;
      speed += 0.3;
      indicator.style.backgroundColor = "#10b981"; // vert
    } else {
      indicator.style.backgroundColor = "#ef4444"; // rouge
    }

    setTimeout(() => {
      indicator.style.backgroundColor = "#3b82f6";
    }, 150);

    updateDisplay();

    if (score > highestScore) {
      highestScore = score;
      localStorage.setItem("highestScore", highestScore);
      highestScoreDisplay.textContent = highestScore;
    }
  }

  function startGame() {
    resetGame();
    startBtn.style.display = "none";

    gameInterval = setInterval(() => {
      moveIndicator();
    }, 16); // ~60 FPS

    timerInterval = setInterval(() => {
      timer--;
      updateDisplay();
      if (timer <= 0) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        startBtn.style.display = "block";
        alert(`Temps écoulé ! Votre score : ${score}`);
      }
    }, 1000);
  }

  startBtn.addEventListener("click", startGame);
  game.addEventListener("click", checkHit);
});
