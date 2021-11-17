import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { SupaBaseContext } from '../../context/supabase_client';
import { useSelector, useDispatch } from 'react-redux';
import { updateFriendRequest, addFriend } from '../../actions';
import './style.css'

const Requests = () => {
    const params = useParams();
    const supabase = useContext(SupaBaseContext)
    const dispatch = useDispatch()
    let requests = useSelector(state => state.friend_requests)
    let request = requests.find( element => element.id == params.id)

    async function respond(response){
        if (response === 'accept'){
            await supabase.from('friend requests').update({ responded: true, accepted: true }).match({ id: params.id })
            await supabase.from('friends').insert([
                { user1_id: request.from_user_id,
                  user2_id: request.to_user_id, 
                  user1_name: request.from_user_name,
                  user2_name: request.to_user_name
                 }
              ])
            dispatch(updateFriendRequest(request.from_user_id, true))
            dispatch(addFriend({id: request.from_user_id, username: request.from_user_name}))
        }

        if (response === 'decline'){
            await supabase.from('friend requests').update({ responded: true, accepted: false }).match({ id: params.id })
            dispatch(updateFriendRequest(request.from_user_id, true))
        }
    }

    const responseElements = <div>
                                <h2 className='requests_header'>You have a friend request from {params.username}</h2>
                                <div className='requests_buttons'>
                                    <button onClick={()=>respond('accept')}>Accept</button>
                                    <button onClick={()=>respond('decline')}>Decline</button>
                                </div>
                            </div>
    const acceptMsg = <p>Friend request accepted.</p>
    const declineMsg = <p>Friend request declined.</p>
    return (
        <div className='rq_container'>
            <h1>Requests</h1>
            { request.accepted ?  acceptMsg : request.responded && !request.accepted ? declineMsg : responseElements}
        </div>
    )
}

export default Requests;