import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const supabase = useContext(SupaBaseContext)
    const navigate = useNavigate()
    const [input, setInput] = useState({
        "email": "",
        "password": ""
    })
    
    function handleChange(event){
        let newInput = {...input}
        newInput[event.target.name] = event.target.value
        setInput(newInput)
    }

    async function handleSubmit(event){
        event.preventDefault()
        
        const { user, session, error } = await supabase.auth.signIn({
            email: input.email,
            password: input.password,
        })

        console.log(user, session, error);
        navigate('/')
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" name='email' placeholder='Email' value={input['email']} onChange={handleChange} required/>
                <input type="password" name='password' placeholder='Password' value={input['password']} onChange={handleChange} required/>
                <input type="submit" value='Login' />
            </form>
        </div>
    )
}

export default Login;