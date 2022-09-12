const Login = (id) => {
    return {
        type: 'LOGIN',
        id
    }
}

const Logout = ()=>{
    return {
        type: 'LOGOUT'
    }
}

export {Login, Logout}