const Update = (user) => {
    return {
        type: 'UPDATE',
        user
    }
}

const Logout = ()=>{
    return {
        type: 'LOGOUT'
    }
}

export {Update, Logout}