import React from "react";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import { useAuth } from "../AuthContext"




const Main = ({SERVER}) => {
    const navigate = useNavigate()
    const [userId, setUserId] = useState(null);
    const [data, setData] = useState('null');
    const {isAuthenticated, checkContext, handleLogUot} = useAuth();
    
    useEffect(() => {
        checkContext();
        fetch(`${SERVER}/`, { credentials: "include"}).then(
            res => res.text()
        ).then(data => {
            console.log("Response data:", data)
            setData(data)
        }
    )
}, [])

useEffect(() => {
    const getId = async() => {
        const response = await fetch(`${SERVER}/api/get-my-id`, {
            method: "GET",
            credentials: 'include'
        }) 
        const result = await response.json();
        if(result.success){
            setUserId(result.userId);
        }
        else{
            console.log("You are not Authenticated");
        }
    }
    getId();
}, [isAuthenticated])

const handleNavigateToDate = () => {
    navigate("/form", {replace: true});
};
const handleNavigateToRegistration = () => {
    navigate("/registration")
    checkContext();
}
const handleNavigateToAuthorization = () => {
    navigate("/authorization")
    checkContext();
}

const handleBanUser = async(userId) => {
        const response = await fetch(`${SERVER}/api/delete-user/${userId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if(!response.ok){const error = await response.text(); console.log("Failed to Delete the User: " + error)}
        else{
            const result = await response.json();
            if(result.success){console.log("You Deleted a User"); handleLogUot();}
        }
    }




    return(
        <div>
            <a>{data}</a><br/>
            <a>Your id is: {userId}</a><br/>
            {isAuthenticated ? 
                (
                    <>
                    <button onClick={handleLogUot}>LogOut</button>
                    <button onClick={() => handleBanUser(userId)}>Ban Yourself</button>
                    </>

                )
            :
                (
                    <>
                    <button onClick={handleNavigateToAuthorization}>AUTHORIZATION</button>
                    <button onClick={handleNavigateToRegistration}>REGISTRATION</button>
                    </>
                )
            }
        </div>
    )
}


export default Main;