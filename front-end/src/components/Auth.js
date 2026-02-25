import React from "react";
import { useState } from "react";

function Auth (){
    const SERVER = process.env.SERVER || "http://localhost:2000";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(Date.now());

    const handleSetEmail = (e) => {setEmail(e.target.value);}
    const handleSetPassword = (e) => {setPassword(e.target.value);}

    const handleSumbit = async (e) =>{
        e.preventDefault();
        const response = await fetch(`${SERVER}/api/auth`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, password: password  })
        });
        if (!response.ok){ console.log(`We having a problem\nStats: ${response.status}\nError: ${response.text()}`);}

    }

    return(
        <form onSubmit={handleSumbit} >
            <input type="email" name="name" placeholder="Input Your Email" required onChange={handleSetEmail}/>
            <input type="password" name="birthday" placeholder="Input Your Password" onChange={handleSetPassword} required/>
            <button type="submit">Upload Data</button>
        </form>
    )
}


export default Auth;