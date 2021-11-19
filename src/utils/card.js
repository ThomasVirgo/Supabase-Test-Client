class Card{
    constructor(value, suit){
        this.value = value
        this.suit = suit
        this.faceUp = false
    }

    turn(){
        this.faceUp = !this.faceUp
    }

}

export default Card