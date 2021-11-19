const exampleGameState = {
    players: [{}, {}, {}, {}],
    deck: [],
    pack: [],
    turn: '13413fdwf4545',
    isSlap: false,
}

class Game{
    constructor(game_state, user){
        this.players = game_state.players
        this.deck = game_state.deck
        this.pack = game_state.pack
        this.turn = game_state.turn
        this.is_slap = game_state.is_slap
        this.user = user
    }

    checkMyTurn(){
        if (this.turn === this.user.id){
            return true
        }
        return false
    }

    getTopCardFromDeck() {
        return this.deck.shift()
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

    addScores(){
        addScoreForPlayer(player){
            let cards = player.cards

        }
        this.players.forEach(player => addScoreForPlayer(player))
    }


}

export default Game