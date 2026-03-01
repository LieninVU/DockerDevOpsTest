import React from "react";
import { useState } from "react";

function Auth (){
    const SERVER = process.env.SERVER || "http://localhost:2000";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSetEmail = (e) => {setEmail(e.target.value);}
    const handleSetPassword = (e) => {setPassword(e.target.value);}

    const handleSumbit = async (e) =>{
        e.preventDefault();
        const response = await fetch(`${SERVER}/api/auth`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, password: password })
        });
        if (!response.ok){ const error = await response.text(); console.log(`We having a problem\nStats: ${response.status}\nError: ${error}`);}
        else{ alert("Authorization successful"); console.log("Authorization successful");}

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