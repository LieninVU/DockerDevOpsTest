import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Auth from "./components/Auth";
import Register from "./components/Registration";
import {AuthProvider, useAuth} from "./AuthContext";
import Main from "./components/Main";

const App = ({SERVER}) => {
    return(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <Main SERVER={SERVER}/>
                    }/>
                    <Route path="/authorization" element={
                        <Auth/>
                    }/>
                    <Route path="/registration" element={
                        <Register/>
                    }/>
                </Routes> 
            </BrowserRouter>  
        </AuthProvider>
    )
}


export default App;