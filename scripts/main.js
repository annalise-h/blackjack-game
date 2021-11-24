let deck
let dealerPoints = 0
let playerPoints = 0
let dealerHand = []
let playerHand = []
let dealerBusted = false
let playerBusted = false
let dealerBlackjack = false
let playerBlackjack = false

const dealBtn = document.querySelector('#deal-button')
const hitBtn = document.querySelector('#hit-button')
const standBtn = document.querySelector('#stand-button')
const dealerHandElement = document.querySelector('#dealer-hand')
const playerHandElement = document.querySelector('#player-hand')
const dealerScoreText = document.querySelector('#dealer-points')
const playerScoreText = document.querySelector('#player-points')
const messageText = document.querySelector('#messages')

/*
<----- add event listeners here ------>
*/

dealBtn.addEventListener('click', handleDealClick)
hitBtn.addEventListener('click', handleHitClick)
standBtn.addEventListener('click', handleStandClick)
window.addEventListener('DOMContentLoaded', buildDeck)

/* 
<----- event callback functions here ------> 
*/

function handleDealClick () {
  resetGame()

  for (let i = 0; i < 2; i++) {
    dealDealerCard()
    dealPlayerCard()
  }
}

function handleHitClick() {
  dealPlayerCard()
}

function handleStandClick() {
  while (dealerPoints < 17) {
    // maybe add a check here to see if dealer gets 21 with an ace
    dealDealerCard()
  }

  // we want to consider the ace value in the final score
  const dealerFinalScore = calculateFinalScore('dealer')
  const playerFinalScore = calculateFinalScore('player')
  const result = getGameResults(dealerFinalScore, playerFinalScore)
  populatePoints((dealerScoreText, dealerFinalScore))
  populatePoints((playerScoreText, playerFinalScore))
  printGameResults(result)
  // TODO: Add in function to reset the game
}

/* 
<----- gameplay functions ----->
*/ 

function dealDealerCard() {
  // remove card from deck and add it to dealer hand
  const card = getRandomCard() 
  dealerHand.push(card)
  renderCards(dealerHand, 'dealer')
  dealerPoints = calculatePoints(dealerHand)
  populatePoints(dealerScoreText, dealerPoints)
}

function dealPlayerCard() {
  // remove card from deck and add it to player hand
  const card = getRandomCard()
  console.log(card)
  playerHand.push(card)
  renderCards(playerHand, 'player')
  playerPoints = calculatePoints(playerHand)
  populatePoints(playerScoreText, playerPoints)
}

// TODO: Change this to nested for loops to populate the array
function buildDeck() {
  deck = [
    { rank: 1, suit: 'hearts'},
    { rank: 1, suit: 'diamonds' },
    { rank: 1, suit: 'spades' },
    { rank: 1, suit: 'clubs' },
    { rank: 2, suit: 'hearts' },
    { rank: 2, suit: 'diamonds' },
    { rank: 2, suit: 'spades' },
    { rank: 2, suit: 'clubs' },
    { rank: 3, suit: 'hearts' },
    { rank: 3, suit: 'diamonds' },
    { rank: 3, suit: 'spades' },
    { rank: 3, suit: 'clubs' },
    { rank: 4, suit: 'hearts' },
    { rank: 4, suit: 'diamonds' },
    { rank: 4, suit: 'spades' },
    { rank: 4, suit: 'clubs' },
    { rank: 5, suit: 'hearts' },
    { rank: 5, suit: 'diamonds' },
    { rank: 5, suit: 'spades' },
    { rank: 5, suit: 'clubs' },
    { rank: 6, suit: 'hearts' },
    { rank: 6, suit: 'diamonds' },
    { rank: 6, suit: 'spades' },
    { rank: 6, suit: 'clubs' },
    { rank: 7, suit: 'hearts' },
    { rank: 7, suit: 'diamonds' },
    { rank: 7, suit: 'spades' },
    { rank: 7, suit: 'clubs' },
    { rank: 8, suit: 'hearts' },
    { rank: 8, suit: 'diamonds' },
    { rank: 8, suit: 'spades' },
    { rank: 8, suit: 'clubs' },
    { rank: 9, suit: 'hearts' },
    { rank: 9, suit: 'diamonds' },
    { rank: 9, suit: 'spades' },
    { rank: 9, suit: 'clubs' },
    { rank: 10, suit: 'hearts' },
    { rank: 10, suit: 'diamonds' },
    { rank: 10, suit: 'spades' },
    { rank: 10, suit: 'clubs' },
    { rank: 11, suit: 'hearts' },
    { rank: 11, suit: 'diamonds' },
    { rank: 11, suit: 'spades' },
    { rank: 11, suit: 'clubs' },
    { rank: 12, suit: 'hearts' },
    { rank: 12, suit: 'diamonds' },
    { rank: 12, suit: 'spades' },
    { rank: 12, suit: 'clubs' },
    { rank: 13, suit: 'hearts' },
    { rank: 13, suit: 'diamonds' },
    { rank: 13, suit: 'spades' },
    { rank: 13, suit: 'clubs' },
  ]
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function renderCards(hand, playerType) {
  // first remove populated images
  const handImages = document.querySelectorAll(`#${playerType}-hand img`)
  handImages.forEach((img => img.remove()))
  
  // get corresponding hand element based on player type 
  let handElement
  playerType == 'dealer' ? handElement = dealerHandElement : handElement = playerHandElement

  // for each card object in the player/dealer hand, add the card image to the hand element
  hand.forEach(card => {
    const cardString = getCardImageString(card)
    const cardImg = document.createElement('img')
    cardImg.setAttribute('src', `images/${cardString}`)
    handElement.appendChild(cardImg)
  })
}

function getRandomCard() {
  /* 
  gets a random card in the deck by choosing a random index, removing a card
  at that index, and splicing it from the deck array
  returns an arr containing the random card
  */

  const randIndex = getRandomInt(deck.length)
  cardArr = deck.splice(randIndex, 1) 
  card = cardArr[0]
  return card
}

function getCardImageString(card) {
  let cardValue = card.rank
  const cardSuit = card.suit

  switch (cardValue) {
    case 1:
      cardValue = "ace"
      break
    case 11:
      cardValue = "jack"
      break
    case 12:
      cardValue = "queen"
      break
    case 13:
      cardValue = "king"
      break
  }

  let imgString = `${cardValue}_of_${cardSuit}.png`
  return imgString
}

function calculatePoints (handArr) {
  // get all rank values and save to an array
  const values = handArr.map(card => {
    if (card.rank > 10) {
      card.rank = 10
    }
    return card.rank
  })

  // sum all rank values and save to a variable
  const sum = sumOfNumsArray(values)
  return sum
}

function populatePoints(element, points) {
  element.innerText = points
}

function sumOfNumsArray(arr) {
  return arr.reduce((prev, current) => prev + current)
}

function calculateFinalScore(playerType) {
  let hand
  playerType == 'dealer' ? hand = dealerHand : hand = playerHand

  const values = hand.map(card => card.rank)

  const sum = sumOfNumsArray(values)
  if (sum == 21) return sum

  if (values.includes(1)) {
    const originalSum = sum
    const valuesWithAce = [...values]
    const index = valuesWithAce.indexOf(1)
    valuesWithAce[index] = 10
    if (sumOfNumsArray(valuesWithAce) > 21) {
      return originalSum
    } else { 
      let newSum = sumOfNumsArray(valuesWithAce)
      return newSum
    }
  }

  return sum
}

function getGameResults(dealerScore, playerScore) {
  console.log(dealerScore, playerScore)
  if (dealerScore > 21) dealerBusted = true
  if (playerScore > 21) playerBusted = true
  if (dealerScore == 21) dealerBlackjack = true
  if (playerScore == 21) playerBlackjack = true

  // first check for a tie - both players did not bust, and have equal scores
  // then check if either had blackjack, return winner
  // then check who had the higher score but did not bust, return winner
  // then check if both players busted, return double loss
  // then check if one busted or not, the other automatically wins

  if (dealerScore == playerScore && !playerBusted && !dealerBusted) {
    return 'tie'
  } else if (dealerBlackjack) {
      return 'dealer wins'
  } else if (playerBlackjack) {
      return 'player wins'
  } else if (playerScore > dealerScore && !playerBusted) {
      return 'player wins'
  } else if (dealerScore > playerScore && !dealerBusted) {
      return 'dealer wins'
  } else if (playerBusted && dealerBusted) {
      return 'both lost'
  } else if (playerBusted) {
      return 'dealer wins'
  } else if (dealerBusted) {
      return 'player wins'
  }
}

function printGameResults(result) {
  switch (result) {
    case 'tie': 
      messageText.innerText = "It's a tie!"
    break
    case 'dealer wins':
      messageText.innerText = "Dealer Wins! :("
    break
    case 'player wins':
      messageText.innerText = "You win!! :)"
    break
    case 'both lost':
      messageText.innerText = "You both lost :/"
    break
  }
}

// TO DO: Tie reset game to clicking Deal button

function resetGame() {
  buildDeck()
  dealerPoints = 0
  playerPoints = 0
  dealerHand = []
  playerHand = []
  dealerBusted = false
  playerBusted = false
  dealerBlackjack = false
  playerBlackjack = false
  renderCards(playerHand, 'player')
  renderCards(dealerHand, 'dealer')
}

// REFACTOR:
// Include a player class with playerType, hand, busted, score properties
// Add a render function to populate dealer + player hand divs based on hand array