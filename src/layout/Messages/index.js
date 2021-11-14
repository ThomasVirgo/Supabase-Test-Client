import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { SupaBaseContext } from '../../context/supabase_client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import './style.css'
dayjs.extend(relativeTime)

const Messages = () => {
    const params = useParams();
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(()=>{
        async function fetchMessages(){
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`and(from_user.eq.${user.id},to_user.eq.${params.id}),and(from_user.eq.${params.id},to_user.eq.${user.id})`)
            console.log('message collection error:', error?.message);
            if (data){
                setMessages(data)
            }
            console.log(data);
        }
        fetchMessages()
    }, [user, params, supabase])


    console.log(supabase.getSubscriptions());


    useEffect(()=>{
        console.log('Running useEffect for messages subscription');
        
        function handleMessageInsert(payload){
            let newMessage = payload.new
            if ((newMessage.from_user === user.id && newMessage.to_user === params.id) || (newMessage.from_user === params.id && newMessage.to_user === user.id)){
                setMessages(prevMessages => [...prevMessages, payload.new])
            }
            return
        }
        
        const mySubscription = supabase
                .from('messages')
                .on('INSERT', handleMessageInsert)
                .subscribe()
        
        return () => {
            //remove subscriptions when component unmounts
            supabase.removeSubscription(mySubscription)
        }
    }, [])


    async function handleSubmit(event){
        event.preventDefault()
        setInput('')
        const { error } = await supabase.from('messages').insert([
            { from_user: user.id, to_user: params.id, content:input }
        ])
        console.log(error);
    }

    function handleChange (event){
        setInput(event.target.value)
    }

    const messageCards = messages.map((message, idx) => 
            <div className = {message.from_user === user.id ? 'message_div_right' : 'message_div_left'} key={idx}>
                <p className='message_date'>{dayjs(message.created_at).fromNow()}</p>
                <div>{message.content}</div>
            </div>
        )

    return (
        <div className='messages_main_container'>
            <h1 className='messages_username_header'>{params.username}</h1>
            <div className='messages_container'>
                <div className='messages_in_here'>
                    {messageCards}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <form className='messages_form' onSubmit={handleSubmit}>
                <input className='messages_input' type='text' placeholder='message...' value={input} onChange={handleChange} ></input>
                <input className='messages_submit' type='submit' value='Send' ></input>
            </form>
        </div>
    )
}

export default Messages;