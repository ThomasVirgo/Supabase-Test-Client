import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"
import InitGame from "../../utils/initGame";
import GameState from "../../utils/game";
import Card from "../../utils/card";
import { PlayingCard } from "../../components";
import './style.css'

const Game = () => {
    const [gameState, setGameState] = useState()


    useEffect(()=>{
        const players = [
            {
                id: 1,
                username: 'jeff',
            },
            {
                id: 2,
                username: 'bean',
            },
            {
                id: 3,
                username: 'turdo',
            },
            {
                id: 4,
                username: 'gipo',
            },
        ]
        let new_game = new InitGame(players, players[0])
        new_game = new GameState(new_game, players[0])
        console.log(new_game);
        setGameState(new_game)
    }, [])
    

    let cards = []
    let suits = ["spade", "diamond", "club", "heart"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    if (gameState){
        for (let i=0; i<suits.length; i++){
            for (let j=0; j<values.length; j++){
                let newCard = new Card(values[j], suits[i])
                console.log(gameState.findCardPosition(newCard));
                cards.push(<motion.div layout transition={{ duration: 2 }} className={gameState.findCardPosition(newCard)}><PlayingCard value={values[j]} suit={suits[i]} faceUp={true}/></motion.div>)
            }
        }
    }

    return (
        <>
        <motion.div className='game_container'>
            
            {cards}
            
        </motion.div>
        </>
    )
}

export default Game;
