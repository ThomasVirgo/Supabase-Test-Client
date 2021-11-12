import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { SupaBaseContext } from '../../context/supabase_client';
import './style.css'

const Messages = () => {
    const params = useParams();
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()
    const [input, setInput] = useState('')

    // useEffect(()=>{
    //     async function fetchMessages(){
    //         const { data, error } = await supabase
    //             .from('messages')
    //             .select('*')
    //             .match({from_user: 'Beijing', country_id: 156})
    //     }
    // }, [])

    async function handleSubmit(event){
        event.preventDefault()
        console.log(input);
        setInput('')
        const { error } = await supabase.from('messages').insert([
            { from_user: user.id, to_user: params.id, content:input }
        ])
        console.log(error);
    }

    function handleChange (event){
        setInput(event.target.value)
    }

    return (
        <div className='messages_main_container'>
            <h1 className='messages_username_header'>{params.username}</h1>
            <div className='messages_container'>
                <div className='messages_in_here'></div>
                <form className='messages_form' onSubmit={handleSubmit}>
                    <input className='messages_input' type='text' placeholder='message...' value={input} onChange={handleChange} ></input>
                    <input className='messages_submit' type='submit' value='Send' ></input>
                </form>
            </div>
        </div>
    )
}

export default Messages;