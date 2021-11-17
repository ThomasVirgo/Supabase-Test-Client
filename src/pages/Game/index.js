import React, { useState } from "react";
import { motion } from "framer-motion"
import './style.css'

const Game = () => {

    const [gameState, setGameState] = useState(['div1', 'div2'])

    function toggleState(){
        console.log('toggling...');
        let newState = [gameState[1], gameState[0]]
        setGameState(newState)
    }

    const cards = gameState.map(card => <div key={card}><motion.div id={card} layout transition={{ duration: 1 }} className='game_card' /></div>)

    return (
        <>
        <div className='game_container'>
            {cards}
        </div>
        <button onClick={toggleState}>Toggle</button>
        </>
    )
}

export default Game;
