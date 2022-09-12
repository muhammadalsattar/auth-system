import React, { useSelector } from "react-redux";
// import axios from "axios";
import {Link, Navigate} from "react-router-dom";

const Signin = ()=>{
    const id = useSelector(state=>state.auth.id)
    if(id){
        return (
            <Navigate to="/"/>
        )
    }
    return (id?
    <Navigate to="/"/>:
    <div className="signin">
        <form className="signin-form">
            <input type="email" id="email" placeholder="Email"/>
            <input type="password" id="password" placeholder="Password"/>
            <div id="remember-me">
                <input type="checkbox" id="remember-checkbox"/>
                <label htmlFor="remember-checkbox">Remember me</label>
            </div>
            <button type="submit">Login</button>
        </form>
        <h4 id="new-member">Not a Member? <Link to="/signup">Create an Account</Link></h4>
    </div>
    )
}

export default Signin