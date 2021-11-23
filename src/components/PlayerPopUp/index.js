import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import './style.css'

const PlayerPopUp = ({player}) => {
    const [active, setActive] = useState(false)

    function toggleModal(){
        setActive(prev => !prev)
    }

    return (
        <>
        {active ? 
        <div className='playerInfo'>
            <div className='popup_top'>
                <span>{player.username}</span><span className='popup_close' onClick={toggleModal}>X</span>
            </div>
                <p>score: {player.score}</p>
        </div> 
        :
        <MdAccountCircle onClick={toggleModal} className='player_popup_icon'></MdAccountCircle>
        }
        </>

    )
}

export default PlayerPopUp