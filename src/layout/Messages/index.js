import React from 'react'
import { useParams } from 'react-router-dom';

const Messages = () => {
    const params = useParams();
    return (
        <div>
            <h1>Showing messages with id: {params.id}</h1>
        </div>
    )
}

export default Messages;