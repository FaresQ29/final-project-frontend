import { createContext, useEffect, useState } from "react";
import { backendUrl } from "../config";
import axios from "axios";

export const ChatContext = createContext()

export function ChatProviderWrapper({children}){
    const [isChat, setIsChat] = useState(false)
    const [showChat, setShowChat] = useState(null)
    function closeChat(){
        setIsChat(false)
    }
    function handleChat(){
        setIsChat(true)
    }
    function chatChange(val){

        setShowChat(val)
    }
    return(
        <ChatContext.Provider value={
            {
                isChat,
                closeChat,
                handleChat,
                chatChange,
                showChat
            }
        }>{children} </ChatContext.Provider>
        )
}