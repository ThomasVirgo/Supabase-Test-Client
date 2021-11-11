import React, { useState, useContext } from "react";
import { SupaBaseContext } from "../../context/supabase_client";
import { Link } from "react-router-dom";
import { StringInput, SubmitButton } from "../../components";

const Register = () => {
    const supabase = useContext(SupaBaseContext)
    const [inputError, setInputError] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState({
        "email": "",
        "password": "",
        "password2": "",
        "username": "",
    })
    
    function handleChange(event){
        let newInput = {...input}
        newInput[event.target.name] = event.target.value
        setInput(newInput)
    }

    async function handleSubmit(event){
        event.preventDefault()
        setIsLoading(true)
        if (input.password === input.password2){
            const { user, session, error } = await supabase.auth.signUp(
                {
                  email: input.email,
                  password: input.password,
                },
                {
                  data: { 
                    username: input.username, 
                  }
                }
              )
            setInput({
                "email": "",
                "password": "",
                "password2": "",
                "username": "",
            })
            console.log(user, session, error);
            setInputError(error?.message)
            if (user){
                setMessage('You have been sent an email to confirm sign up.')
            }
        } else {
            setInputError('Passwords must match.')
        }
    }


    return (
        <div className='center_container'>
            <div className='shadow_container_center'>
                {!message && <form className='form_container' onSubmit={handleSubmit}>
                    <StringInput type="email" name='email' placeholder='Email' value={input['email']} onChange={handleChange}/>
                    <StringInput type="text" name='username' placeholder='Username' value={input['username']} onChange={handleChange}/>
                    <StringInput type="password" name='password' placeholder='Password' value={input['password']} onChange={handleChange}/>
                    <StringInput type="password" name='password2' placeholder='Confirm Password' value={input['password2']} onChange={handleChange}/>
                    {!isLoading ? <SubmitButton value='Register' /> : <button>loading...</button>}
                </form>}
                <p>Already have an account? <Link to='/login'>Login Here</Link></p>
                {inputError && <p>{inputError}</p>}
                {message && <p>{message}</p>}
            </div>
        </div>
    )
}

export default Register;