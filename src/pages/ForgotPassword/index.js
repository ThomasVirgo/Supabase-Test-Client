import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const supabase = useContext(SupaBaseContext)
    const [email, setEmail] = useState('')
    const [inputError, setInputError] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    function handleChange(event){
        setEmail(event.target.value)
    }

    async function handleSubmit(event){
        event.preventDefault()
        const { data, error } = supabase.auth.api.resetPasswordForEmail(email)
        console.log(data);
        console.log(error);
        setInputError(error?.message)
        if (!error){
            setMessage('A password reset link has been sent to your email.')
        }
    }

    return (
        <>
        <button onClick={() => navigate(-1)}>go back</button>
        { !message &&
        <form onSubmit={handleSubmit}>
            <input type='email' placeholder='email' value={email} onChange={handleChange} required></input>
            <input type='submit' value='Send Reset Email'></input>
        </form>
        }
        {inputError && <p>{inputError}</p>}
        {message && <p>{message}</p>}
        </>
    )
}

export default ForgotPassword;