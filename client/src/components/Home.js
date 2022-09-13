import React from "react";
import axios from 'axios';
import { Navigate, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../actions/auth";

const Home = ()=>{
    const user = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function handleLogout(e){
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/logout`, {},{
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }).then(()=>{
            localStorage.removeItem('token')
            dispatch(Logout())
            navigate("/signin")
        }).catch((e)=>{return})
    }
    return(
        user.id?
        (<div className="home">
            <h1>Welcome, {user.first_name} {user.last_name}</h1>
            <button className="logout" onClick={handleLogout}>Logout</button>
        </div>):
        (<Navigate to="/signin"/>)
    )
}

export default Home