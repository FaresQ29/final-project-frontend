import './AuthenticationStyle.css'
import Login from './Login'
import Register from './Register'
import {useState, useEffect} from 'react'

export default function AuthModal(){
    const [modalMode, setModalMode] =useState("login")


    return (
        <div id="auth-modal">
            <button onClick={()=>setModalMode("login")}>Login</button>
            <button onClick={()=>setModalMode("register")}>Register</button>
            {modalMode==="login" && <Login />}
            {modalMode==="register" && <Register />}
        </div>
    )
}