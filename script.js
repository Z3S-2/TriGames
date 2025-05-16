const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("game-over");
const startButton = document.getElementById("start-button");
const retryButton = document.getElementById("retry-button");

let playerX = window.innerWidth / 2 - 25; // Position initiale du joueur
let speed = 2;
let score = 0;
let isGameOver = false;
let isStarted = false;

function resetGame() {
  document.querySelectorAll(".obstacle").forEach(obs => obs.remove());
  playerX = window.innerWidth / 2 - 25; // Réinitialiser la position du joueur au centre
  player.style.left = `${playerX}px`; // Position initiale
  score = 0;
  speed = 2;
  scoreDisplay.textContent = "0";
  isGameOver = false;
  gameOverDisplay.style.display = "none";
  retryButton.style.display = "none";
}

function createObstacle() {
  const obs = document.createElement("div");
  obs.classList.add("obstacle");
  // Positionne les obstacles à des endroits aléatoires mais visibles
  obs.style.left = `${Math.random() * (window.innerWidth - 60)}px`; 
  obs.style.top = `-20px`;  // Place au-dessus de l'écran pour commencer à descendre
  game.appendChild(obs);
}


function checkCollision(rect1, rect2) {
  return !(
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}

function gameLoop() {
  if (!isStarted || isGameOver) return;

  score += 1;
  scoreDisplay.textContent = Math.floor(score / 10);

  document.querySelectorAll(".obstacle").forEach(obs => {
    const top = parseFloat(obs.style.top);
    obs.style.top = `${top + speed}px`;

    const obsRect = obs.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (checkCollision(playerRect, obsRect)) {
      isGameOver = true;
      gameOverDisplay.style.display = "block";
      retryButton.style.display = "block";
    }

    if (top > window.innerHeight) obs.remove();  // Si l'obstacle dépasse l'écran, on l'enlève
  });

  if (Math.random() < 0.03) createObstacle();  // Augmente la fréquence de création des obstacles
  speed = Math.min(speed + 0.01, 5);  // Augmente la vitesse au fil du temps

  requestAnimationFrame(gameLoop);
}

function movePlayer(direction) {
  if (!isStarted || isGameOver) return;

  // Calculer la nouvelle position du joueur
  if (direction === "left") {
    playerX -= 50; // Déplacer à gauche
  } else {
    playerX += 50; // Déplacer à droite
  }

  // Limiter les déplacements du joueur pour ne pas dépasser les bords de l'écran
  playerX = Math.max(0, Math.min(window.innerWidth - 50, playerX));

  // Appliquer la translation sur l'axe X
  player.style.left = `${playerX}px`;
}

// Contrôles clavier
window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") movePlayer("left");
  if (e.key === "ArrowRight") movePlayer("right");
});

// Contrôles tactiles
game.addEventListener("touchstart", e => {
  const x = e.touches[0].clientX;
  movePlayer(x < window.innerWidth / 2 ? "left" : "right");
});

// Démarrage du jeu
startButton.addEventListener("click", () => {
  // Cache l'écran d'accueil et affiche l'écran de jeu
  document.getElementById("intro-screen").style.display = "none";
  game.style.display = "block";
  resetGame();
  isStarted = true;
  gameLoop();
});

// Rejouer après une défaite
retryButton.addEventListener("click", () => {
  resetGame();
  isStarted = true;
  gameOverDisplay.style.display = "none";
  retryButton.style.display = "none";
  gameLoop();
});
