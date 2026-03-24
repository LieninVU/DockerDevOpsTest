import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Auth (){
    const SERVER = process.env.REACT_APP_SERVER || "http://localhost:2000";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { checkContext } = useAuth();
    
    const handleSetEmail = (e) => {setEmail(e.target.value);}
    const handleSetPassword = (e) => {setPassword(e.target.value);}

    const handleSumbit = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch(`${SERVER}/api/auth`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password })
            });
            if (!response.ok){ const error = await response.text(); console.log(`We having a problem\nStats: ${response.status}\nError: ${error}`);}
            else{
                alert("Authorization successful");
                console.log("Authorization successful");
                await checkContext();
                console.log("checkContext completed, navigating to /");
                navigate("/");
            }
        } catch (error) {
            console.error("Auth fetch failed: " + error.message);
        }
    }

    return(
        <form onSubmit={handleSumbit} >
            <input type="email" name="name" placeholder="Input Your Email" onChange={handleSetEmail} required/>
            <input type="password" name="birthday" placeholder="Input Your Password" onChange={handleSetPassword} required/>
            <button type="submit">Authorization</button>
        </form>
    )
}


export default Auth;