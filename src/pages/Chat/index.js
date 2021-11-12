import React, { useState, useEffect, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { NavLink, Routes, Route, Link } from 'react-router-dom'
import { MessagesContainer, RequestsContainer, AddFriendModal } from '../../layout'
import { useSelector, useDispatch } from 'react-redux'
import { initFriendRequests, initSentRequests, initFriends } from '../../actions'
import './style.css'

const Chat = () => {
    const supabase = useContext(SupaBaseContext)
    const [isModalActive, setIsModalActive] = useState(false)
    const [activeLink, setActiveLink] = useState('')
    const [type, setType] = useState('messages')
    const user = supabase.auth.user()
    const requests = useSelector(state => state.friend_requests)
    const friends = useSelector(state => state.friends)
    const dispatch = useDispatch()

    useEffect(()=>{
        async function fetchData1(){
            let { data, error } = await supabase.from('friend requests').select('*').match({to_user_id: user.id, responded: false})
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
        async function fetchData3(){
            const { data, error } = await supabase.from('friends').select('*').or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            console.log('error', error);
            let friends = data.map(entry => {
                let id = entry.user1_id === user.id ? entry.user2_id : entry.user1_id
                let username = entry.user1_id === user.id ? entry.user2_name : entry.user1_name
                return {
                    id, username
                }
                
            })
            if (data){
                dispatch(initFriends(friends))
            }
        }
        fetchData1()
        fetchData2()
        fetchData3()
    }, [supabase, user.id, dispatch])

    function toggleType(input){
        setType(input)
    }

    function toggleModal(){
        let newActive = !isModalActive
        setIsModalActive(newActive)
    }

    const requestLinks = requests.map((request, idx) =><div onClick = {() => setActiveLink(request.from_user_id)} className='chat_left_link_card' key={idx}><Link className={activeLink === request.from_user_id ? 'request_link_active' : ''} to={`requests/${request.from_user_name}/${request.id}`}>{request.from_user_name}</Link></div>)
    const messageLinks = friends.map((friend, idx) =><div onClick = {() => setActiveLink(friend.id)} className='chat_left_link_card' key={idx}><Link className={activeLink === friend.id ? 'request_link_active' : ''} to={`messages/${friend.username}/${friend.id}`}>{friend.username}</Link></div>)

    return (
        <div className='chat_main_container'>
            <div className='chat_left_container'>

                <div className='chat_buttons_container'>
                    <NavLink to='messages' onClick={() => toggleType('messages')}>Messages</NavLink>
                    <NavLink to='requests' onClick={() => toggleType('requests')}>Requests</NavLink>
                </div>

                <button onClick = {toggleModal}>Add Friend</button>

                <div className='chat_list_container'>
                    {type === 'requests' ? requestLinks : messageLinks}
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