class GameState{
    constructor(game_state, user){
        this.players = game_state.players
        this.deck = game_state.deck
        this.pack = game_state.pack
        this.is_slap = game_state.is_slap
        this.move_status = game_state.move_status
        this.user = user
        this.multiCards = game_state.multiCards
        this.turn_count = game_state.turn_count
        this.belowDeck = game_state.belowDeck
    }

    checkMyTurn(){
        let n = this.players.length
        let playerTurn = this.players[(this.turn_count % n + n) % n];
        if (playerTurn.id === this.user.id){
            return true
        }
        return false
    }

    dealCards(){
        this.players.forEach(player => player.cards = this.deck.splice(0, 4))
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

    playCardToPack(){
        this.pack.push(this.belowDeck)
        let actionCards = '78910JQK'
        if (actionCards.includes(this.belowDeck.value)){
            console.log('Allow user to play action action');
        }
        // need to check here if its an action card
        this.belowDeck = null
        this.turn_count += 1
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
        this.belowDeck= null
        this.pack.push(cardToPack)
        this.turn_count += 1
        this.move_status = 'start'
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
            console.log('inside multi');
            let val = this.multiCards[0].value
            let allSame = this.multiCards.every(c => c.value === val)
            if (allSame){
                console.log('inside allsame');
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
                this.multiCards = []
                this.move_status='start'
                this.turn_count+=1
            }
        }
    }
}

export default GameState