import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion"
import { useSelector } from "react-redux";
import { SupaBaseContext } from "../../context/supabase_client";
import InitGame from "../../utils/initGame";
import GameState from "../../utils/game";
import Card from "../../utils/card";
import { PlayingCard } from "../../components";
import './style.css'

const Game = () => {
    const [gameState, setGameState] = useState()
    const roomName = useSelector(state => state.room_name)
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()

    useEffect(()=>{
        async function fetchGameAndSubscribe(){
            const { data, error } = await supabase
                .from('games')
                .select('game_state')
                .match({'room_name': roomName})
            console.log('getting game state...');
            if (data.length == 0){ return }
            let game_state = data[0]?.game_state
            let new_game_state = new GameState(game_state, user)
            setGameState(new_game_state)
            const mySubscription = supabase
                .from('games')
                .on('UPDATE', payload => {
                    console.log('Change received!', payload.new)
                })
                .subscribe()
            console.log('created new subscription');
            return mySubscription
        }
        let mySubscription = fetchGameAndSubscribe()

        return () => supabase.removeSubscription(mySubscription)
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
