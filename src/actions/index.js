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


function initFriends(data){
    return {
        type: 'INIT_FRIENDS',
        payload: data
    } 
}

function addFriendRequest(data){
    return {
        type: 'ADD_REQUEST',
        payload: data
    }
}


export {initFriendRequests, initSentRequests, initFriends, addFriendRequest}