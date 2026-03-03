import React from "react";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";

const Main = ({SERVER}) => {
    const navigate = useNavigate()
    const [data, setData] = useState('null');

    useEffect(() => {
        fetch(`${SERVER}/`, { credentials: "include"}).then(
            res => res.text()
        ).then(
            data => setData(data)
        )
    }, [])

    const handleNavigateToDate = () => {
        navigate("/form", {replace: true});
    };
    const handleNavigateToRegistration = () => {
        navigate("/registration")
    }
    const handleNavigateToAuthorization = () => {
        navigate("/authorization")
    }
    const handleLogUot = async() => {
        const response = await fetch(`${SERVER}/api/logout`);
        if(!response.ok){const error = await response.text(); alert("Failed to LogOut: " + error); console.log("Failed to LogOut: " + error);}
        else{
            const result = await response.json();
            result.success ? console.log("You was LogOuted") : console.log("Unexpected Error");
        }
    }


    return(
        <div>
            {data}
            <button onClick={handleNavigateToAuthorization}>AUTHORIZATION</button>
            <button onClick={handleNavigateToRegistration}>REGISTRATION</button>
            <button onClick={handleLogUot}>LogOut</button>
        </div>
    )
}

export default Main;