import './Nav.css'
import AuthModal from '../Authentication/AuthModal'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../Context/auth.context';
import { useNavigate } from "react-router-dom";
import Chatbox from '../../Chatbox/Chatbox';
export default function Nav(){
    const [modalShow, setModalShow] = useState(true)
    const {isLoggedIn, logoutUser} = useContext(AuthContext)
    const [isChat, setIsChat] = useState(false)
    const navigate = useNavigate()
    function setModalFunc(bool){
        setModalShow(bool)
    }
    useEffect(()=>{
        window.addEventListener("click", closeModal)
        function closeModal(e){
            if(!e.target.closest("#auth-modal-container")){
                setModalShow(false)
            }
            if(!e.target.closest(".chat-nav-div")){
                setIsChat(false)
            }
        }
        return ()=>{window.removeEventListener("click", closeModal)}
    }, [])
    function handleModal(){
        setModalShow(prev=>!prev);
    }
    function logout(){
        logoutUser()
        navigate("/")
    }
    function handleChat(e){
        setIsChat(true)
    }

    return (
        <nav>
            <div id="nav-logo">FinalProject</div>
            <div id="nav-links">
                <>
                {!isLoggedIn ? (
                    <div id="auth-modal-container">
                        <button onClick={handleModal}>Login</button>
                        {modalShow && <AuthModal handleModal={setModalFunc}/>}
                    </div>
                ) : (
                    <>
                    <button onClick={()=>navigate("/profile")}>Profile</button>
                    <div className="chat-nav-div">
                        <button onClick={handleChat}>Chat</button>
                        {isChat && (
                            <Chatbox />
                        )}
                    </div>
                    <button onClick={()=>{navigate("/communities"); window. location. reload(false);}}>Communities</button>
                    <button onClick={()=>navigate("/find-users")}>Find Users</button>
                    <button onClick={logout}>Logout</button>
                    </>

                )}

                </>




            </div>
        </nav>
    )
}