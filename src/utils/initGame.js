import Player from "./player"
import Card from "./card"

class InitGame{
    constructor(players){
        this.deck = this.createDeck()
        this.players = this.createPlayers(players)
        this.pack = []
        this.turn = this.players[0].id
        this.is_slap = false
        this.turn_count = 0
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

    createPlayers(players){
        // to begin with give players no cards, then once all players have joined deal the cards
        return players.map(player => new Player(player.id, player.username, [], [], 0))
    }

    selectCards(){
        return this.deck.splice(0, 4)
    }

}

export default InitGame