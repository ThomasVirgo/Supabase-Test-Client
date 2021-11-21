class Player{
    constructor(id, username, cards, score_history, score){
        this.id = id
        this.username = username
        this.cards = cards
        this.score_history = score_history
        this.score = score
        this.inHandScore = this.calcCurrentScore()
    }

    calcCurrentScore(){
        let pictureCards = 'JQK'
        let score = 0
        this.cards.forEach(card => {
            if (pictureCards.includes(card.value)){
                score += 10
            } else if(card.value === 'A'){
                score += 1
            }
            else {
                score += Number(card.value)
            }
        })
        return score
    }

    updateScore(){
        this.score += this.calcCurrentScore()
        this.score_history.push(this.score)
    }
}

export default Player