import './Nav.css'
import AuthModal from '../Authentication/AuthModal'
import {useState, useEffect} from 'react'
export default function Nav(){
    const [modalShow, setModalShow] = useState(true)

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
                {/* Public routes */}
                <div id="auth-modal-container">
                    <button onClick={handleModal}>Login</button>
                    {modalShow && <AuthModal />}
                </div>

                {/* Private routes */}
                {/* 
                <button>Profile</button>
                <button>Chat</button>
                <button>Communities</button>
                <button>Logout</button>
                */}

            </div>
        </nav>
    )
}