import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'
import { StringInput, SubmitButton, StyledButton } from '../../components'
import './style.css'

const Account = () => {
    const supabase = useContext(SupaBaseContext)
    const [input, setInput] = useState({
        "username": "",
        "password": "",
        "password2": ""
    })
    const [passwordError, setPasswordError] = useState('')
    const [usernameMsg, setUsernameMsg] = useState('')
    const [passwordMsg, setPasswordMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const user = supabase.auth.user()

    function handleChange(event){
        let newInput = { ...input }
        newInput[event.target.name] = event.target.value
        setInput(newInput)
    }

    function changeUsername(event){
        event.preventDefault()
        async function updateUsername(){
            await supabase.auth.update({ 
                data: { username: input.username } 
            })
            // update friends table
            await supabase
                        .from('friends')
                        .update({ user1_name: input.username })
                        .match({ user1_id: user.id })
            await supabase
                        .from('friends')
                        .update({ user2_name: input.username })
                        .match({ user2_id: user.id })
            // update friend requests table
            await supabase
                        .from('friend requests')
                        .update({ from_user_name: input.username })
                        .match({ from_user_id: user.id })
            await supabase
                        .from('friend requests')
                        .update({ to_user_name: input.username })
                        .match({ to_user_id: user.id })
            // update profile
            await supabase
                        .from('profiles')
                        .update({ data: {username: input.username }})
                        .match({ id: user.id })         
            
            setLoading(false)
            setUsernameMsg('Username successfully updated.')
        }
        setLoading(true)
        updateUsername()
        
    }

    async function changePassword(event){
        event.preventDefault()
        if (input.password === input.password2){
            const { user, error } = await supabase.auth.update({password: input.password})
            setInput({
                "username": "",
                "password": "",
                "password2": ""
            })
            setPasswordMsg('Password successfully updated.')
        } else {
            setPasswordError('Passwords must match.')
        }
    }

    return (
        <div>
            <h1 className='account_header'>Update Username or Password</h1>
            <div className='account_forms_container'>
                <form className='account_form' onSubmit = {changeUsername}>
                    <StringInput type='text' name='username' onChange={handleChange} value={input.username} placeholder='new username' />
                    {usernameMsg ? <p>{usernameMsg}</p>  : loading ? <p>in progress...</p> : <StyledButton onClick={changeUsername} text={'Change Username'} />}
                </form>
                <form className='account_form' onSubmit = {changePassword}>
                    <StringInput type='password' name='password' onChange={handleChange} value={input.password} placeholder='new password' />
                    <StringInput type='password' name='password2' onChange={handleChange} value={input.password2}  placeholder='confirm new password' />
                    {passwordMsg ? <p>{passwordMsg}</p> : <StyledButton onClick={changePassword} text={'Change Password'} />}
                </form>
                {passwordError && <p>{passwordError}</p>}
            </div>
        </div>
    )
}

export default Account;