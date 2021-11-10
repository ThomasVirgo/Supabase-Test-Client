import React from 'react'
import './style.css'

const StringInput = ({type, name, placeholder, value, onChange}) => {

    return (
        <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className='text_input_class' required></input>
    )
}

export default StringInput;