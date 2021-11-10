import React from 'react'
import './style.css'

const SubmitButton = ({value}) => {
    return (
        <input className='submit_button' type='submit' value={value}></input>
    )
}

export default SubmitButton;