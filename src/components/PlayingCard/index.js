import React from 'react';
import './style.css'

const PlayingCard = ({value, suit, faceUp, packPos}) => {

    let symbols = {
        'diamond':'\u2666',
        'heart':'\u2665',
        'club':'\u2663',
        'spade':'\u2660'
    }

    let suitSymbol = symbols[suit];
    let textStyle = {};
    if (suit === 'diamond' || suit === 'heart'){
        textStyle = {color:'red'};
    } else {
        textStyle = {color:'black'};
    }

    let cardColor, cardStyle;

    if (!faceUp){
        cardColor = {backgroundColor:'darkRed'};
        cardStyle = {visibility:'hidden'};
    } else {
        cardColor = {backgroundColor:'white'};
        cardStyle = {};
    }

    let wrapperStyle;
    if (packPos != -1){
        wrapperStyle = {
            zIndex: packPos,
            position: 'relative'
        }
    } else {
        wrapperStyle = {
        }
    }

    return (
        <div style={wrapperStyle}>
            <div className = 'card-container' style={cardColor}>
                <div style={cardStyle}>
                    <div className='card-top' style={textStyle}>
                        <span>{value}</span><span>{suitSymbol}</span>
                    </div>
                    <div className='card-suit'>
                        <h3 className = 'h1-suit value-black' style={textStyle}>{suitSymbol}</h3>
                    </div>
                    <div className='card-bottom' style={textStyle}>
                        <span>{suitSymbol}</span><span>{value}</span>
                    </div> 
                </div>       
            </div>
        </div>
    )
}

export default PlayingCard;