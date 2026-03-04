import {useState, useEffect, createContext, useContext } from "react";
const AuthContext = createContext(null);

function AuthProvider({children}){
    const SERVER = process.env.SERVER || "http://localhost:2000";
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


    async function checkContext(){
        const response = await fetch(`${SERVER}/api/check-authenticated`, {
            method: "GET",
            credentials: "include"
        })
        if(!response.ok){const error = await response.text(); console.log("Failed to Get an Authenticated status: "+ error); setAuthenticated(false)}
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
        }
    }
    return(
        <AuthContext.Provider value={{checkContext, isAuthenticated, setAuthenticated, name, setName, surname, setSurname, fatherName, setFatherName, date, setDate, email, setEmail, isAdmin, setAdmin, isActive, setActive}}>
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