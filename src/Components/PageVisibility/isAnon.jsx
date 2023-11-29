import { useContext } from "react";
import { AuthContext } from "../../Context/auth.context";
import { useNavigate } from "react-router-dom";

export default function IsAnon({children}){
    const {isLoggedIn, isLoading} = useContext(AuthContext);
    const navigate = useNavigate()
    if(isLoading) return <p>Loading...</p>
    if(isLoggedIn){
        return navigate("/profile")
    }
    else{
        return children
    }


}