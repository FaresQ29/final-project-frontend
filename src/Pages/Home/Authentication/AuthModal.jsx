import './AuthenticationStyle.css'
import Login from './Login'
import Register from './Register'
import {useState, useEffect} from 'react'

export default function AuthModal(){
    const [modalMode, setModalMode] =useState("login")
    return (
        <div id="auth-modal">
            <div id="auth-modal-btn-div">
                <button className= {modalMode==="login" ? "chosen-tab" : ""} onClick={()=>setModalMode("login")}>Login</button>
                <button className= {modalMode==="register" ? "chosen-tab" : ""} onClick={()=>setModalMode("register")}>Register</button>
            </div>
            {modalMode==="login" && <Login/>}
            {modalMode==="register" && <Register/>}
        </div>
    )
}