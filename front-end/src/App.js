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

    return(
        <Routes>
            <Route path="/" element={
                <div>
                    {data}
                    <button>GET DATA</button>
                    <button onClick={handleNavigateToDate}>SEND DATA</button>
                </div>
            }/>
            <Route path="/auth" element={
                <Auth/>
            }/>
            <Route path="register" element={
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