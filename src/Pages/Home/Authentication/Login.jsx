import './AuthenticationStyle.css'
import axios from 'axios';
import {useState, useContext} from 'react';
import { backendUrl } from '../../../config';
import { AuthContext } from '../../../Context/auth.context';
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [formData, setFormData] = useState({email:"", password: ""});
    const [errorMsg, setErrorMsg] = useState("");
    const {storeToken, authenticateUser} = useContext(AuthContext)

    const navigate = useNavigate();

    function handleInput(e){
        const {name, value} = e.target;
        setFormData(prev=>{
            return {...prev, [name]:value}
        })
    }
    async function handleLogin(e){
        e.preventDefault()
        try{
            const response = await axios.post(backendUrl + "/auth/login", formData)
            storeToken(response.data.authToken);
            authenticateUser()
            navigate("/profile")
            console.log("succesfully signed in");
        }
        catch(err){
            setErrorMsg(err.response.data.msg);
        }
    }
    return (
        <>
            <form>
                <div className="login-input-div">
                    <input type="text" placeholder="Email" name="email" value={formData.email} onChange={handleInput}/>
                    <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInput}/>
                </div>
                <button onClick={handleLogin}>Login</button>
            </form>
            {errorMsg && (<span className="error-msg">{errorMsg}</span>)}
            
        </>
    )
}