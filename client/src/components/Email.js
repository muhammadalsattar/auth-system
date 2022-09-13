import React, { useReducer } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Email = ()=>{
    const navigate = useNavigate()

    function handleEmailConfirm () {
        const token = window.location.search.replace("?q=", "")
        axios.get(`${process.env.REACT_APP_SERVER_URL}/confirm/${token}`).then(res=>{
            document.querySelector('.email-confirm #success').innerHTML = res.data.data;
            setTimeout(()=>{
                navigate("/signin")
            }, 3000)
        }).catch(e=>{
            document.querySelector('.email-confirm #error').innerHTML = `${e.response.data.error} You will be redirected in seconds!`
            setTimeout(()=>{
                navigate("/signin")
            }, 3000)
        })
    }

    function confirmModal (e) {
        e.preventDefault()
        document.querySelector('.resend-modal').style.display = 'none';
        axios.post(`${process.env.REACT_APP_SERVER_URL}/sendconfirmation`, {
            email: document.querySelector('.resend-modal input').value,
            client_url: window.location.origin
        }).then((res)=>{
            document.querySelector('.email-confirm #success').innerHTML = `${res.data.data} You will be redirected in seconds!`;
            setTimeout(()=>{
                navigate("/signin")
            }, 3000)
        }).catch((e)=>{
            document.querySelector('.email-confirm #error').innerHTML = `${e.response.data.error} You will be redirected in seconds!`
            setTimeout(()=>{
                navigate("/signin")
            }, 3000)
        })
    }

    function openModal () {
        document.querySelector('.resend-modal').style.display = 'flex';
    }

    if(window.location.search){
        return(
            <div className="email-confirm">
                <h4>In order to confirm your Email and access your account, Click the button below.<span id="resend-confirmation" onClick={openModal}> Resend Email?</span></h4>
                <button id="confirm-button" onClick={handleEmailConfirm}>Confirm My Email</button>
                <div id="success"></div>
                <div id="error"></div>
                <div className="resend-modal">
                <h4>Enter your Email Below.</h4>
                    <form onSubmit={confirmModal}>
                        <input type="email" required id="email"/>
                        <button id="confirm-modal" type="submit">Confirm</button>
                    </form>
                </div>
            </div>
        )
    } else {
        return(<Navigate to="/signin"/>)
    }
}

export default Email