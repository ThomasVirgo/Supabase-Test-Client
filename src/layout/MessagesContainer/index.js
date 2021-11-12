import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Messages } from '..';

const MessagesContainer = () => {
    return (
            <Routes>
                <Route path=":username/:id" element={<Messages/>} />
            </Routes>
    )
}

export default MessagesContainer;