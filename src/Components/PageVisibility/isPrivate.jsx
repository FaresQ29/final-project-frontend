import { useContext } from "react";
import { AuthContext } from "../../Context/auth.context";


export default function IsPrivate({children}){
    const {isLoggedIn, isLoading} = useContext(AuthContext);
    if(isLoading) return <p>Loading...</p>
    if(isLoggedIn){
        return children
    }

}