import './Nav.css'
import AuthModal from '../../Pages/Home/Authentication/AuthModal'
import {useState, useEffect, useContext, createContext} from 'react'
import { AuthContext } from '../../Context/auth.context';
import { useNavigate } from "react-router-dom";
import { ChatContext } from '../../Context/chat.context';
import Chatbox from '../../Chatbox/Chatbox';



export default function Nav(){
    const {isLoggedIn, logoutUser} = useContext(AuthContext)
    const {closeChat, handleChat, isChat} = useContext(ChatContext)
    const navigate = useNavigate()

    function handleLogout(){
        closeChat()
        logoutUser()
        navigate("/");

    }
 
    function handleProfile(){
        navigate("/profile");
    }

    function handleCommunities(){
        navigate("/communities");

    }
    function handleFind(){
        navigate("/find-users")
    }

    return (
        <nav className={!isLoggedIn ? "hide-nav" : ""}>
            <div id="nav-logo" onClick={()=>navigate("/profile")}>CommunitySync</div>
            <div id="nav-links">
            <>
                <button className="nav-btn" onClick={handleFind}>Find Users</button>

                <div className="chat-nav-div">
                    <button className="nav-btn" onClick={handleChat}>Chat</button>
                    {isChat && (<Chatbox />)}
                </div>
                <button className="nav-btn" onClick={handleProfile}>Profile</button>
                <button className="nav-btn" onClick={handleCommunities}>Communities</button>
                <button className="nav-btn"  onClick={handleLogout}>Logout</button>                    
                    </>
            </div>
        </nav>
    )
}
