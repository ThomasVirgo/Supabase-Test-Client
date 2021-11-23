import React, { useState, useContext } from "react";
import { SupaBaseContext } from "../../context/supabase_client";
import InitGame from "../../utils/initGame";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { changeRoomName } from "../../actions";
import Player from "../../utils/player";

const Play = () => {
    const [inputs, setInputs] = useState({
        'create': '',
        'join': ''
    })
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function makeid(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    function  handleChange(event){
        setInputs(prev => {
            return {
                ...prev, 
                [event.target.name]: event.target.value}
         })
    }

    async function handleCreate(event){
        event.preventDefault()
        let players = [
            {
                id: user.id,
                username: user.user_metadata.username
            }
        ]
        let newGame = new InitGame(players)
        let roomName = makeid(6)
        const { data, error } = await supabase
            .from('games')
            .insert([
                { room_name: roomName, game_state: newGame }
            ])
        console.log(error?.message);
        dispatch(changeRoomName(roomName))
        navigate('/game')
    }


    async function handleJoin(event){
        event.preventDefault()
        const { data, error } = await supabase
                .from('games')
                .select('game_state')
                .match({room_name: inputs.join})
        console.log(data[0].game_state);
        if (!error){
            let game_state = data[0].game_state
            // need to check here that there is not already four players in the match, also set a loading state to true
            // need to put the room_name into global redux store so that can access it from game page
            game_state.players.push(new Player(user.id, user.user_metadata.username, [], [], 0))
            let response = await supabase
                    .from('games')
                    .update({ game_state: game_state })
                    .match({ room_name: inputs.join })
            if (!response.error){
                // try and change to something that persists in the database so user can reload game page and still works
                dispatch(changeRoomName(inputs.join))
                navigate('/game') 
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleCreate}>
                <p>Create a game, generate a game code by clicking button below</p>
                {/* <input type='text' name='create' onChange={handleChange} value={inputs.create} placeholder='room name'></input> */}
                <input type='submit' value='Create Game'></input>
            </form>
            <form onSubmit={handleJoin}>
                <p>Join a game, enter the room name below</p>
                <input type='text' name='join' onChange={handleChange} value={inputs.join} placeholder='room name'></input>
                <input type='submit' value='Join Game'></input>
            </form>
        </div>
    )
}

export default Play;