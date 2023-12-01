import './UserPageStyle.css'
import {AuthContext} from '../../Context/auth.context'
import { useContext, useEffect, useState } from 'react'
import {useParams} from 'react-router-dom';
import defaultImg from '../../assets/profile-default.png'
export default function UserPage(){
    const {getAllUsers} = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const {id} = useParams()

    useEffect(()=>{
        async function updateUsers(){
            try{
                const response = await getAllUsers();
                const foundUser = response.filter(elem=>elem._id===id)  
                setUser(foundUser[0])
    
            }
            catch(err){
                console.log("could not get users");
            }
        }
        updateUsers()
    }, [])

    return(
        <div id="user-page-container">
            {user && (
                <div className="profile-left-side">
                <h3>{user.name}</h3>
                <img src={user.userDetails.profileImg ? user.userDetails.profileImg : defaultImg} alt="main-profile-image" id="main-profile-image" />
                {user.userDetails.bio && <p>{user.userDetails.bio}</p>}
                <div className='friend-list-container'>Friends</div>
                <div className='communities-list-container'>Communities</div>
            </div>

            )}
        </div>
    )
}
