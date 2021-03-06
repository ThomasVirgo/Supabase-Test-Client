import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { Link } from 'react-router-dom'
import { StringInput, SubmitButton } from '../../components'

const ForgotPassword = () => {
    const supabase = useContext(SupaBaseContext)
    const [email, setEmail] = useState('')
    const [inputError, setInputError] = useState('')
    const [message, setMessage] = useState('')

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
        <div className='center_container'>
            <div className='shadow_container_center'>
                <Link to='/login'>{'<--'} go back</Link>
                { !message &&
                <form className='form_container' onSubmit={handleSubmit}>
                    <StringInput type='email' placeholder='email' value={email} onChange={handleChange}/>
                    <SubmitButton value='Send Reset Email'/>
                </form>
                }
                {inputError && <p>{inputError}</p>}
                {message && <p>{message}</p>}
            </div>
        </div>
    )
}

export default ForgotPassword;