import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import './style.css'

const Requests = () => {
    const params = useParams();
    const [message, setMessage] = useState('')
    useEffect(()=>{
        setMessage('')
    }, [params])
    return (
        <div className='rq_container'>
            <h1>Requests</h1>
            {!message && 
                <div>
                    <h2 className='requests_header'>You have a friend request from {params.username}</h2>
                    <div className='requests_buttons'>
                        <button onClick={()=>setMessage('Friend request accepted.')}>Accept</button>
                        <button onClick={()=>setMessage('Friend request declined.')}>Decline</button>
                    </div>
                </div>
            }
            <p>{message}</p>
        </div>
    )
}

export default Requests;