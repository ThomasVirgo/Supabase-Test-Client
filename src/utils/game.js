class GameState{
    constructor(game_state, user){
        this.players = game_state.players
        this.deck = game_state.deck
        this.pack = game_state.pack
        this.is_slap = game_state.is_slap
        this.move_status = 'start'
        this.user = user
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
            return ['card19', true, false]
        }
        let order = this.getPlayerOrder()
        let idxOneToFour = order[0].cards.findIndex(item => item.id === card.id )
        if (idxOneToFour != -1){
            let isFaceUp = order[0].cards[idxOneToFour].faceUp
            return [`card${idxOneToFour+1}`, isFaceUp, false]
        }
        // if theres only two players then immediately need to go to cards 9 to 12
        if (this.players.length == 2){
            let idxNineToTwelve = order[1].cards.findIndex(item => item.id === card.id )
            if (idxNineToTwelve != -1){
                let isFaceUp = order[1].cards[idxNineToTwelve].faceUp
                return [`card${idxNineToTwelve+9}`, isFaceUp, false]
            }
        }
        // otherwise can just go around the group
        for (let i=0; i<order.length; i++){
            let player = order[i]
            let cardIdx = player.cards.findIndex(item => item.id === card.id)
            if (cardIdx != -1){
                let isFaceUp = player.cards[cardIdx].faceUp
                return [`card${(i*4)+cardIdx+1}`, isFaceUp, false]
            }
        }

        //otherwise the card must be either in the deck or the pack
        for (let i=0; i<this.pack.length; i++){
            if (this.pack[i].id === card.id){
                let isFaceUp = this.pack[i].faceUp
                let inPackButNotTop = true;
                if (i === this.pack.length - 1){
                    inPackButNotTop = false
                }
                return ['card18', isFaceUp, inPackButNotTop]
            }
        }

        for (let i=0; i<this.deck.length; i++){
            if (this.deck[i].id === card.id){
                let isFaceUp = this.deck[i].faceUp
                return ['card17', isFaceUp, false]
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


    takeCardFromDeckIntoHand(chosenCard){
        return
    }

    takeCardFromDeckPlaceOnPack(chosenCard){
        // need to look out for action cards
        return
    }

    takeCardFromPack(chosenCard){
        return
    }

    swapWithOtherPlayer(clientCard, theirCard){
        return
    }

    playMultiple(cards){
        return
    }


}

export default GameState