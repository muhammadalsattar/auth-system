import React from "react";
import {Link} from "react-router-dom";

const Home = ()=>{
    return(
        <div className="home">
            <h1>Welcome, Muhammad Abd-Elsattar</h1>
            <button className="logout"><Link to="/">Logout</Link></button>
        </div>
    )
}

export default Home