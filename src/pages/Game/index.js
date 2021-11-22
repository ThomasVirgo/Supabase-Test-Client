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
                .from(`games:room_name=eq.${roomName}`)
                .on('UPDATE', payload => {
                    new_game_state = new GameState(payload.new.game_state, user)
                    console.log(new_game_state);
                    setGameState(new_game_state)
                })
                .subscribe()
            console.log('created new subscription');
            return mySubscription
        }
        let mySubscription = fetchGameAndSubscribe()

        return () => supabase.removeSubscription(mySubscription)
    }, [])

    async function readyUp(){
        let newState = {...gameState}
        let idx = gameState.players.findIndex(player => player.id === user.id)
        if (idx != -1){
            newState.players[idx].isReady = true
            let allPlayersReady = newState.players.every(player => player.isReady)
            if (allPlayersReady){
                newState = new GameState(gameState, user)
                newState.dealCards()
                newState.players[idx].isReady = true
            }
            let response = await supabase
                    .from('games')
                    .update({ game_state: newState })
                    .match({ room_name: roomName })
        } else {
            console.log('could not find player to update ready state');
        }
    }
    

    let cards = []
    let suits = ["spade", "diamond", "club", "heart"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    let playerInfo, isReady
    if (gameState){
        for (let i=0; i<suits.length; i++){
            for (let j=0; j<values.length; j++){
                let newCard = new Card(values[j], suits[i])
                let [className, isFaceUp] = gameState.findCardPosition(newCard)
                cards.push(<motion.div layout transition={{ duration: 2 }} className={className}><PlayingCard value={values[j]} suit={suits[i]} faceUp={isFaceUp}/></motion.div>)
            }
        }
        playerInfo = gameState.getMyPlayerInfo()
        isReady = playerInfo.isReady
    }


    return (
        <>
        <motion.div className='game_container'>
            
            {cards}
            
        </motion.div>
        <div className='game_buttons_container'>
            {!isReady && <button onClick={readyUp}>Ready</button>}
            {isReady && gameState.checkMyTurn() && <div className = 'play_buttons_container'>
                <button>Take Card From Deck</button>
                <button>Take Card From Pack</button>
            </div>}
        </div>
        </>
    )
}

export default Game;
