import React from "react";
import {Link} from "react-router-dom";

const Signin = ()=>{
    return(
        <div className="signin">
            <form className="signin-form">
                <input type="email" id="email" placeholder="Email"/>
                <input type="password" id="password" placeholder="Password"/>
                <input type="checkbox" id="remember-password"/>
                <label htmlFor="remember-password">Remember me</label>
                <button type="submit">Login</button>
            </form>
            <h4 id="new-member">Not a Member? <Link to="/signup">Create an Account</Link></h4>
        </div>
    )
}

export default Signin