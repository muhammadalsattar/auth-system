import React from "react";

const OneTimePassword = ()=>(
    <div className="otp">
        <h4>Please Enter The One Time Password(OTP) Generated By Your Microsoft Authenticator App</h4>
        <form className="otp-form">
            <input type="number" id="password"></input>
            <button type="submit">Verify</button>
        </form>
    </div>
)

export default OneTimePassword