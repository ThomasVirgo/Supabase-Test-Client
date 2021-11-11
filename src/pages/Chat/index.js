import React, { useState, useEffect, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { NavLink, Routes, Route } from 'react-router-dom'
import { MessagesContainer, RequestsContainer, AddFriendModal } from '../../layout'
import { StringInput } from '../../components'
import './style.css'

const Chat = () => {
    const supabase = useContext(SupaBaseContext)
    const [isModalActive, setIsModalActive] = useState(false)
    const [requests, setRequests] = useState([])
    const user = supabase.auth.user()
    useEffect(()=>{
        async function fetchData(){
            const { data, error } = await supabase.from('friend requests').select('*').match({to_user_id: user.id})
            console.log('error', error);
            console.log(data);
            if (data){
                setRequests(data)
            }
        }
        fetchData()
    }, [supabase, user.id])
    const [type, setType] = useState('messages')

    function toggleType(input){
        setType(input)
    }

    function toggleModal(){
        let newActive = !isModalActive
        setIsModalActive(newActive)
    }

    const requestLinks = requests.map((request, idx) => <div key={idx}> <NavLink to={`requests/${request.from_user_id}`}>{request.from_user_name}</NavLink> </div>)

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
                    {type === 'requests' ? requestLinks : <a href='#'>Message Links</a>}
                </div>

                {isModalActive && <AddFriendModal toggleModal={toggleModal}/>}

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