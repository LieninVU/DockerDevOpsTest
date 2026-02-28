import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Auth from "./components/Auth";
import Register from "./components/Registration";


const AppContext = ({SERVER}) => {
    const [data, setData] = useState('null');

    useEffect(() => {
        fetch(`${SERVER}/`, { credentials: "include"}).then(
            res => res.text()
        ).then(
            data => setData(data)
        )
    }, [])
    const navigate = useNavigate();


    const handleNavigateToDate = () => {
        navigate("/form", {replace: true});
    };
    const handleNavigateToRegistration = () => {
        navigate("/registration")
    }
    const handleNavigateToAuthorization = () => {
        navigate("/authorization")
    }

    return(
        <Routes>
            <Route path="/" element={
                <div>
                    {data}
                    <button onClick={handleNavigateToAuthorization}>AUTHORIZATION</button>
                    <button onClick={handleNavigateToRegistration}>REGISTRATION</button>
                </div>
            }/>
            <Route path="/authorization" element={
                <Auth/>
            }/>
            <Route path="/registration" element={
                <Register/>
            }/>
        </Routes>   
    )
}


function App ({SERVER}){
    return(
        <BrowserRouter>
            <AppContext SERVER={SERVER}/>
        </BrowserRouter>
    )
}

export default App;