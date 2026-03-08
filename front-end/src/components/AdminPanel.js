import React from "react";
import {useAuth} from '../AuthContext'
import {useState, useEffect} from "react"

const AdminPanel = () => {
    const SERVER = process.env.REACT_APP_SERVER || "http://localhost:2000";
    const [users, setUsers] = useState([]);
    const {checkContext, isAuthenticated, isAdmin} = useAuth();

    useEffect(() => {
        checkContext();
        getAllUsers();
    }, []);

    useEffect(() => {
        console.log("users обновился:", users);
    }, [users]);

    
    const getAllUsers = async() => {
        const response = await fetch(`${SERVER}/api/get-all-users`, {
            method: "GET",
            credentials: "include"
        });
        if(!response.ok){const error = await response.text(); console.log("Failed to Get an Users status: "+ error);}
        else{   
            const result = await response.json();
            console.log(result);
            const usr = result.users;
            console.log(usr);
            if(result.success){ setUsers(usr);} 
            else{ console.log("Something Went Wrong"); setUsers([]);}
            console.log(users);
        }
    }




    return(
        <div>
            {isAuthenticated && isAdmin ?
            (
                <>
                <input type="number" placeholder="Input User Id"/>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Neme</th>
                            <th>Father Name</th>
                            <th>Birth Date</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Is Active</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id || index}>
                                <td>{user.id}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.father_name}</td>
                                <td>{user.birth_date}</td>
                                <td>{user.email}</td>
                                <td>{user.password_hash}</td>
                                <td>{user.role}</td>
                                <td>{user.is_active}</td>
                                <td>{user.created_at}</td>
                                <td>{user.updated_at}</td>
                            </tr>
                        ))}
                    </tbody>
                    

                
                </table>
                </>
            ):
            (
                <div>You Dont Have Access</div>
            )
            }
        </div>
    )
}

export default AdminPanel;