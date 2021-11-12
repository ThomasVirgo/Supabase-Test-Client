function initFriendRequests(data){
    return {
        type: 'INIT_FRIEND_REQUESTS',
        payload: data
    }
}

function initSentRequests(data){
    return {
        type: 'INIT_SENT_REQUESTS',
        payload: data
    } 
}

export {initFriendRequests, initSentRequests}