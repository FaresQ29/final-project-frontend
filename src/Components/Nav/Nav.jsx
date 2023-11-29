import './Nav.css'
import AuthModal from '../Authentication/AuthModal'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../Context/auth.context'
export default function Nav(){
    const [modalShow, setModalShow] = useState(true)
    const {isLoggedIn, logoutUser} = useContext(AuthContext)
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

    }, [])
    function handleModal(){
        setModalShow(prev=>!prev);
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
                    <button>Profile</button>
                    <button>Chat</button>
                    <button>Communities</button>
                    <button onClick={logoutUser}>Logout</button>
                    </>

                )}

                </>




            </div>
        </nav>
    )
}