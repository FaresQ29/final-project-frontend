import './Nav.css'
import AuthModal from '../../Pages/Home/Authentication/AuthModal'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../Context/auth.context';
import { useNavigate } from "react-router-dom";
import Chatbox from '../../Chatbox/Chatbox';

export default function Nav(){
    const [chosenNav, setChosenNav] = useState("Profile")
    const {isLoggedIn, logoutUser} = useContext(AuthContext)
    const [isChat, setIsChat] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        window.addEventListener("click", closeModal)
        function closeModal(e){
            if(!e.target.closest(".chat-nav-div")){
                setIsChat(false)
            }
        }
        return ()=>{window.removeEventListener("click", closeModal)}
    }, [])

    function handleLogout(){
        setIsChat(false)
        logoutUser()
        navigate("/");

    }

    function handleChat(){
        setIsChat(true)
    }

    function handleProfile(){
        navigate("/profile");
        window.location.reload(false)
    }

    function handleCommunities(){
        navigate("/communities");
        window.location.reload(false)

    }
    function handleFind(){
        navigate("/find-users")
    }

    return (
        <nav className={!isLoggedIn ? "hide-nav" : ""}>
            <div id="nav-logo">CommunitySync</div>
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
