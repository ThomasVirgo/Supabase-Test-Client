import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client';

const NewPassword = () => {
    const supabase = useContext(SupaBaseContext)
    const [password, setPassword] = useState('')

    function handleChange(event){
        setPassword(event.target.value)
    }

    async function handleSubmit(event){
        event.preventDefault()
        // const { error, data } = await supabase.auth.api.updateUser(access_token, { password : password })
        // console.log(data);
        // console.log(error);
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type='password' placeholder='Password' value={password} onChange={handleChange} required></input>
            {/* <input type='password' placeholder='Confirm Password' value={email} onChange={handleChange} required></input> */}
            <input type='submit' value='Send Reset Email'></input>
        </form>
    )
}

export default NewPassword;