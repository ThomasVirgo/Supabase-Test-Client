import React, { useState, useEffect, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { StringInput } from '../../components';
import './style.css'

const AddFriendModal = ({toggleModal}) => {
    const supabase = useContext(SupaBaseContext)
    const [users, setUsers] = useState([])
    const [searchedUsers, setSearchedUsers] = useState([])
    const clientUser = supabase.auth.user()
    const [username, setUsername] = useState('')

    useEffect(()=>{
        async function fetchData(){
            const { data, error } = await supabase.from('profiles').select()
            console.log('error', error);
            console.log(data);
            // if already friends or if already sent a request to them then show user this
            setUsers(data)
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

    const userCards = searchedUsers.map((user, idx) => <div key={idx}>
        <h2>{user.data.username}</h2>
        <button onClick={() => sendRequest(user)}>Add friend</button>
    </div>)

    return (
        <div className='add_friend_modal_background'>
            <div className='add_friend_container'>
                <StringInput placeholder='search username...' value={username} type='text' onChange={handleChange}/>
                <h1 onClick={toggleModal}>X</h1>
                <div className='add_friend_list'>
                    {userCards}
                </div>
            </div>
        </div>
    )
}

export default AddFriendModal;