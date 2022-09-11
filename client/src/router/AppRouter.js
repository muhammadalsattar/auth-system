import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import Home from "../components/Home";
import OneTimePassword from "../components/OneTimePassword";
import QRCode from "../components/QRCode";

class AppRouter extends React.Component {
    render () {
        return (
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Signin/>}/>
                    <Route exact path="/signup" element={<Signup/>}/>
                    <Route exact path="/home" element={<Home/>}/>
                    <Route exact path="/verify" element={<OneTimePassword/>}/>
                    <Route exact path="/scanqr" element={<QRCode/>}/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default AppRouter;