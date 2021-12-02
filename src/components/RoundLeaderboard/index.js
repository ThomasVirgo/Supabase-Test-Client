import React from "react";
import './style.css'

const RoundLeaderboard = ({gameState}) => {
    let players = [...gameState.players]
    players.sort((a,b) => a.score_history[a.score_history.length-1]-b.score_history[b.score_history.length-1])
    const divs = gameState.players.map( (p, idx) => 
            <div key={idx} className='board_container'>
                <span>{p.username}</span>
                <span>{p.score_history[p.score_history.length-1]}</span>
            </div>
        )
    return (
        <div className='round_leaderboard_container'>
            <p className='round_leaderboard_title'>Round Scores</p>
            {divs}
        </div>
    )
}

export default RoundLeaderboard;