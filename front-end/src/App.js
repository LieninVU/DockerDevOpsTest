import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Form from "./components/form"


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
            <Route path="/form" element={
                <Form/>
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