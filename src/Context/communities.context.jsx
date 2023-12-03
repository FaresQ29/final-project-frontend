import { createContext, useEffect, useState } from "react";

import { backendUrl } from "../config";
import axios from "axios";

export const CommContext = createContext()

export function CommProviderWrapper({children}){
    const [communities, setCommunities] = useState([])
    useEffect(()=>{
        async function startup(){
            await getCommunities()
        }
        startup()
    }, [])
    function resetCommunities(){
        setCommunities(null)
    }
    async function addCommunity(commObj){
        try{
           const response = await axios.post(backendUrl+"/community/all", commObj)
           console.log("Successfully added community");
          await getCommunities()
            return response.data
        }
        catch(err){
            console.log("Could not add community to server");
        }
    }
    async function getCommunities(){
        try{
            const response = await axios.get(backendUrl+"/community/all")
            setCommunities(response.data)
        }
        catch(err){
            console.log("Could not get communities");
        }
    }
    return(
        <CommContext.Provider value={
            {
                communities,
                addCommunity,
                resetCommunities
            }
        } >
            {children}
        </CommContext.Provider>
    )
}