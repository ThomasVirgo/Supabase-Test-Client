import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Messages } from '..';

const MessagesContainer = () => {
    return (
        <div>
            <h1>Messages</h1>
            <Routes>
                <Route path=":id" element={<Messages/>} />
            </Routes>
        </div>
    )
}

export default MessagesContainer;