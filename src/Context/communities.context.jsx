import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import { backendUrl } from "../config";
import axios from "axios";

export const CommContext = createContext()

export function CommProviderWrapper({children}){
    const {user, updateUser} = useContext(AuthContext)
    const [communities, setCommunities] = useState([])
    useEffect(()=>{
        async function startup(){
            await getCommunities()
        }
        startup()
    }, [])
    async function addCommunity(commObj){
        try{
           await axios.post(backendUrl+"/community/all", commObj)
           console.log("Successfully added community");
           const userCopy = {...user}
           console.log(userCopy);
           userCopy.communities.push(commObj._id)
           console.log(userCopy);

           await updateUser(userCopy)
        }
        catch(err){
            console.log("Could not add community");
        }
    }
    async function getCommunities(){
        const storedToken = localStorage.getItem("authToken");
        try{
            const response = await axios.get(backendUrl+"/community/all",
            { headers: { Authorization: `Bearer ${storedToken}`}}
            )
            console.log(response.data);
            setCommunities(response.data)
        }
        catch(err){
            console.log("Could not get communities");
        }
    }
    return(
        <CommContext.Provider value={
            {
                user,
                communities,
                addCommunity
            }
        } >
            {children}
        </CommContext.Provider>
    )
}