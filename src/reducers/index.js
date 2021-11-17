const initState = {
    friend_requests: [],
    sent_requests: [],
    friends: [],
  }
  
  const reducer = (state=initState, action) => {
    switch(action.type) {
        case 'INIT_ACTIVE_USERS':
          return {
              ...state,
              active_users: action.payload
          }
        
        case 'INIT_FRIEND_REQUESTS':
            return {
                ...state,
                friend_requests: action.payload
            }
        case 'INIT_SENT_REQUESTS':
            return {
                ...state,
                sent_requests: action.payload
            }
        case 'INIT_FRIENDS':
            return {
                ...state,
                friends: action.payload
            }
        case 'ADD_REQUEST':
            return {
                ...state,
                sent_requests: [...state.sent_requests, action.payload]
            }
        default:
            return state;
    }
  }
  
  export default reducer ;