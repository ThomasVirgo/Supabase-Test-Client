import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client';
import { useParams } from "react-router-dom";

const NewPassword = () => {
    const supabase = useContext(SupaBaseContext)
    const [password, setPassword] = useState('')
    const params = useParams()

    function handleChange(event){
        setPassword(event.target.value)
    }

    async function handleSubmit(event){
        event.preventDefault()
        let access_token = params.token
        console.log(access_token);
        const { error, data } = await supabase.auth.api.updateUser(access_token, { password : password })
        console.log(data);
        console.log(error);
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type='password' placeholder='New Password' value={password} onChange={handleChange} required></input>
            {/* <input type='password' placeholder='Confirm Password' value={email} onChange={handleChange} required></input> */}
            <input type='submit' value='Change Password'></input>
        </form>
    )
}

export default NewPassword;