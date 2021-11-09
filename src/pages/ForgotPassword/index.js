import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'

const ForgotPassword = () => {
    const supabase = useContext(SupaBaseContext)
    const [email, setEmail] = useState('')
    const [inputError, setInputError] = useState('')

    function handleChange(event){
        setEmail(event.target.value)
    }

    async function handleSubmit(event){
        event.preventDefault()
        const { data, error } = supabase.auth.api.resetPasswordForEmail(email)
        console.log(data);
        console.log(error);
        setInputError(error?.message)
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <input type='email' placeholder='email' value={email} onChange={handleChange} required></input>
            <input type='submit' value='Send Reset Email'></input>
        </form>
        {inputError && <p>{inputError}</p>}
        </>
    )
}

export default ForgotPassword;