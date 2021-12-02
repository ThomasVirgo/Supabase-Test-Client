import React from "react";
import './style.css'

const OverallLeaderboard = ({gameState}) => {
    let players = [...gameState.players]
    players.sort((a,b) => a.score-b.score)
    const divs = gameState.players.map( (p, idx) => 
            <div key={idx} className='overall_board_container'>
                <span>{p.username}</span>
                <span>{p.score}</span>
            </div>
        )
    return (
        <div className='overall_leaderboard_container'>
            <p className='overall_leaderboard_title'>Overall Leaderboard</p>
            {divs}
        </div>
    )
}

export default OverallLeaderboard;