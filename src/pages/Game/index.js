import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion"
import { useSelector } from "react-redux";
import { SupaBaseContext } from "../../context/supabase_client";
import GameState from "../../utils/game";
import Card from "../../utils/card";
import { PlayingCard, PlayerPopUp } from "../../components";
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
                newState.message = `${newState.getUsernameOfPlayersTurn()}! It's your turn.`
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

    function dealCards(){
        let newState = new GameState(gameState, user)
        newState.dealCards()
        newState.gameStarted = true
        newState.message = 'Waiting for all players to be ready, remember the cards!'
        updateDatabaseState(newState)
    }

    async function updateDatabaseState(newState){
        let response = await supabase
                    .from('games')
                    .update({ game_state: newState })
                    .match({ room_name: roomName })
    }

    function takeCardFromDeck(){
        let newState = new GameState(gameState, user)
        newState.takeCardFromDeck()
        newState.move_status = 'taken card deck'
        setGameState(newState)
    }

    function takeCardFromPack(){
        let newState = new GameState(gameState, user)
        newState.takeCardFromPack()
        newState.move_status = 'taken card pack'
        setGameState(newState)
    }
    
    async function playCardToPack(move_status){
        let split = move_status.split(' ')
        let deckOrPack = split[split.length-1]
        let isFromDeck = deckOrPack === 'deck';
        let newState = new GameState(gameState, user)
        newState.playCardToPack(isFromDeck)
        newState.move_status = 'start'
        updateDatabaseState(newState)
    }

    async function selectSwap(){
        let newState = new GameState(gameState, user)
        newState.move_status = 'selecting card'
        setGameState(newState)
    }

    function playMultiple(howMany){
        let newState = new GameState(gameState, user)
        newState.move_status = `selecting multiple ${howMany}`
        console.log('clicked play multiple', newState);
        setGameState(newState)
    }

    function cardClicked(card){
        console.log(card);
        if (gameState.move_status == 'selecting card'){
            let newState = new GameState(gameState, user)
            newState.swapWithCardFromHand(card)
            updateDatabaseState(newState)
        }
        if (gameState.move_status.includes('selecting multiple')){
            let newState = new GameState(gameState, user)
            newState.addCardToMulti(card)
            if (newState.move_status === 'start'){
                updateDatabaseState(newState)
            }
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
                let [className, isFaceUp, packPos] = gameState.findCardPosition(newCard)
                if (gameState.message === 'Waiting for all players to be ready, remember the cards!' && (className==='card1' || className==='card2')){
                    isFaceUp = true;
                }
                cards.push(<motion.div onClick={()=>cardClicked(newCard)} layout transition={{ duration: 1.5 }} className={className}><PlayingCard value={values[j]} suit={suits[i]} faceUp={isFaceUp} packPos={packPos}/></motion.div>) 
            }
        }
        playerInfo = gameState.getMyPlayerInfo()
        isReady = playerInfo.isReady
    }

    let playerPopUps = gameState?.players.map(player => <div className={gameState.findProfileClass(player)}>
        <PlayerPopUp player={player}></PlayerPopUp>
        </div>)


    return (
        <>
        <motion.div className='game_container'>
            
            {cards}
            {playerPopUps}
            
        </motion.div>
        <div className='game_buttons_container'>
            <div>
                {!gameState?.gameStarted && gameState?.checkMyTurn() && <button onClick={dealCards}>Deal Cards</button>}
                {gameState?.gameStarted && !isReady && <button onClick={readyUp}>Ready</button>}

                {isReady && gameState?.checkMyTurn() && 
                    <div className = 'play_buttons_container'>
                        {gameState?.move_status == 'start' && gameState?.players.every(player => player.isReady) && 
                        <div>
                            <button onClick = {takeCardFromDeck}>Take Card From Deck</button>
                            <button onClick = {takeCardFromPack}>Take Card From Pack</button>
                        </div>
                        }
                        {gameState?.move_status.includes('taken card') && 
                        <div>
                        <button onClick = {selectSwap} >Swap with card from my hand</button>
                        <button onClick = {()=>playCardToPack(gameState?.move_status)}>Play card to pack</button>
                        <button onClick = {() => playMultiple('2')} >Play double</button>
                        <button onClick = {() => playMultiple('3')} >Play triple</button>
                        <button onClick = {() => playMultiple('4')} >Play quad</button>
                        </div>
                        }
                    </div>
                }
            </div>
            <div className='info_container'>
                <p>{gameState?.message}</p>
                <p>Your game code is: <strong>{roomName}</strong></p>
            </div>
        </div>
        </>
    )
}

export default Game;
