import React, { useState, useContext } from "react";
import { SupaBaseContext } from "../../context/supabase_client";
import { Link } from "react-router-dom";

const Register = () => {
    const supabase = useContext(SupaBaseContext)
    const [inputError, setInputError] = useState('')
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
            console.log(user, session, error);
            setInputError(error?.message)
            // need to show a message telling them to confirm sign up!!
        } else {
            setInputError('Passwords must match.')
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" name='email' placeholder='Email' value={input['email']} onChange={handleChange} required/>
                <input type="text" name='username' placeholder='Username' value={input['username']} onChange={handleChange} required/>
                <input type="password" name='password' placeholder='Password' value={input['password']} onChange={handleChange} required/>
                <input type="password" name='password2' placeholder='Confirm Password' value={input['password2']} onChange={handleChange} required/>
                <input type="submit" value='Register' />
            </form>
            <p>Already have an account? <Link to='/login'>Login Here</Link></p>
            {inputError && <p>{inputError}</p>}
        </div>
    )
}

export default Register;