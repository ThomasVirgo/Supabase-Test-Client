import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion"
import { useSelector } from "react-redux";
import { SupaBaseContext } from "../../context/supabase_client";
import GameState from "../../utils/game";
import Card from "../../utils/card";
import { PlayingCard, PlayerPopUp, RoundChart, OverallLeaderboard, RoundLeaderboard } from "../../components";
import './style.css'

const Game = () => {
    const [gameState, setGameState] = useState()
    const roomName = useSelector(state => state.room_name)
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()

//     const mySubscription = supabase
//   .from('countries:id=eq.200')
//   .on('UPDATE', handleRecordUpdated)
//   .subscribe()

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
            const sub_str = 'games:room_name=eq.'+roomName
            console.log(sub_str);
            const mySubscription = supabase
                .from(sub_str)
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

    function callGandalf(){
        let newState = new GameState(gameState, user)
        newState.callGandalf()
        setGameState(newState)
        updateDatabaseState(newState)
    }
    
    async function playCardToPack(move_status){
        let split = move_status.split(' ')
        let deckOrPack = split[split.length-1]
        let isFromDeck = deckOrPack === 'deck';
        let newState = new GameState(gameState, user)
        newState.playCardToPack(isFromDeck)
        if (newState.move_status === 'start'){
            updateDatabaseState(newState)
        }
        setGameState(newState)
    }

    async function selectSwap(){
        let newState = new GameState(gameState, user)
        newState.move_status = 'selecting card'
        newState.message = 'Pick a card from your hand'
        setGameState(newState)
    }

    function playMultiple(howMany){
        let newState = new GameState(gameState, user)
        newState.move_status = `selecting multiple ${howMany}`
        newState.message = 'Select the cards you want to play'
        console.log('clicked play multiple', newState);
        setGameState(newState)
    }

    function startNewRound(){
        let newState = new GameState(gameState, user)
        newState.startNewRound()
        setGameState(newState)
        updateDatabaseState(newState)
    }

    function showStats(){
        let newState = new GameState(gameState, user)
        newState.showStats = true;
        setGameState(newState)
    }

    function cardClicked(card){
        console.log(card);
        if (gameState.move_status === 'selecting card'){
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
        if (gameState.move_status === 'looking at someone elses card'){
            let newState = new GameState(gameState, user)
            let playerIdx, cardIdx;
            newState.players.forEach((player, pIdx) => {
                if (player.id === user.id){
                    return //so they cant look at own card
                }
                let idx = player.cards.findIndex(c => c.id === card.id)
                if (idx > -1){
                    player.cards[idx].faceUp = true;
                    newState.move_status = ''
                    playerIdx = pIdx
                    cardIdx = idx
                    setGameState(newState)
                }
            })
            setTimeout(()=>{
                let newState = new GameState(gameState, user)
                newState.players[playerIdx].cards[cardIdx].faceUp = false;
                newState.finishTurn()  
                updateDatabaseState(newState)
                setGameState(newState)             
            }, 5000)
        }
        if (gameState.move_status==='looking at own card'){
            let newState = new GameState(gameState, user)
            let playerIdx = newState.players.findIndex(p => p.id === user.id)
            let cardIdx = newState.players[playerIdx].cards.findIndex(c => c.id === card.id)
            if (cardIdx > -1){
                newState.players[playerIdx].cards[cardIdx].faceUp=true;
                newState.move_status = ''
                setGameState(newState)
            }
            setTimeout(()=>{
                let newState = new GameState(gameState, user)
                newState.players[playerIdx].cards[cardIdx].faceUp = false;
                newState.finishTurn()  
                updateDatabaseState(newState)
                setGameState(newState)          
            }, 5000)
        }
        if (gameState.move_status === 'swapping cards, jack played'){
            let newState = new GameState(gameState, user);
            newState.selectSwapCard(card)
            updateDatabaseState(newState)
            setGameState(newState)
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
                cards.push(<motion.div key={`${i}${j}`} onClick={()=>cardClicked(newCard)} layout transition={{ duration: 1.5 }} className={className}><PlayingCard value={values[j]} suit={suits[i]} faceUp={isFaceUp} packPos={packPos}/></motion.div>) 
            }
        }
        playerInfo = gameState.getMyPlayerInfo()
        isReady = playerInfo.isReady
    }

    let playerPopUps = gameState?.players.map((player, idx) => <div key={idx} className={gameState.findProfileClass(player)}>
        <PlayerPopUp player={player}></PlayerPopUp>
        </div>)

    return (
        <>
        <div className='game_global_message_container'>
            <h5>{gameState?.globalMessage}</h5>
        </div>
        {gameState?.showStats ? 
            <div className='round_over_container'>
                <div className='game_chart_container'>
                    <RoundChart gameState={gameState}/>
                    <div className='leaderboards_container'>
                        <OverallLeaderboard gameState={gameState}/>
                        <RoundLeaderboard gameState={gameState}/>
                    </div>
                    {gameState.checkMyTurn() && !gameState.gameOver && <button onClick={startNewRound}>Start New Round</button>}
                    {gameState.gameOver && <button>Collect Points</button>}
                </div>
            </div> :
        <motion.div className='game_container'>
            {cards}
            {playerPopUps}    
        </motion.div>
        }
        <div className='game_buttons_container'>
            {!gameState?.roundOver && <div>
                {!gameState?.gameStarted && gameState?.checkMyTurn() && <button onClick={dealCards}>Deal Cards</button>}
                {gameState?.gameStarted && !isReady && <button onClick={readyUp}>Ready</button>}

                {isReady && gameState?.checkMyTurn() && 
                    <div className = 'play_buttons_container'>
                        {gameState?.move_status == 'start' && gameState?.players.every(player => player.isReady) && 
                        <div>
                            <button onClick = {takeCardFromDeck}>Take Card From Deck</button>
                            <button onClick = {takeCardFromPack}>Take Card From Pack</button>
                            {gameState.players.every(p => !p.calledGandalf) && <button onClick = {callGandalf}>Gandalf</button>}
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
            </div>}
            {gameState?.roundOver && <div>
                <button onClick = {showStats}>Show stats</button>
                </div>}
            <div className='info_container'>
                <p>{gameState?.message}</p>
                <p>Your game code is: <strong>{roomName}</strong></p>
            </div>
        </div>
        </>
    )
}

export default Game;
