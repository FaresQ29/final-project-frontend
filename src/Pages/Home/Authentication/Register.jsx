import './AuthenticationStyle.css'
import axios from 'axios';
import {useState, useContext} from 'react';
import { backendUrl } from '../../../config';
import { AuthContext } from '../../../Context/auth.context';
import { useNavigate } from "react-router-dom";

export default function Register(){
    const [formData, setFormData] = useState({name:"",email:"", password: ""});
    const [errorMsg, setErrorMsg] = useState("");
    
    const {storeToken, authenticateUser} = useContext(AuthContext)


    const navigate = useNavigate()

    function handleInput(e){
        const {name, value} = e.target;
        setFormData(prev=>{
            return {...prev, [name]:value}
        })
    }

    async function handleRegister(e){
        e.preventDefault()
        try{
            const response = await axios.post(backendUrl + "/auth/register", formData)
            storeToken(response.data.authToken);
            authenticateUser()
            navigate("/profile")

            console.log("succesfully registered");
        }
        catch(err){
            console.log("err: " + err);
            setErrorMsg(err.response.data.msg);
        }
    }
    return (
        <form>
                <input type="text" placeholder="Username" name="name" value={formData.name} onChange={handleInput}/>
                <input type="text" placeholder="Email" name="email" value={formData.email} onChange={handleInput}/>
                <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInput}/>
                <button onClick={handleRegister}>Register</button>
            {errorMsg && (<span className="error-msg">{errorMsg}</span>)}

        </form>
    )
}