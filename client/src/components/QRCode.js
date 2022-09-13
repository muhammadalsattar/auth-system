import React, { useEffect } from "react"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import qrcode from 'qrcode'
import { Update } from "../actions/auth";


const QRCode = ()=>{
    const user = useSelector(state=>state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Set qrcode img src
    useEffect(()=>{
        qrcode.toDataURL(user.otpauth_url, (err, data_url)=>{
            document.querySelector("#qr-img img")?.setAttribute("src", data_url)
        })
    })

    function handleScan (e){
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/verifyqr`,{
            email: user.email
        }).then((res)=>{
            dispatch(Update(res.data.data))
            navigate("/verify")
        })
    }
    
    if (!user.email){
        return (<Navigate to="/signin"/>)
    } else if (user.verified){
        return (<Navigate to="/verify"/>)
    } else {
        return (
            <div className="qr-code">
                <p>In order to protect your account from unauthorized access, we require both a password and possession of your phone to access your acount. Please install Microsoft Authenticator app through the following steps for us to verify that you have possession of your phone.</p>
                <ol>
                    <li>Install the Microsoft Authenticator App from <strong>IOS App Store/Android Play Store.</strong></li>
                    <li>Open the Microsoft Authenticator App.</li>
                    <li>Click <strong>I agree </strong>for permissions to use the app.</li>
                    <li>Click <strong>Scan a QR Code.</strong></li>
                    <li>Scan the image below.</li>
                </ol>
                <div id="qr-img"><img src="" alt="QR Code"></img></div>
                <p>When Microsift Authenticator app displays a six-digit code, click the <strong>Continue</strong> button below.</p>
                <button id="scan-qr" onClick={handleScan}>Continue</button>
            </div>
        )
    }
}

export default QRCode;