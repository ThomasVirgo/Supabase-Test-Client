import Player from "./player"
import Card from "./card"

const globalMessages = {
    preGame: 'Waiting for all players to be ready, remember the cards!',


}

const instructionMessages = {

}

class GameState{
    constructor(game_state, user){
        this.players = game_state.players.map(player => new Player(player.id, player.username, player.cards, player.score_history, player.score, player.isReady, player.calledGandalf))
        this.deck = game_state.deck
        this.pack = game_state.pack
        this.is_slap = game_state.is_slap
        this.move_status = game_state.move_status
        this.user = user
        this.globalMessage = game_state.globalMessage
        this.message = game_state.message
        this.gameStarted = game_state.gameStarted
        this.multiCards = game_state.multiCards
        this.mySwapCard = game_state.mySwapCard 
        this.opponentSwapCard = game_state.opponentSwapCard
        this.turn_count = game_state.turn_count
        this.belowDeck = game_state.belowDeck
        this.round = game_state.round
        this.roundOver = game_state.roundOver
        this.showStats = game_state.showStats
        this.gameOver = game_state.gameOver
    }

    checkMyTurn(){
        let n = this.players.length
        let playerTurn = this.players[(this.turn_count % n + n) % n];
        if (playerTurn.id === this.user.id){
            return true
        }
        return false
    }

    finishTurn(){
        this.multiCards = []
        this.move_status='start'
        let playerIdx = this.getTurnPlayerIdx()
        this.players[playerIdx].updateScores()
        this.belowDeck = null
        this.mySwapCard = null
        this.opponentSwapCard = null
        this.turn_count+=1
        // check if the next player has called gandalf and if so end the round
        let nextPlayer = this.players[this.getTurnPlayerIdx()]
        if (nextPlayer.calledGandalf){
            setTimeout(this.endRound(), 300)
            // this.endRound()
            return
        }
        this.message = `${this.getUsernameOfPlayersTurn()}! It's your turn.`
        this.globalMessage = `${this.getUsernameOfPlayersTurn()}! It's your turn.`
    }

    endRound(){
        this.message = 'Round over!'
        this.equaliseScores()
        let lowestScore = Infinity
        this.players.forEach(p => {
            let hisLength = p.score_history.length
            if (p.score_history[hisLength-1] < lowestScore){
                lowestScore = p.score_history[hisLength-1]
            }
        })
        this.players.forEach(p => p.addScore(lowestScore))
        this.players.forEach(p => {
            p.cards.forEach(c => c.faceUp = true)
        })
        this.roundOver = true;
        if (this.round == 3){
            this.gameOver = true
        }
    }

    startNewRound(){
        this.players = this.players.map(p => new Player(p.id, p.username, [], [], p.score, false, false))
        this.deck = this.createDeck()
        this.pack = []
        this.is_slap = false
        this.move_status = "start"
        this.globalMessage = ''
        this.message = 'Waiting for all players to be ready, remember the cards!'
        this.multiCards = []
        this.mySwapCard = null
        this.opponentSwapCard = null
        this.belowDeck = null
        this.round = this.round + 1
        this.roundOver = false
        this.showStats = false
        this.dealCards()
    }

    createDeck(){
        let suits = ["spade", "diamond", "club", "heart"];
        let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let cards = []
        suits.forEach(suit => values.forEach(value => cards.push(new Card(value, suit))))
        this.shuffleArray(cards)
        return cards
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getUsernameOfPlayersTurn(){
        let n = this.players.length
        let playerTurn = this.players[(this.turn_count % n + n) % n];
        return playerTurn.username
    }

    getTurnPlayerIdx(){
        let n = this.players.length
        let player =  this.players[(this.turn_count % n + n) % n];
        return this.players.findIndex(p => p.id === player.id)
    }

    dealCards(){
        this.players.forEach(player => {
            player.cards = this.deck.splice(0, 4)
            player.score_history.push(player.calcCurrentScore())
        })
        console.log('dealt cards');
    }

    getMyPlayerInfo(){
        return this.players.find(element => element.id === this.user.id)
    }

    getTopCardFromDeck() {
        let card = this.deck.shift()
        card.faceUp = true
        return card
    }

    getTopCardFromPack() {
        return this.pack.shift()
    }

    getPlayerOrder(){
        let idx = this.players.findIndex(player => player.id === this.user.id)
        let order = []
        let n = this.players.length
        for (let i=0; i<n; i++){
            let index = idx + i
            let val = this.players[(index % n + n) % n];
            order.push(val)
        }
        return order
    }

    callGandalf(){
        let myPlayer = this.getMyPlayerInfo()
        myPlayer.calledGandalf = true
        this.finishTurn()
    }

    equaliseScores(){
        console.log('equalising scores...');
        let maxLength = 0
        this.players.forEach(p => {
            if (p.score_history.length > maxLength){
                maxLength = p.score_history.length
            }
        })
        this.players.forEach(p=>{
            let hisLength = p.score_history.length
            if (hisLength < maxLength){
                let padding = maxLength - hisLength
                let pad = p.score_history[hisLength-1]
                for (let i=0; i<padding; i++){
                    p.score_history.push(pad)
                }
            }
        })
    }

    findProfileClass(player){
        if (player.id === this.user.id){
            return 'profile1'
        }
        if (player.id != this.user.id && this.players.length === 2){
            return 'profile3'
        }

        let playerIdx = this.getPlayerOrder().findIndex(p => p.id === player.id)
        return `profile${playerIdx+1}`

    }

    findCardPosition(card){
        // return the class name for that card position
        if (this?.belowDeck?.id === card.id){
            return ['card19', true, -1]
        }
        let order = this.getPlayerOrder()
        let idxOneToFour = order[0].cards.findIndex(item => item.id === card.id )
        if (idxOneToFour != -1){
            let isFaceUp = order[0].cards[idxOneToFour].faceUp
            return [`card${idxOneToFour+1}`, isFaceUp, -1]
        }
        // if theres only two players then immediately need to go to cards 9 to 12
        if (this.players.length == 2){
            let idxNineToTwelve = order[1].cards.findIndex(item => item.id === card.id )
            if (idxNineToTwelve != -1){
                let isFaceUp = order[1].cards[idxNineToTwelve].faceUp
                return [`card${idxNineToTwelve+9}`, isFaceUp, -1]
            }
        }
        // otherwise can just go around the group
        for (let i=0; i<order.length; i++){
            let player = order[i]
            let cardIdx = player.cards.findIndex(item => item.id === card.id)
            if (cardIdx != -1){
                let isFaceUp = player.cards[cardIdx].faceUp
                return [`card${(i*4)+cardIdx+1}`, isFaceUp, -1]
            }
        }

        //otherwise the card must be either in the deck or the pack
        for (let i=0; i<this.pack.length; i++){
            if (this.pack[i].id === card.id){
                let isFaceUp = this.pack[i].faceUp
                return ['card18', isFaceUp, i]
            }
        }

        for (let i=0; i<this.deck.length; i++){
            if (this.deck[i].id === card.id){
                let isFaceUp = this.deck[i].faceUp
                return ['card17', isFaceUp, -1]
            }
        }
        
    }

    // moves
    takeCardFromDeck(){
        this.belowDeck = this.deck.pop()
        this.belowDeck.faceUp = true
    }

    playCardToPack(isFromDeck){
        this.pack.push(this.belowDeck)
        let actionCards = '78910JQ'
        let cardVal = this.belowDeck.value
        if (actionCards.includes(cardVal) && isFromDeck){
            this.handleActionCard(cardVal)
            return
        }
        this.finishTurn()
    }

    handleActionCard(cardVal){
        if (cardVal === '7' || cardVal === '8'){
            this.message = 'pick one of your cards to look at'
            this.move_status = 'looking at own card'
        }
        if (cardVal === '9' || cardVal === '10'){
            this.message = 'pick someone elses card to look at'
            this.move_status = 'looking at someone elses card'
        }
        if (cardVal === 'J'){
            this.message = 'pick one of your cards and one of someone elses to swap'
            this.move_status = 'swapping cards, jack played'
        }
        if (cardVal === 'Q'){
            this.turn_count+=1 //will then increment it again when turn is finished
            this.finishTurn()
        }
    }

    selectSwapCard(card){
        // check if it is one of my cards or opponents
        this.players.forEach((p, pIdx) => {
            p.cards.forEach((c, cIdx) => {
                if (c.id === card.id && p.id === this.user.id){
                    this.mySwapCard = [pIdx, cIdx, c]
                }
                if (c.id === card.id && p.id != this.user.id){
                    this.opponentSwapCard = [pIdx, cIdx, c]
                }
            })
        })

        if (this.mySwapCard && this.opponentSwapCard){
            let [myPlayerIdx, myCardIdx, myCard] = this.mySwapCard
            let [oppPlayerIdx, oppCardIdx, oppCard] = this.opponentSwapCard
            this.players[myPlayerIdx].cards[myCardIdx] = oppCard
            this.players[oppPlayerIdx].cards[oppCardIdx] = myCard
            this.finishTurn()
        }
    }


    takeCardFromPack(){
        this.belowDeck = this.pack.pop()
        this.belowDeck.faceUp = true
    }

    swapWithCardFromHand(chosenCard){
        let myPlayer = this.getMyPlayerInfo()
        let myCards = myPlayer.cards
        let idx = myCards.findIndex(card => card.id === chosenCard.id)
        let cardToPack = myCards[idx]
        cardToPack.faceUp = true
        myCards[idx] = this.belowDeck
        myCards[idx].faceUp = false
        this.belowDeck = null
        this.pack.push(cardToPack)
        this.finishTurn()
    }

    addCardToMulti(card){
        let idx = this.multiCards.findIndex(i => i.id === card.id)
        let splitStr = this.move_status.split(' ')
        let targetNum  = Number(splitStr[splitStr.length - 1])
        console.log(targetNum);

        if (idx == -1 && this.multiCards.length < targetNum){
            this.multiCards.push(card)
        }

        if (this.multiCards.length == targetNum){
            // check they're all of same value, 
            let val = this.multiCards[0].value
            let allSame = this.multiCards.every(c => c.value === val)
            if (!allSame){
                // add 10 points to the players score and return the belowdeck card to the pack
                let myPlayer = this.getMyPlayerInfo()
                myPlayer.score += 10
                this.pack.push(this.belowDeck)
                this.finishTurn()
            }
            if (allSame){
                let myNewCards = [...this.getMyPlayerInfo().cards]
                this.multiCards.forEach(c => {
                    let cIdx = myNewCards.findIndex(i => i.id === c.id)
                    // push the cards to the pack and remove them from hand
                    let cardToPack = myNewCards.splice(cIdx, 1)[0]
                    cardToPack.faceUp = true;
                    this.pack.push(cardToPack) //splice returns an array
                })
                this.belowDeck.faceUp = false
                myNewCards.push(this.belowDeck)
                this.belowDeck = null
                let playerIdx = this.players.findIndex(player => player.id === this.user.id)
                this.players[playerIdx].cards = myNewCards
                this.finishTurn()
            }
        }
    }
}

export default GameState