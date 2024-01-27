// select the timer container
const startContainer = document.querySelector(".start-container"),
  playerName = document.querySelector(".start-container input"),
  lvl = document.querySelector("#levels"),
  levels = {
    easy: { timeInSec: 120, tries: 15 },
    normal: { timeInSec: 60, tries: 10 },
    hard: { timeInSec: 30, tries: 5 },
  },
  startBtn = document.querySelector(".start-container button"),
  timer = document.querySelector(".timer"),
  // select the cards container
  cardsContainer = document.querySelector(".cards-container"),
  // select the player span
  player = document.querySelector(".player"),
  // put cards in array
  cards = [...cardsContainer.children],
  // put indexes in an array
  orderRangeArr = [...cards.keys()],
  // set the small duration
  duration = 600,
  // slect the wrong tries span
  tries = document.querySelector(".tries"),
  // select win div
  winDiv = document.querySelector(".win"),
  winBtn = document.querySelector(".win button"),
  // select game over div
  gameOverDiv = document.querySelector(".game-over"),
  gameOverBtn = document.querySelector(".game-over button"),
  successSound = document.getElementById("success"),
  failSound = document.getElementById("fail");

// define the timer interval
let playTimer;

playerName.focus();
document.addEventListener("keydown", checkEnter);

// start the game, get player name and flip all cards for small duration
startBtn.addEventListener("click", () => {
  document.removeEventListener("keydown", checkEnter);
  // get the player name amd check the entered name
  player.textContent =
    playerName.value == null ||
    playerName.value == "" ||
    /\s+/.test(playerName.value)
      ? "Unknown"
      : playerName.value.toUpperCase();
  // remove start container
  startContainer.remove();
  // flip all cards for small duration
  cards.forEach((card) => {
    card.classList.add("flipped");
  });
  cardsContainer.classList.add("no-click");
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.remove("flipped");
    });
    cardsContainer.classList.remove("no-click");
  }, duration);
  // start timer
  let time = levels[lvl.value].timeInSec,
    minutes,
    seconds;
  playTimer = setInterval(() => {
    if (minutes == 0 && seconds == 0) {
      winOrLose("lose");
    } else {
      timer.textContent = "";
      minutes = Math.floor(time / 60);
      seconds = Math.floor(time % 60);
      if (minutes == 0) {
        timer.classList.add("danger");
      }
      time--;
      const secText = seconds >= 10 ? seconds : `0${seconds}`,
        timerText = document.createTextNode(`0${minutes}:${secText}`);
      timer.appendChild(timerText);
    }
  }, 1000);
});
// shuffling the indexes
shuffle(orderRangeArr);

// add the new order to the cards and eventlistner fn
cards.forEach((card, index) => {
  // add the new order to the cards
  card.style.order = orderRangeArr[index];
  // add event listner
  card.addEventListener("click", function () {
    // flip card
    flipCard(card);
  });
});

// functions
function checkEnter(e) {
  if (e.key == "Enter") {
    startBtn.click();
  }
}
// shuffling fn
function shuffle(arr) {
  // set variables
  let current = arr.length,
    random;
  // shuffling
  while (current > 0) {
    // get random index
    random = Math.floor(Math.random() * current);
    // decrease the index
    current--;
    // swap current and random
    [arr[current], arr[random]] = [arr[random], arr[current]];
  }
  // return the result arr
  return arr;
}
// flip card fn
function flipCard(clickedCard) {
  clickedCard.classList.add("flipped");
  // collect flipped cards
  let flippedCards = cards.filter((card) => card.classList.contains("flipped"));
  // check if there are 2 flipped cards
  if (flippedCards.length === 2) {
    // stop clicking
    stopClicking();
    // check matching
    checkMatching(flippedCards[0], flippedCards[1]);
    // check winning
    let matchedCards = cards.filter((card) =>
      card.classList.contains("matched")
    );
    if (matchedCards.length == cards.length) {
      winOrLose("win");
    }
  }
}
// stop clicking fn
function stopClicking() {
  cardsContainer.classList.add("no-click");
  setTimeout(() => {
    cardsContainer.classList.remove("no-click");
  }, duration);
}
// check matching fn
function checkMatching(card1, card2) {
  if (card1.dataset.tech === card2.dataset.tech) {
    // remove flipped class from 2 cards
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    // add matched class from 2 cards
    card1.classList.add("matched");
    card2.classList.add("matched");
    // play success sound
    successSound.play();
  } else {
    tries.textContent++;
    tries.textContent == levels[lvl.value].tries
      ? winOrLose("lose")
      : setTimeout(() => {
          // remove flipped class from 2 cards
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
        }, duration);

    // play fail sound
    failSound.play();
  }
}
function winOrLose(status) {
  clearInterval(playTimer);
  switch (status) {
    case "win":
      winDiv.style.zIndex = 2;
      winDiv.style.opacity = 1;
      document.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          winBtn.click();
        }
      });
      winBtn.addEventListener("click", function () {
        location.reload();
      });
      break;
    case "lose":
      gameOverDiv.style.zIndex = 2;
      gameOverDiv.style.opacity = 1;
      document.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          gameOverBtn.click();
        }
      });
      gameOverBtn.addEventListener("click", function () {
        location.reload();
      });
  }
}
