class GameState{
    constructor(game_state, user){
        this.players = game_state.players
        this.deck = game_state.deck
        this.pack = game_state.pack
        this.is_slap = game_state.is_slap
        this.move_status = 'start'
        this.user = user
        this.turn_count = game_state.turn_count
    }

    checkMyTurn(){
        let n = this.players.length
        let playerTurn = this.players[(this.turn_count % n + n) % n];
        if (playerTurn.id === this.user.id){
            return true
        }
        return false
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
        let order = this.getPlayerOrder()
        let idxOneToFour = order[0].cards.findIndex(item => item.id === card.id )
        if (idxOneToFour != -1){
            return `card${idxOneToFour+1}`
        }
        // if theres only two players then immediately need to go to cards 9 to 12
        if (this.players.length == 2){
            let idxNineToTwelve = order[1].cards.findIndex(item => item.id === card.id )
            if (idxNineToTwelve != -1){
                return `card${idxNineToTwelve+9}`
            }
        }
        // otherwise can just go around the group
        for (let i=0; i<order.length; i++){
            let player = order[i]
            let cardIdx = player.cards.findIndex(item => item.id === card.id)
            if (cardIdx != -1){
                return `card${(i*4)+cardIdx+1}`
            }
        }

        //otherwise the card must be either in the deck or the pack
        for (let i=0; i<this.pack.length; i++){
            if (this.pack[i].id === card.id){
                return 'card18'
            }
        }

        for (let i=0; i<this.deck.length; i++){
            if (this.deck[i].id === card.id){
                return 'card17'
            }
        }
        
    }

    // moves
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