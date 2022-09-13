import React, { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {BiHide, BiShow} from 'react-icons/bi'
import {Link, Navigate, useNavigate} from "react-router-dom";
import { Update } from "../actions/auth";


const Signin = ()=>{
    const user = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function handleSignin(e) {
        e.preventDefault()
        axios.post("http://localhost:4000/signin", {
            email: document.querySelector('input#email').value,
            password: document.querySelector('input#password').value
        }).then(res=>{
            dispatch(Update({...res.data.data, email:document.querySelector('input#email').value}))
            res.data.data.verified? navigate("/verify"):navigate("/scanqr")
        }).catch(e=>{
            document.querySelector('.signin #error').innerHTML = `<p>${e.response.data.error}</p>`
        })
    }

    function togglePassword (e) {
        if(e.target.id === 'show' || e.target.parentNode.id === 'show'){
            document.querySelector('.signin-form #password').setAttribute('type', 'text')
            document.querySelector('.signin-form #toggle-password #show').setAttribute('display', 'none')
            document.querySelector('.signin-form #toggle-password #hide').setAttribute('display', 'block')
        } else if(e.target.id === 'hide' || e.target.parentNode.id === 'hide'){
            document.querySelector('.signin-form #password').setAttribute('type', 'password')
            document.querySelector('.signin-form #toggle-password #hide').setAttribute('display', 'none')
            document.querySelector('.signin-form #toggle-password #show').setAttribute('display', 'block')
        }
    }

    function hideError(){
        document.querySelector('.signin #error').innerHTML = ''
    }

    return (user.token?
    <Navigate to="/"/>:
    <div className="signin">
        <form className="signin-form" onSubmit={handleSignin}>
            <input required type="email" id="email" onKeyUp={hideError} placeholder="Email"/>
            <input required type="password" id="password" onKeyUp={hideError} placeholder="Password"/>
            <div id="toggle-password">
                <BiHide id="show" onClick={togglePassword}/>
                <BiShow id="hide" display="none" onClick={togglePassword}/>
            </div>
            <div id="error"></div>
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