import React, { useState } from "react";
import { motion } from "framer-motion"
import './style.css'

const Game = () => {

    const [player1Cards, setPlayer1Cards] = useState(['As', '2h', '7c', 'Kc'])
    const [player2Cards, setPlayer2Cards] = useState(['Jd', '8d', '5s', '3c'])
    const [deck, setDeck] = useState(['3s', '4s', '6s', '7s', '8s', '9s', '10s', 'Js', 'Qs', 'Ks', 'Ah', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', 'Jh', 'Qh', 'Kh', 'Ad', '2d', '3d', '4d', '5d', '6d', '7d', '9d', '10d', 'Qd', 'Kd', 'Ac', '2c', '4c', '5c', '6c', '8c', '9c', '10c', 'Jc', 'Qc'])
    const [pack, setPack] = useState(['2s'])


    function swapCards(){
        if (player1Cards[1] === '2h'){
            setPlayer1Cards(['As', '5s', '7c', 'Kc'])
            setPlayer2Cards(['Jd', '8d', '2h', '3c'])

        } else {
            setPlayer1Cards(['As', '2h', '7c', 'Kc'])
            setPlayer2Cards(['Jd', '8d', '5s', '3c'])
        }

    }

    // have 52 cards always rendered in same order and then choose their className based on the game state
    // create a function called findClass

    function findClass(card){
        let idx1 = player1Cards.findIndex(el => el === card)
        if (idx1 != -1){
            return `game_card card${idx1+1}`
        }
        let idx2 = player2Cards.findIndex(el => el === card)
        if (idx2 != -1){
            return `game_card card${idx2+9}`
        }
        let idx3 = deck.findIndex(el => el === card)
        if (idx3 != -1){
            return 'game_card card17'
        }
        let idx4 = pack.findIndex(el => el === card)
        if (idx4 != -1){
            return 'game_card card18'
        }
    }

    let cards = []
    let suits = ["s", "d", "c", "h"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    

    for (let i=0; i<suits.length; i++){
        for (let j=0; j<values.length; j++){
            let cardNum = values[j] + suits[i]
            cards.push(<motion.div layout transition={{ duration: 2 }} className={findClass(cardNum)}>{cardNum}</motion.div>)
        }
    }


    return (
        <>
        <motion.div className='game_container'>
            
            {cards}
            
        </motion.div>
        <button onClick={swapCards}>Swap Cards</button>
        </>
    )
}

export default Game;
