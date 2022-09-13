const authReducer = (state={}, action)=>{
    switch (action.type) {
        case 'UPDATE':
            return {
                ...state,
                ...action.user
            }
        case 'LOGOUT':
            return {}
        default:
            return state;
    }
}

export default authReducer;