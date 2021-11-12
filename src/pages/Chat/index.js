import React, { useState, useEffect, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { NavLink, Routes, Route, Link } from 'react-router-dom'
import { MessagesContainer, RequestsContainer, AddFriendModal } from '../../layout'
import { useSelector, useDispatch } from 'react-redux'
import { initFriendRequests, initSentRequests } from '../../actions'
import './style.css'

const Chat = () => {
    const supabase = useContext(SupaBaseContext)
    const [isModalActive, setIsModalActive] = useState(false)
    const [activeLink, setActiveLink] = useState('')
    const [type, setType] = useState('messages')
    const user = supabase.auth.user()
    const requests = useSelector(state => state.friend_requests)
    const dispatch = useDispatch()

    useEffect(()=>{
        async function fetchData1(){
            let { data, error } = await supabase.from('friend requests').select('*').match({to_user_id: user.id})
            console.log('error', error);
            if (data){
                dispatch(initFriendRequests(data))
            }
        }
        async function fetchData2(){
            const { data, error } = await supabase.from('friend requests').select('*').match({from_user_id: user.id})
            console.log('error', error);
            if (data){
                dispatch(initSentRequests(data))
            }
        }
        fetchData1()
        fetchData2()
    }, [supabase, user.id, dispatch])

    function toggleType(input){
        setType(input)
    }

    function toggleModal(){
        let newActive = !isModalActive
        setIsModalActive(newActive)
    }

    const requestLinks = requests.map((request, idx) =><div onClick = {() => setActiveLink(request.from_user_id)} className='chat_left_link_card' key={idx}><Link className={activeLink === request.from_user_id ? 'request_link_active' : ''} to={`requests/${request.from_user_name}/${request.id}`}>{request.from_user_name}</Link></div>)

    return (
        <div className='chat_main_container'>
            <div className='chat_left_container'>

                <div className='chat_buttons_container'>
                    <NavLink to='messages' onClick={() => toggleType('messages')}>Messages</NavLink>
                    <NavLink to='requests' onClick={() => toggleType('requests')}>Requests</NavLink>
                </div>

                <button onClick = {toggleModal}>Add Friend</button>

                <div className='chat_list_container'>
                    {type === 'requests' ? requestLinks : <a href='/messagessss'>Message Links</a>}
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