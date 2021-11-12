import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { SupaBaseContext } from '../../context/supabase_client';
import { useSelector } from 'react-redux';
import './style.css'

const Requests = () => {
    const params = useParams();
    const [message, setMessage] = useState('')
    const supabase = useContext(SupaBaseContext)
    // const user = supabase.auth.user()
    useEffect(()=>{
        setMessage('')
    }, [params])
    let requests = useSelector(state => state.friend_requests)
    let request = requests.find( element => element.id == params.id)

    async function respond(response){
        if (response === 'accept'){
            setMessage('Friend request accepted.')
            await supabase.from('friend requests').update({ responded: true, accepted: true }).match({ id: params.id })
            await supabase.from('friends').insert([
                { user1_id: request.from_user_id,
                  user2_id: request.to_user_id, 
                  user1_name: request.from_user_name,
                  user2_name: request.to_user_name
                 }
              ])
        }

        if (response === 'decline'){
            setMessage('Friend request declined.')
            await supabase.from('friend requests').update({ responded: true, accepted: false }).match({ id: params.id })
        }

    }
    return (
        <div className='rq_container'>
            <h1>Requests</h1>
            {!message && 
                <div>
                    <h2 className='requests_header'>You have a friend request from {params.username}</h2>
                    <div className='requests_buttons'>
                        <button onClick={()=>respond('accept')}>Accept</button>
                        <button onClick={()=>respond('decline')}>Decline</button>
                    </div>
                </div>
            }
            <p>{message}</p>
        </div>
    )
}

export default Requests;