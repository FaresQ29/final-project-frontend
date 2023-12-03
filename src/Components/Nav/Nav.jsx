import './Nav.css'
import AuthModal from '../Authentication/AuthModal'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../Context/auth.context';
import { useNavigate } from "react-router-dom";

export default function Nav(){
    const [modalShow, setModalShow] = useState(true)
    const {isLoggedIn, logoutUser} = useContext(AuthContext)
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
    return (
        <nav>
            <div id="nav-logo">FinalProject</div>
            <div id="nav-links">
                <>
                {/* Public routes */}
                {!isLoggedIn ? (
                    <div id="auth-modal-container">
                        <button onClick={handleModal}>Login</button>
                        {modalShow && <AuthModal handleModal={setModalFunc}/>}
                    </div>
                ) : (
                    <>
                    <button onClick={()=>navigate("/profile")}>Profile</button>
                    <button onClick={()=>navigate("/chat")}>Chat</button>
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