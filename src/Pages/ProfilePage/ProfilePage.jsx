import { AuthContext } from '../../Context/auth.context'
import {useState, useEffect, useContext, useRef} from 'react';
import './profilePageStyle.css'
import UpdatesContainer from './UpdatesContainer';
import defaultProfileImg from '../../assets/profile-default.png'
import ProfileFriendList from './ProfileFriendList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../../config';
export default function ProfilePage(){
    const {isLoading, user, updateUser} = useContext(AuthContext)
    const [showRequestDrop, setShowRequestDrop] = useState(false)
    const {name, email, userDetails, friendRequests, friendList, communities} = user;
    const {dateOfBirth, profileImg, location, bio} = userDetails
    const profileImgSrc = profileImg ? profileImg : defaultProfileImg;

    const navigate = useNavigate();
    useEffect(()=>{
        window.addEventListener("click", closeDrop)
        function closeDrop(e){
            if(!e.target.closest("#friend-request-dropdown") && !e.target.closest("#add-friend-btn") ){
                setShowRequestDrop(false)
            }
        }
        return ()=>{window.removeEventListener("click", closeDrop)}
    }, [])

    async function handleFriendRequest(isAccept, requester){
        const requestId = requester._id
        try{    
            const removeRequest = friendRequests.filter(elem=>{
                return elem._id !== requestId
            })
            const userCopy = {...user}
            userCopy.friendRequests = removeRequest;

            if(!isAccept){
                await updateUser(userCopy)
                console.log("successfully removed user");
                return;
            }
            else{
                //updates logged in users friend list
                userCopy.friendList.push(requestId)
                updateUser(userCopy)
                //updates the requester's friendlist
                const requesterCopy = {...requester}
                requesterCopy.friendList.push(user._id);
                await updateUser(requesterCopy)
                console.log(`You are now friends with ${requesterCopy.name}`);

                //to create the Chat schema
                const usersObj = {
                    user1: user._id,
                    user2: requestId
                }

                const response = await axios.post(backendUrl + "/chat/add", usersObj)
                window.location.reload(false)
            }
        }
        catch(err){
            console.log("friend request error", err);
        }
    }

    return (
        <div id="profile-page">
            <div className="profile-left-side">
                <UpdatesContainer />
            </div>
            <div className="profile-right-side">
                    <div className="profile-edit-div">
                        <button id="add-friend-btn" onClick={()=> setShowRequestDrop(prev=>!prev)}>Friend Requests 
                            {friendRequests.length>0 && (<span id="friend-request-badge">{friendRequests.length}</span>)}
                        </button>                          
                        <button onClick={()=>navigate("/edit-user")}>Edit Profile</button>
                        <button onClick={()=>navigate("/user/"+user._id)}>Preview Profile</button>
                    </div>
                    {(showRequestDrop && friendRequests.length>0 ) && (
                    <div id='friend-request-dropdown'>
                        {friendRequests.map((request, i)=>{
                            const imgSrc = request.userDetails.profileImg ? request.userDetails.profileImg : defaultProfileImg;
                            return (
                                <div key={i} className="fr-dropdown-element">
                                    <img src={imgSrc}/>
                                    <p>{request.name}</p>
                                    <div className='dropdown-btn-div'>
                                        <button onClick={()=>handleFriendRequest(true, request)}>✓</button>
                                        <button onClick={()=>handleFriendRequest(false, request)}>X</button>
                                    </div>
                                </div>
                            )
                         })}   
                    </div>
                    )}

                <h3>{name}</h3>
                <img src={profileImgSrc} alt="main-profile-image" id="main-profile-image" />
                    {bio && <p>{bio}</p>}
                <ProfileFriendList friendList={friendList} rmOptions={false}/>
            </div>
        </div>
    )
}


