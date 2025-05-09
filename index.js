const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const playAgainBtn = document.getElementById("play-again");
const timerDisplay = document.getElementById("timer");
const winMessage = document.getElementById("win-message");
const finalTimeDisplay = document.getElementById("final-time");

const imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let cards = [...imageNumbers, ...imageNumbers];
shuffle(cards);

let flippedCards = [];
let lockBoard = false;
let score = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;

for (let i = 0; i < cards.length; i++) {
  const num = cards[i];

  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.image = num;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">
        <img src="${num}.jpg" alt="Image ${num}" style="width:100%; height:100%; border-radius:8px;">
      </div>
    </div>
  `;

  card.addEventListener("click", () => flipCard(card));
  board.appendChild(card);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  score++;
  scoreDisplay.textContent = score;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.image === card2.dataset.image;

  if (!isMatch) {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      reset();
    }, 300);
  } else {
    reset();
  }

  // Check for win condition
  const allCards = document.querySelectorAll(".card");
  const matched = Array.from(allCards).every(card => card.classList.contains("flipped"));
  if (matched) {
    stopTimer();
    showWinMessage();
  }
}

function reset() {
  flippedCards = [];
  lockBoard = false;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function showWinMessage() {
  finalTimeDisplay.textContent = timer;
  document.getElementById("scoreDisplay").textContent = score;
  winMessage.classList.remove("hidden");
}

// Create board from scratch
function createBoard() {
  board.innerHTML = "";
  cards = [...imageNumbers, ...imageNumbers];
  shuffle(cards);
  for (let i = 0; i < cards.length; i++) {
    const num = cards[i];

    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = num;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="images/${num}.jpg" alt="Image ${num}" style="width:100%; height:100%; border-radius:8px;">
        </div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  }
}

// Play again button listener
playAgainBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = score;
  flippedCards = [];
  lockBoard = false;
  timer = 0;
  timerDisplay.textContent = `Time: 0s`;
  gameStarted = false;
  winMessage.classList.add("hidden");
  createBoard();
});
