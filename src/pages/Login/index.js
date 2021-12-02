import React, { useState, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client';
import { useNavigate, Link } from 'react-router-dom';
import { StringInput, GandalfLogo , StyledButton } from '../../components';
import './style.css'

const Login = () => {
    const supabase = useContext(SupaBaseContext)
    const navigate = useNavigate()
    const [inputError, setInputError] = useState()
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
        if (!error){
            navigate('/')
        } else {
            setInputError(error.message)
        }
    }


    return (
        <div className='login_main_container'>
            <div>
                <GandalfLogo/>
            </div>
            <div className='center_container'>
                <div className='shadow_container_center'>
                    <form className='form_container' onSubmit={handleSubmit}>
                        <StringInput type="email" name='email' placeholder='Email' value={input['email']} onChange={handleChange}/>
                        <StringInput type="password" name='password' placeholder='Password' value={input['password']} onChange={handleChange}/>
                        <StyledButton onClick = {handleSubmit} text={'Login'} style = {{marginTop: '10px'}}/>
                    </form>
                    <p>Don't have an account? <Link to='/register'>Register Here</Link></p>
                    <p>Forgotten password? <Link to='/reset_password'>Click Here</Link></p>
                    {inputError && <p>{inputError}</p>}
                </div>
            </div>
        </div>
    )
}

export default Login;