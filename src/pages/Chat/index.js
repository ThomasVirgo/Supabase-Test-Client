import React, { useEffect, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { NavLink, Routes, Route } from 'react-router-dom'
import './style.css'

const Chat = () => {
    const supabase = useContext(SupaBaseContext)
    useEffect(()=>{
        async function fecthData(){
            const { data, error } = await supabase.from('profiles').select()
            console.log('error', error);
            console.log(data);
        }
        fecthData()
    }, [supabase])
    return (
        <div className='chat_main_container'>
            <div className='chat_left_container'>

                <div className='chat_buttons_container'>
                    <NavLink to='messages'>Messages</NavLink>
                    <NavLink to='requests'>Requests</NavLink>
                </div>

                <input type='text' placeholder='search...'></input>

                <div className='chat_list_container'>
                    <div className='chat_friend_card'>Name</div>
                    <div className='chat_friend_card'>Name</div>
                    <div className='chat_friend_card'>Name</div>
                </div>

                <button>Add Friend</button>
            
            </div> 
            <div className='chat_right_container'>
                <Routes>
                    <Route path="messages" element={<h1>Messages</h1>} />
                    <Route path="requests" element={<h1>Requests</h1>} />
                </Routes>
            </div> 
        </div>
    )
}

export default Chat;