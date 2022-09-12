import React from "react";
import {Link, Navigate} from "react-router-dom";
import { useSelector } from "react-redux";


const Home = ()=>{
    const id = useSelector(state=>state.auth.id)
    return(
        id?
        (<div className="home">
            <h1>Welcome, John Doe</h1>
            <button className="logout"><Link to="/">Logout</Link></button>
        </div>):
        (<Navigate to="/signin"/>)
    )
}

export default Home