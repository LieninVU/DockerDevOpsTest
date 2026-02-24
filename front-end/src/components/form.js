import React from "react";
import { useState } from "react";

function Form (){
    const SERVER = process.env.SERVER || "http://localhost:2000";
    const [name, setName] = useState("");
    const [date, setDate] = useState(Date.now());

    const handleSetName = (e) => {setName(e.target.value);}
    const handleSetDate = (e) => {setDate(e.target.value);}

    const handleSumbit = async (e) =>{
        e.preventDefault();
        const response = await fetch(`${SERVER}/upload-data`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: name, date: date})
        });
        if (!response.ok){ console.log(`We having a problem\nStats: ${response.status}\nError: ${response.text()}`);}

    }

    return(
        <form onSubmit={handleSumbit} >
            <input type="text" name="name" placeholder="Input Your Name" required onChange={handleSetName}/>
            <input type="date" name="birthday" placeholder="Input Your Birthday" onChange={handleSetDate} required/>
            <button type="submit">Upload Data</button>
        </form>
    )
}


export default Form;