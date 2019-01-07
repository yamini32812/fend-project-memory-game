/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector('.deck');
const cardsList = document.querySelectorAll('.card');
const modalWindow = document.querySelector('.modal-container');
/*
 * Declaring all the global variables.
 */
let timeTaken = document.querySelector('.timer');
const numOfStars = document.querySelectorAll('.stars i');

let openCards = [];
let countPairs = 0;
let moves = 0;

let countStars = 0;

let gametime = 0;
let intervalID;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
/*
 * Function to create a random card on the deck. This function supplies an array
   to the shuffle function.
 */
 generateCard();

function generateCard() {
	//Array.from clones an existing array.
	let cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	let shuffledCards = shuffle(cardsToShuffle);
	for (card of shuffledCards){
		deck.appendChild(card)
	};
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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
//Function to set a timer for the game.
//Source:https://stackoverflow.com/questions/2604450/how-to-create-a-jquery-clock-timer
function setTimer() {
  		gametime++;
	//setInterval method sets a time interval after which the function is again called.
	//Here displayTimer() is called for every second.
	intervalID = setInterval(function displayTimer() {
		const minutes = Math.round(gametime / 60);
		const seconds = Math.round(gametime % 60);

    if (seconds < 10) {
         timeTaken.innerHTML = `${minutes}:0${seconds}`;
     } else {
         timeTaken.innerHTML = `${minutes}:${seconds}`;
     }
	}, 1000);

}
//Function flipCard is called when any of the cards on the deck are clicked.
for (let cards of cardsList) {
	cards.addEventListener('click', function flipCard(event) {
     const clickTarget = event.target;
  if (isClickValid(clickTarget)) {
		setTimer();
		//Opening the clicked cards.
			cards.classList.toggle('open');
			cards.classList.toggle('show');
			addOpenCards(clickTarget);
  }
	});
}
//Function to prevent clicking on opened cards.
function isClickValid(clickTarget) {
    return (
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        openCards.length < 2 &&
        !openCards.includes(clickTarget)
    );
}

//Function addOpenCards pushes the opened cards into an empty array and calls
//function matchCards to check for matching cards and the number of moves in
//which the guesses took place.
function addOpenCards(clickTarget) {
	openCards.push(clickTarget);
	if (openCards.length === 2) {
		matchCards();
		countMoves();
	}
}

//Function matchCards checks whether the opened cards are matching or not.
function matchCards() {
	const firstCard = openCards[0].childNodes[1].className;
	const secondCard = openCards[1].childNodes[1].className;
	//If a pair matches, the color of the cards change.
	if (firstCard === secondCard) {

		openCards[0].classList.toggle('match');
		openCards[1].classList.toggle('match');
		openCards = [];
		countPairs++;
		//If the number of pairs equals 8(because there are 16 cards), the game is won.
		if (countPairs === 8) {
			//The game timer is reset.
			clearInterval(intervalID);
      //A modal box opens to congratulate the winner.
      showModal();
		}

	} else {
		//If the cards don't match,hide them after showing them briefly(1sec) to the player.
		setTimeout(function unMatch() {
			openCards[0].classList.remove('open', 'show');
			openCards[1].classList.remove('open', 'show');
			openCards = [];
		}, 1000)
	}
}


//Function countMoves to show the number of guesses the player is making.
function countMoves() {

	const movesCounter = document.querySelector('.moves');
  moves++;
	movesCounter.innerHTML = moves;
	checkScore();
}

//Function checkScore to award the number of stars to the player based on the
//number of guesses he/she made.
function checkScore() {
	//If number of moves are less than 12, give the player 3 stars.

	if (moves < 12) {
		const threeStars = numOfStars;
		countStars = 3;
	}
	//If number of moves are between 12 and 16, give the player 2 stars.
	if (moves >= 12 && moves <= 16) {
		const twoStars = numOfStars;
		//Hide one star.
		numOfStars[2].style.display = 'none';
		countStars = 2;
	}
	//If number of moves are more than 16, give the player 1 star.
	if (moves > 16) {
		const oneStar = numOfStars;
		//Hide two stars.
		numOfStars[1].style.display = 'none';
		numOfStars[2].style.display = 'none';
		countStars = 1;
	}
	//Returns number of stars.
	return countStars;
}
//Source:
//https://stackoverflow.com/questions/45607982/how-to-disable-background-when-modal-window-pops-up
//Function showModal shows the modal box once the game is won.
function showModal() {
	const modalWindow = document.querySelector('.modal-container');
	const modalStats = document.querySelectorAll('.modal-stats p');
	const modalStars = checkScore();
	const modalTime = timeTaken.innerHTML;
	//Show the modal box and move it to the center.
	modalWindow.classList.toggle('hide');
	//Fill the modal stats.
	modalStats[0].innerHTML = `Stars: ${modalStars}`;
	modalStats[1].innerHTML = `Time taken: ${modalTime}`;
}
	//Action listeners for the button on the modal box.
	// -retry returns to the screen and resets the game.
	document.querySelector('.modal-retry').addEventListener('click', function(){
		resetGame();
    modalWindow.classList.toggle('hide');
	});


//Function resetGame resets the game back to the beginning.
function resetGame() {

	clearInterval(intervalID);
	gametime = 0;

	moves = 0;
	document.querySelector('.moves').innerHTML = 0;

	for (const star of numOfStars) {
		star.style.display = 'block';
	}
	for (cards of cardsList) {
		cards.classList.remove('match', 'open', 'show');
	}
	generateCard();
}
//restart symbol on the page resets the game.
document.querySelector('.restart').addEventListener('click', resetGame);
