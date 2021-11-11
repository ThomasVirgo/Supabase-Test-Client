import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Requests } from '..';

const RequestsContainer = () => {
    return (
        <div>
            <Routes>
                <Route path=":username/:id" element={<Requests/>} />
            </Routes>
        </div>
    )
}

export default RequestsContainer;