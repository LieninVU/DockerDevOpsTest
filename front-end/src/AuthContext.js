import {useState, useEffect, createContext, useContext } from "react";
const AuthContext = createContext(null);

function AuthProvider({children}){
    const SERVER = process.env.REACT_APP_SERVER || "http://localhost:2000";
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [date, setDate] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setAdmin] = useState(false);
    const [isActive, setActive] = useState(false);


    useEffect(() => {
        const check = async() => {
            await checkContext();
        }
        check();
    }, [])

    const setDefault = () => {
        setName("");
        setSurname("");
        setFatherName("");
        setDate("");
        setEmail("");
        setAdmin(false);
        setActive(false);
        setAuthenticated(false); 
    }

    async function checkContext(){
        try{
            const response = await fetch(`${SERVER}/api/check-authenticated`, {
                method: "GET",
                credentials: "include"
            })
            if(!response.ok){const error = await response.text(); console.log("Failed to Get an Authenticated status: "+ error); setDefault();}
            else{
                const result = await response.json();
                if(result.success){
                    setName(result.body.first_name);
                    setSurname(result.body.last_name);
                    setFatherName(result.body.father_name);
                    setDate(result.body.birth_date);
                    setEmail(result.body.email);
                    setAdmin(result.body.role==='admin');
                    setActive(result.body.is_active);
                    setAuthenticated(true);
                }
                else{ setDefault(); }
            }
        }
        catch(error){
            console.error("CheckContext Didt Receive Anything: " + error.message);
            setDefault();
        }
    }
    const handleLogUot = async() => {
    try{
        const response = await fetch(`${SERVER}/api/logout`, {
            method: "POST",
            credentials: "include"
        });
        if(!response.ok){const error = await response.text(); alert("Failed to LogOut: " + error); console.log("Failed to LogOut: " + error);}
        else{
            const result = await response.json();
            result.success ? console.log("You was LogOuted") : console.log("Unexpected Error");
        }
        checkContext();
    }
    catch(error){
            console.error("handleLogOut Didt Receive Anything: " + error.message);
    }
}
    return(
        <AuthContext.Provider value={{checkContext, isAuthenticated, setAuthenticated, name, setName, surname, setSurname, fatherName, setFatherName, date, setDate, email, setEmail, isAdmin, setAdmin, isActive, setActive, handleLogUot}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthProvider};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){throw new Error("Error with Auth Context");}
    return context;
}
export {AuthContext};