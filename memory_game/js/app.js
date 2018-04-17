const deck = $('.deck');
const cards = [];
const restart = $('.restart');
let listOfOpenCards = [];
let countMatchPairCards = 0;
let countMove = 0;
const moves = $('.moves');
let rating = '0 Stars';
const timer = $('.timer');
let seconds = -1;
let minutes = -1;
let timerOn = false;
let timerTimeOut;
const MOVES_TEXT = ' Moves';
const TIME_TEXT = 'Time ';
let gameTime = TIME_TEXT + '00:00';
const mainGameView = $('.container');
const afterWinningInfo = $(`<div class="win-info">
   <h1>Congratulations! You won the game.</h1>
   <p></p>
   <div class="new-game"><button type= "submit" class="button">Play again?</button></div>
   </div>`);

preparationGame();

// wrapping first game setup
function preparationGame() {
  restartGame();
  initializeDeck();
  shuffle(cards);
  addEachCardToHtml();
  restart.on('click', restartGame);
  deck.on('click', 'li', handleClick);
}

// get the cards elements into an array
function initializeDeck() {
  for (i = 1; i <= 16; i++) {
    cards.push($('.deck li:nth-child(' + i + ')'));
  }
}

// replace the order of cards in DOM with order in the array of cards
function addEachCardToHtml() {
  for (i = 0; i < cards.length; i++)
    cards[i].appendTo(deck);
}

// shuffle and display cards
// set initial values to prevent errors
function restartGame() {
  shuffle(cards);
  addEachCardToHtml();
  listOfOpenCards = [];
  countMatchPairCards = 0;

  // flip cards face down
  $('.deck .card').removeClass('open show match');
  countMove = 0;
  moves.text(countMove + MOVES_TEXT);

  //show hidden stars
  $('.stars li:nth-child(1)').show();
  $('.stars li:nth-child(2)').show();

  // stop timer
  timerOn = false;
  gameTime = TIME_TEXT + '00:00';
  seconds = -1;
  minutes = -1;
  timer.text(gameTime);
  clearTimeout(timerTimeOut);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function handleClick() {
  //First click starts timer
  if (timerOn === false) {
    timerOn = true;
    timedCount();
  }

  // prevent counting moves when clicking on the same element
  if ($(this).hasClass('open show') || $(this).hasClass('match')) {
    return;
  } else {
    moveCounter();
    $(this).addClass('open show');
    listOfOpenCards.push($(this));
    comparison($(this));
  }
}

// update and display move count, update star rating
function moveCounter() {
  countMove += 1;
  moves.text(countMove + MOVES_TEXT);
  starRating();
}

// update star rating and display it, set the winning text
function starRating() {
  if (countMove <= 24) {
    rating = '3 Stars and the title "Badass flipper!"';
  } else if (countMove > 24 && countMove <= 32) {
    $('.stars li:nth-child(1)').hide();
    rating = '2 Stars and the title "Solid spotter!"';
  } else if (countMove > 32) {
    $('.stars li:nth-child(2)').hide();
    rating = '1 Star and the title "Junior clicker!"';
  }
}

//count time and call itself after one second
//Time count fuction from here https://stackoverflow.com/questions/6623516/jquery-time-counter
function timedCount() {
  seconds += 1;
  if (seconds % 60 == 0) {
    minutes += 1;
    seconds = 0;
  }
  timerTimeOut = setTimeout(timedCount, 1000);
  gameTime = TIME_TEXT + formatTimer(minutes, seconds);
  timer.text(gameTime);
}

// format time to 00:00
function formatTimer(min, sec) {
  let result = '';
  if (min >= 10) {
    result += min;
  } else {
    result = '0' + min;
  }

  result += ':';

  if (sec >= 10) {
    result += sec;
  } else {
    result = result + '0' + sec;
  }
  return result;
}

//contains matching logic and game winning condition
function comparison() {
  if (listOfOpenCards.length > 1) {
    //get elemet's second class
    let className1 = listOfOpenCards[0].children().attr('class').split(' ')[1];
    let className2 = listOfOpenCards[1].children().attr('class').split(' ')[1];

    if (className1 === className2) {
      listOfOpenCards[0].removeClass('open show').addClass('match');
      listOfOpenCards[1].removeClass('open show').addClass('match');
      listOfOpenCards = [];
      countMatchPairCards = countMatchPairCards + 1;

      if (countMatchPairCards === 8) {
        afterWinning();
      }

    } else {
      // prevent uncovering other cards when non matched cards are showing
      deck.off('click', 'li', handleClick);
      setTimeout(wrongMatch, 1000);
    }
  }
}

// flip the cards face down on wrong match
function wrongMatch() {
  //prevent error when restart is clicked shortly after wrong match
  if (listOfOpenCards.length > 1) {
    listOfOpenCards[0].removeClass('open show');
    listOfOpenCards[1].removeClass('open show');
  }
  listOfOpenCards = [];
  deck.on('click', 'li', handleClick);
}

//show win info
function afterWinning() {
  mainGameView.remove();
  afterWinningInfo.appendTo('body');
  $('p').text('With ' + countMove + MOVES_TEXT + ' and ' + rating + ' ' + gameTime);
  $('button').on('click', continueGame);
}

//start another game after winning
function continueGame() {
  mainGameView.appendTo('body');
  afterWinningInfo.remove();
  restartGame();
  //assign events one more time, because removing elements from DOM clears the assignments
  deck.on('click', 'li', handleClick);
  restart.on('click', restartGame);
}
