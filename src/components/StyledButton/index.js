import React from 'react'
import './style.css'

const StyledButton = ({onClick, text, style}) => {
    return (
        <button className='styled_button' onClick = {onClick} style={style}>{text}</button>
    )
}

export default StyledButton;