import React from "react";
import {Link} from "react-router-dom";

const Signup = ()=>{
    return(
        <div className="signup">
            <form>
                <div className="input-group">
                    <div id="first-name"><input type="text" placeholder="First Name"/></div>
                    <div id="last-name"><input type="text" placeholder="Last Name"/></div>
                    <div id="email"><input type="email" placeholder="Email"/></div>
                    <div id="password">
                        <input type="password" placeholder="Password"/>
                        <ul className="password-contraints">
                            <li id="lowercase"><span>&#10004; </span>Lowercase</li>
                            <li id="uppercase"><span>&#10004; </span>Uppercase</li>
                            <li id="special-char"><span>&#10004; </span>Special characters</li>
                            <li id="number"><span>&#10004; </span>Number</li>
                            <li id="min-char"><span>&#10004; </span>Min 8 characters</li>
                        </ul>
                    </div>
                </div>
                <button type="submit">Signup</button>
            </form>
            <h4 id="already-member">Have an Account? <Link to="/">Signin</Link></h4>
        </div>
    )
}

export default Signup;