import React from 'react'
import { useParams } from 'react-router-dom';

const Requests = () => {
    const params = useParams();
    return (
        <div>
            <h1>Showing request with id: {params.id}</h1>
        </div>
    )
}

export default Requests;