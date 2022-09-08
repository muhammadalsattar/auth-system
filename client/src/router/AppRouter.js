import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signin from "../components/Signin";

class AppRouter extends React.Component {
    render () {
        return (
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Signin/>}/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default AppRouter;