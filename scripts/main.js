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

function buildDeck() {
  deck = []
  suits = ["hearts", "diamonds", "spades", "clubs"]
  
  for (i = 1; i < 14; i++) {
    for (j = 0; j < 4; j++) {
      let cardObj = { rank: i, suit: suits[j]}

      deck.push(cardObj)
    }
  }
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

// TODO: Add option to calculate best score (consider aces) whenever a card is dealt
// ex if dealer has a card with 21 including an ace, we should not give the dealer more cards

// REFACTOR:
// Include a player class with playerType, hand, busted, score properties