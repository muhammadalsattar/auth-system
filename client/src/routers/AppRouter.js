import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import Home from "../components/Home";
import OneTimePassword from "../components/OneTimePassword";
import QRCode from "../components/QRCode";
import Email from "../components/Email";

class AppRouter extends React.Component {
    render () {
        return (
            <BrowserRouter>
                <Routes>
                    <Route exact path="/signup" element={<Signup/>}/>
                    <Route exact path="/signin" element={<Signin/>}/>
                    <Route exact path="/verify" element={<OneTimePassword/>}/>
                    <Route exact path="/scanqr" element={<QRCode/>}/>
                    <Route exact path="/confirm" element={<Email/>}/>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default AppRouter;