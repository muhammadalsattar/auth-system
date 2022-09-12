const authReducer = (state={}, action)=>{
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                id: action.id
            }
        case 'LOGOUT':
            return {
                ...state,
                id: undefined
            }
        default:
            return state;
    }
}

export default authReducer;