class GameState{
    constructor(game_state, user){
        this.players = game_state.players
        this.deck = game_state.deck
        this.pack = game_state.pack
        this.turn = game_state.turn
        this.is_slap = game_state.is_slap
        this.move_status = 'start'
        this.user = user
        this.turn_count = game_state.turn_count
    }

    checkMyTurn(){
        if (this.turn === this.user.id){
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
        for (let i=0; i<this.players.length; i++){
            let index = idx + i
            let val = arr[(index % n + n) % n];
            order.push(val)
        }
        return order
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