import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {BiHide, BiShow} from 'react-icons/bi'
import Error from "./Error";


const Signup = ()=>{
    const user = useSelector(state=>state.auth)
    const navigate = useNavigate()
    const [error, setError] = useState('')

    useEffect(()=>{
        const lowercase = document.querySelector("#lowercase span");
        const uppercase = document.querySelector("#uppercase span");
        const specar = document.querySelector("#special-char span")
        const numerical = document.querySelector("#number span")
        const len = document.querySelector("#min-char span")
        const passInput = document.querySelector('.signup #password input')
        passInput.addEventListener('keyup', ()=>{
            /([a-z])/g.test(passInput.value)?lowercase.style.color='#2ecc71' : lowercase.style.color='#d63031';
            /([A-Z])/g.test(passInput.value)?uppercase.style.color='#2ecc71' : uppercase.style.color='#d63031';
            /([0-9])/g.test(passInput.value)?numerical.style.color='#2ecc71' : numerical.style.color='#d63031';
            /([-+_!@#$%^&*.,?])/g.test(passInput.value)?specar.style.color='#2ecc71' : specar.style.color='#d63031';
            passInput.value.length >= 8 ?len.style.color='#2ecc71' : len.style.color='#d63031';
        })

    })

    function signupHandler (e) {
        e.preventDefault()
        setError('')
        const passInput = document.querySelector('.signup #password input')
        if(/([a-z])/g.test(passInput.value) && /([A-Z])/g.test(passInput.value) && /([0-9])/g.test(passInput.value) && /([-+_!@#$%^&*.,?])/g.test(passInput.value) && passInput.value.length >= 8)
        {
            // Waiting for reponse
            document.querySelector('.signup form #submit').innerHTML = "Please Wait.."
            
            axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`, {
            first_name: document.querySelector(".signup #first-name input").value,
            last_name: document.querySelector('.signup #last-name input').value,
            email: document.querySelector('.signup #email input').value,
            password: document.querySelector('.signup #password input').value,
            client_url: window.location.origin
            }).then(()=>{
                document.querySelector('.signup form #submit').innerHTML = "Signup"
                document.querySelector('.signup .email-modal').style.display = 'flex'
            }).catch(e=>{
                setError(e.response.data.error)
                document.querySelector('.signup form #submit').innerHTML = "Signup"
            })
        }
        
    }

    function togglePassword (e) {
        if(e.target.id === 'show' || e.target.parentNode.id === 'show'){
            document.querySelector('.signup #password input').setAttribute('type', 'text')
            document.querySelector('.signup #toggle-password #show').setAttribute('display', 'none')
            document.querySelector('.signup #toggle-password #hide').setAttribute('display', 'block')
        } else if(e.target.id === 'hide' || e.target.parentNode.id === 'hide'){
            document.querySelector('.signup #password input').setAttribute('type', 'password')
            document.querySelector('.signup #toggle-password #hide').setAttribute('display', 'none')
            document.querySelector('.signup #toggle-password #show').setAttribute('display', 'block')
        }
    }

    function closeModal(){
        document.querySelector('.signup .email-modal').style.display = 'none'
        navigate("/signin")
    }

    window.onclick = (e)=>{
        if(e.target !== document.querySelector('.signup .email-modal') && document.querySelector('.signup .email-modal')){
            document.querySelector('.signup .email-modal').style.display = 'none'
        }
    }

    return (user.token?
    <Navigate to="/scanqr"/>:
        <div className="signup">
            <form onSubmit={signupHandler}>
                <div className="input-group">
                    <div id="first-name"><input required type="text" placeholder="First Name"/></div>
                    <div id="last-name"><input required type="text" placeholder="Last Name"/></div>
                    <div id="email"><input required type="email" placeholder="Email"/></div>
                    <div id="password">
                        <input required type="password" placeholder="Password"/>
                        <div id="toggle-password">
                            <BiHide id="show" onClick={togglePassword}/>
                            <BiShow id="hide" display="none" onClick={togglePassword}/>
                        </div>
                        <ul className="password-contraints">
                            <li id="lowercase"><span>&#10004; </span>Lowercase</li>
                            <li id="uppercase"><span>&#10004; </span>Uppercase</li>
                            <li id="special-char"><span>&#10004; </span>Special characters</li>
                            <li id="number"><span>&#10004; </span>Number</li>
                            <li id="min-char"><span>&#10004; </span>Min 8 characters</li>
                        </ul>
                    </div>
                    {error && <Error message={error}/>}
                </div>
                <button id="submit" type="submit">Signup</button>
            </form>
            <h4 id="already-member">Have an Account? <Link to="/">Signin</Link></h4>
            <div className="email-modal">
                <h4>Please Check Your Email For Confirmation!</h4>
                <button id="close-modal" onClick={closeModal}>Close</button>
            </div>
        </div>
    )
}

export default Signup;