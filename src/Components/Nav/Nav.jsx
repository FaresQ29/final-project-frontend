import './Nav.css'
import AuthModal from '../../Pages/Home/Authentication/AuthModal'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../Context/auth.context';
import { useNavigate } from "react-router-dom";
import Chatbox from '../../Chatbox/Chatbox';

export default function Nav(){
    const {isLoggedIn, logoutUser} = useContext(AuthContext)
    const [isChat, setIsChat] = useState(false)
    const navigate = useNavigate()


    function handleLogout(){
        setIsChat(false)
        logoutUser()
        navigate("/");

    }
    function closeChat(){setIsChat(false)}
    function handleChat(){
        setIsChat(true)
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
                    {isChat && (<Chatbox closeChat={closeChat}/>)}
                </div>
                <button className="nav-btn" onClick={handleProfile}>Profile</button>
                <button className="nav-btn" onClick={handleCommunities}>Communities</button>
                <button className="nav-btn"  onClick={handleLogout}>Logout</button>                    
                    </>
            </div>
        </nav>
    )
}
