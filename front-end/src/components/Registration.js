import React from "react";
import { useState } from "react";


function Registration (){
    const SERVER = process.env.SERVER || "http://localhost:2000"; 
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [date, setDate] = useState(Date.now());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setAdmin] = useState(false);
    const [isActive, setActive] = useState(false);


    const handleSetName = (e) => {setName(e.target.value);}
    const handleSetSurname = (e) => {setSurname(e.target.value);}
    const handleSetFatherName = (e) => {setFatherName(e.target.value);}
    const handleSetDate = (e) => {setDate(e.target.value);}
    const handleSetEmail = (e) => {setEmail(e.target.value);}
    const handleSetPassword = (e) => {setPassword(e.target.value);}
    const handleSetAdmin = (e) => {setAdmin(e.target.value);}
    const handleSetActive = (e) => {setActive(e.target.value);}
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const reasponse = await fetch(`${SERVER}/api/registration`,{
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            bosy: JSON.stringify({name: name, surname: surname, fathername: fatherName, date: date, email: email, password: password})
        })
        if(!response.ok){ console.log(`We having a problem\nStats: ${response.status}\nError: ${response.text()}`); alert("Error, you Dont Registrate Account");}

    }



    return(
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Input Your Name" required onChange={handleSetName}/>
            <input type="text" placeholder="Input Your Surname" required onChange={handleSetSurname}/>
            <input type="text" placeholder="Input Your Fathername" required onChange={handleSetFatherName}/>
            <input type="date" placeholder="Input Your Date of Birth" required onChange={handleSetDate}/>
            <input type="email" placeholder="Input Your Email" required onChange={handleSetEmail}/>
            <input type="password" placeholder="Input Your Password" required onChange={handleSetPassword}/>
            <button type="submit">Registreate</button>
        </form>
    )
    
}

export default Registration;