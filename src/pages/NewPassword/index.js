import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client';
import { useParams, Link, useNavigate } from "react-router-dom";
import { StringInput, SubmitButton } from '../../components';

const NewPassword = () => {
    const supabase = useContext(SupaBaseContext)
    const [passwords, setPasswords] = useState({
        "password": "",
        "password2": ""
    })
    const [passwordError, setPasswordError] = useState('')
    const params = useParams()
    const navigate = useNavigate()

    function handleChange(event){
        let newInput = { ...passwords }
        newInput[event.target.name] = event.target.value
        setPasswords(newInput)
    }

    async function handleSubmit(event){
        event.preventDefault()
        let access_token = params.token
        console.log(access_token);
        if (passwords.password === passwords.password2){
            const { error, data } = await supabase.auth.api.updateUser(access_token, { password : passwords.password })
            console.log(data);
            console.log(error);
            if (!error){
                navigate('/')
            } else{
                setPasswordError(error.message)
            }
        } else {
            setPasswordError('Passwords must match.')
        }
    }

    return (
        <div className='center_container'>
            <div className='shadow_container_center'>
                <Link to='/'>Home</Link>
                <form className='form_container' onSubmit={handleSubmit}>
                    <StringInput type='password' name='password' placeholder='New Password' value={passwords.password} onChange={handleChange}/>
                    <StringInput type='password' name='password2' placeholder='Confirm Password' value={passwords.password2} onChange={handleChange}/>
                    <SubmitButton value='Change Password'/>
                </form>
                {passwordError && <p>{passwordError}</p>}
            </div>
        </div>
    )
}

export default NewPassword;