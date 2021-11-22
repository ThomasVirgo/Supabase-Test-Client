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

function updateFriendRequest(from_user_id, hasAccepted){
    return {
        type: 'UPDATE_REQUEST',
        payload: {from_user_id, hasAccepted}
    }
}

function addFriend(data){
    return {
        type: 'ADD_FRIEND',
        payload: data
    }
}

function changeRoomName(name){
    return {
        type: 'CHANGE_ROOM',
        payload: name
    }
}


export {initFriendRequests, initSentRequests, initFriends, addFriendRequest, updateFriendRequest, addFriend, changeRoomName}