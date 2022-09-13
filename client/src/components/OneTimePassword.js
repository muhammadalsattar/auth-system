import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Update } from "../actions/auth";

const OneTimePassword = ()=>{
    const user = useSelector(state=>state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function handleVerify (e){
        e.preventDefault()
        let otp = ''
        document.querySelectorAll('.otp form input').forEach(input=>{
            otp += input.value
        })
        axios.post("http://localhost:4000/twofactorauth",
            {email:user.email, otp})
        .then(res=>{
            localStorage.setItem('token', res.data.data.token)
            dispatch(Update(res.data.data))
            navigate("/")
            document.querySelectorAll('.otp form input').forEach((input)=>{
                input.value = ''
            })
        })
        .catch(e=>{
            document.querySelectorAll('.otp form input').forEach((input)=>{
                input.value = ''
            })
            document.querySelector('.otp #error').innerHTML = `<p>${e.response.data.error}</p>`
        })
    }

    function handleReverify(){
        axios.post("http://localhost:4000/resetqr", {
            email: user.email
        }).then(()=>{
            dispatch(Update({...user, verified: false}))
            navigate("/scanqr")
        })
    }

    function moveFocus(e){
        document.querySelector('.otp #error').innerHTML = ''
        if(e.target.value.length > 0 && e.target.nextSibling){
            e.target.nextSibling.focus()
        }
    }

    if(user.id){
        return (<Navigate to="/"/>)
    } else if(!user.email){
        return (<Navigate to="/signin"/>)
    } else{
        return(
            <div className="otp">
                <h4>Please Enter The One Time Password(OTP) Generated By Your Microsoft Authenticator App</h4>
                <form className="otp-form">
                    <div id="password">
                        <input autoFocus onKeyUp={moveFocus} required type="text" id="digit-1" maxLength="1"></input>
                        <input onKeyUp={moveFocus} required type="text" id="digit-2" maxLength="1"></input>
                        <input onKeyUp={moveFocus} required type="text" id="digit-3" maxLength="1"></input>
                        <input onKeyUp={moveFocus} required type="text" id="digit-4" maxLength="1"></input>
                        <input onKeyUp={moveFocus} required type="text" id="digit-5" maxLength="1"></input>
                        <input onKeyUp={moveFocus} required type="text" id="digit-6" maxLength="1"></input>
                    </div>
                    <div id="error"></div>
                    <button type="submit" onClick={handleVerify}>Verify</button>
                </form>
                <h4 id="reverify" onClick={handleReverify}>Scan QR again?</h4>
            </div>
        )
    }
}

export default OneTimePassword