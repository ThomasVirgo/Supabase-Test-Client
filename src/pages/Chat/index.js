import React, { useState, useEffect, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { NavLink, Routes, Route } from 'react-router-dom'
import { MessagesContainer, RequestsContainer, AddFriendModal } from '../../layout'
import { StringInput } from '../../components'
import './style.css'

const Chat = () => {
    const supabase = useContext(SupaBaseContext)
    const [isModalActive, setIsModalActive] = useState(false)
    useEffect(()=>{
        async function fecthData(){
            const { data, error } = await supabase.from('profiles').select()
            console.log('error', error);
            console.log(data);
        }
        fecthData()
    }, [supabase])
    const [type, setType] = useState('messages')

    function toggleType(input){
        setType(input)
    }

    function toggleModal(){
        let newActive = !isModalActive
        setIsModalActive(newActive)
    }

    return (
        <div className='chat_main_container'>
            <div className='chat_left_container'>

                <div className='chat_buttons_container'>
                    <NavLink to='messages' onClick={() => toggleType('messages')}>Messages</NavLink>
                    <NavLink to='requests' onClick={() => toggleType('requests')}>Requests</NavLink>
                </div>

                <button onClick = {toggleModal}>Add Friend</button>

                <StringInput type='text' placeholder='search...'/>

                <div className='chat_list_container'>
                    <NavLink to={`${type}/tom`}>Tom</NavLink>
                    <NavLink to={`${type}/gaz`}>gaz</NavLink>
                </div>

                {isModalActive && <AddFriendModal />}

            </div> 
            <div className='chat_right_container'>
                <Routes>
                    <Route path="messages/*" element={<MessagesContainer/>} />
                    <Route path="requests/*" element={<RequestsContainer/>} />
                </Routes>
            </div> 
        </div>
    )
}

export default Chat;