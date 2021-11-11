import React, { useState, useEffect, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { StringInput } from '../../components';
import './style.css'

const AddFriendModal = () => {
    const supabase = useContext(SupaBaseContext)
    const [users, setUsers] = useState([])
    const [searchedUsers, setSearchedUsers] = useState([])

    useEffect(()=>{
        async function fetchData(){
            const { data, error } = await supabase.from('profiles').select()
            console.log('error', error);
            console.log(data);
            setUsers(data)
        }
        fetchData()
    }, [supabase])

    function handleChange(event){
        let val = event.target.value
        if (val === ''){
            setSearchedUsers([])
            return
        }
        let matchingUsers = users.filter( user => user.data.username.includes(val))
        setSearchedUsers(matchingUsers)
    }

    const userCards = searchedUsers.map(user => <div>
        <h2>{user.data.username}</h2>
        <button>Add friend</button>
    </div>)

    return (
        <div className='add_friend_modal_background'>
            <div className='add_friend_container'>
                <StringInput placeholder='search username...' type='text' onChange={handleChange}/>
                <h1>X</h1>
                <div className='add_friend_list'>
                    {userCards}
                </div>
            </div>
        </div>
    )
}

export default AddFriendModal;