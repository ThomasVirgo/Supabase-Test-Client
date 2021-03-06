class Player{
    constructor(id, username, cards, score_history, score, isReady, calledGandalf){
        this.id = id
        this.username = username
        this.cards = cards
        this.score_history = score_history
        this.score = score
        this.inHandScore = this.calcCurrentScore()
        this.isReady = isReady
        this.calledGandalf = calledGandalf
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

    updateScores(){
        this.score_history.push(this.calcCurrentScore())
    }

    addScore(lowestScore){
        // need to check if they called gandalf correctly or not
        let score = this.calcCurrentScore()
        if (this.calledGandalf && score == lowestScore){
            this.score += 0
            return
        } 
        if (this.calledGandalf && score > lowestScore){
            this.score += score + 10
            return
        }
        this.score += this.calcCurrentScore()
    }
}

export default Player