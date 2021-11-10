import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { StringInput, SubmitButton } from '../../components'

const Account = () => {
    const supabase = useContext(SupaBaseContext)
    const [input, setInput] = useState({
        "username": "",
        "password": "",
        "password2": ""
    })
    const [passwordError, setPasswordError] = useState('')

    function handleChange(event){
        let newInput = { ...input }
        newInput[event.target.name] = event.target.value
        setInput(newInput)
    }

    async function changeUsername(event){
        event.preventDefault()
        const { user, error } = await supabase.auth.update({ 
            data: { username: input.username } 
        })
        console.log(user);
        console.log(error);
    }

    async function changePassword(event){
        event.preventDefault()
        if (input.password === input.password2){
            const { user, error } = await supabase.auth.update({password: input.password})
            console.log(user, error);
        } else {
            setPasswordError('Passwords must match.')
        }
    }

    return (
        <div>
            <h1>Update Username or Password</h1>
            <form onSubmit = {changeUsername}>
                <StringInput type='text' name='username' onChange={handleChange} value={input.username} placeholder='new username' />
                <SubmitButton value='Change Username'/>
            </form>
            <form onSubmit = {changePassword}>
                <StringInput type='password' name='password' onChange={handleChange} value={input.password} placeholder='new password' />
                <StringInput type='password' name='password2' onChange={handleChange} value={input.password2}  placeholder='confirm new password' />
                <SubmitButton value='Change Password'/>
            </form>
            {passwordError && <p>{passwordError}</p>}
        </div>
    )
}

export default Account;