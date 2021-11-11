import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Requests } from '..';

const RequestsContainer = () => {
    return (
        <div>
            <h1>Requests</h1>
            <Routes>
                <Route path=":id" element={<Requests/>} />
            </Routes>
        </div>
    )
}

export default RequestsContainer;