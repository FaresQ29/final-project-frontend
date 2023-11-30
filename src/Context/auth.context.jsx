import { createContext, useContext, useEffect, useState } from "react";
import { backendUrl } from "../config";
import axios from "axios";

export const AuthContext = createContext()

export function AuthProviderWrapper({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [allUsers, setAllUsers] = useState(null)
   
    useEffect(()=>{
        authenticateUser()
    }, [])
    function storeToken(token){
        localStorage.setItem("authToken", token)
    }

    async function logoutUser(){
        localStorage.removeItem("authToken");
        authenticateUser()
    }
    async function updateUser(userObj){
        try{
            const response = await axios.put(backendUrl+`/user/add-update/${userObj._id}`, userObj )
            await authenticateUser()
        }
        catch(err){
            console.log(err);
        }
    }
    async function authenticateUser(){
        const storedToken = localStorage.getItem("authToken");
        if(!storedToken){
            setIsLoggedIn(false)
            setIsLoading(false)
            setUser(null)
        }
        else{
            try{
                const response = await axios.get(backendUrl+"/auth/verify", 
                { headers: { Authorization: `Bearer ${storedToken}`}}
                )
                setIsLoggedIn(true)
                setIsLoading(false)
                setUser(response.data.user)
            }
            catch(err){
                console.log("err at auth frontend");
                setIsLoggedIn(false)
                setIsLoading(false)
                setUser(null)
            }
        }
    }
    return(
        <AuthContext.Provider value={{isLoggedIn, isLoading, user, storeToken, authenticateUser, logoutUser, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

