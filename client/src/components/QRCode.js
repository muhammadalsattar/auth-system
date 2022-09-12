import React from "react"
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const QRCode = ()=>{
    const id = useSelector(state=>state.auth.id)
    return (id?
    <div className="qr-code">
        <p>In order to protect your account from unauthorized access, we require both a password and possession of your phone to access your acount. Please install Microsoft Authenticator app through the following steps for us to verify that you have possession of your phone.</p>
        <ol>
            <li>Install the Microsoft Authenticator App from <strong>IOS App Store/Android Play Store.</strong></li>
            <li>Open the Microsoft Authenticator App.</li>
            <li>Click <strong>I agree </strong>for permissions to use the app.</li>
            <li>Click <strong>Scan a QR Code.</strong></li>
            <li>Scan the image below.</li>
        </ol>
        <div id="qr-img"><img src="https://hexdocs.pm/qr_code/docs/qrcode.svg" alt="QR Code"></img></div>
        <p>When Microsift Authenticator app displays a six-digit code, click the <strong>Continue</strong> button below.</p>
        <button id="scan-qr">Continue</button>
    </div>
    :
    <Navigate to="/signin"/>
    )
}

export default QRCode;