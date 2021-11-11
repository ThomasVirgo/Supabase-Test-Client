import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { SupaBaseContext } from '../../context/supabase_client';
import './style.css'

const Requests = () => {
    const params = useParams();
    const [message, setMessage] = useState('')
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()
    useEffect(()=>{
        setMessage('')
    }, [params])

    async function respond(response){
        if (response === 'accept'){
            setMessage('Friend request accepted.')
        }

        if (response === 'decline'){
            setMessage('Friend request declined.')
        }

        let userResponse = response === 'accept';
        const { data, error } = await supabase
        .from('friend requests')
        .update({ responded: true, accepted: userResponse })
        .match({ id: params.id })
        console.log(data);
        console.log(error?.message);

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