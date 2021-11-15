import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux';
import { SupaBaseContext } from '../../context/supabase_client'
import { StringInput } from '../../components';
import './style.css'

const AddFriendModal = ({toggleModal}) => {
    const supabase = useContext(SupaBaseContext)
    const [users, setUsers] = useState([])
    const [searchedUsers, setSearchedUsers] = useState([])
    const clientUser = supabase.auth.user()
    const [username, setUsername] = useState('')
    const friends = useSelector(state => state.friends)
    const sentRequests = useSelector(state => state.sent_requests)

    useEffect(()=>{
        async function fetchData(){
            const { data, error } = await supabase.from('profiles').select()
            console.log('error', error);
            console.log(data);
            let transformedData = data.map(user => {
                if (user.id === clientUser.id){
                    return {
                        ...user,
                        'client_message': 'remove'
                    }
                }
                let isFriends = friends.findIndex(friend => friend.id === user.id) != -1;
                if (isFriends){
                    return {
                        ...user,
                        'client_message': 'You are already friends!'
                    }
                }
                let isPending = sentRequests.findIndex(request => request.to_user_id === user.id) != -1
                if (isPending){
                    return {
                        ...user,
                        'client_message': 'Friend request pending...'
                    }
                }
                return user
            })
            // if already friends or if already sent a request to them then show user this and don't show own user
            setUsers(transformedData)
        }
        fetchData()
    }, [supabase])

    function handleChange(event){
        let val = event.target.value
        setUsername(val)
        if (val === ''){
            setSearchedUsers([])
            return
        }
        let matchingUsers = users.filter( user => user.data.username.includes(val))
        setSearchedUsers(matchingUsers)
    }

    async function sendRequest(user){
        console.log(user);
        console.log(clientUser);
        const { data, error } = await supabase
                .from('friend requests')
                .insert([
                    { from_user_id: clientUser.id, to_user_id: user.id, from_user_name: clientUser.user_metadata.username, to_user_name: user.data.username }
                ])
        console.log(error?.message);
        console.log(data);
        setUsername('')
    }

    const userCards = searchedUsers.map((user, idx) => {
       if (user.client_message === 'remove'){ return } 
       return (
            <div className='add_friend_card' key={idx}>
                <span>{user.data.username}</span>
                {!user.client_message ? <button onClick={() => sendRequest(user)}>Add friend</button> : <span>{user.client_message}</span>}
            </div>
       )
    })

    return (
        <div className='add_friend_modal_background'>
            <div className='add_friend_container'>
                <div className='add_friend_input_cross_container'>
                    <StringInput placeholder='search username...' value={username} type='text' onChange={handleChange}/>
                    <span className='modal_cross' onClick={toggleModal}>X</span>
                </div>
                <div className='add_friend_list'>
                    {userCards}
                </div>
            </div>
        </div>
    )
}

export default AddFriendModal;