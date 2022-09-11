import React from "react"

const QRCode = ()=>(
    <div className="qr-code">
        <p>In order to protect your account from unauthorized access, we require both a password and possession of your phone to access your acount. Please install Microsoft Authenticator app through the following steps for us to verify that you have possession of your phone.</p>
        <ol>
            <li>Install the Microsoft Authenticator App from <strong>IOS App Store/Android Play Store.</strong></li>
            <li>Open the Microsoft Authenticator App.</li>
            <li>Click <strong>I agree </strong>for permissions to use the app.</li>
            <li>Click <strong>Scan a QR Code.</strong></li>
            <li>Scan the image below.</li>
        </ol>
        <img src="#" alt="QR Code"></img>
        <p>When Microsift Authenticator app displays a six-digit code, click the <strong>Continue</strong> button below.</p>
        <button id="scan-qr">Continue</button>
    </div>
)

export default QRCode;