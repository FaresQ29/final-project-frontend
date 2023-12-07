import { AuthContext } from '../../Context/auth.context'
import {useState, useEffect, useContext, useRef} from 'react';
import './profilePageStyle.css'
import UpdatesContainer from './UpdatesContainer';
import defaultProfileImg from '../../assets/profile-default.png'
import ProfileFriendList from './ProfileFriendList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../../config';
import { UserProfileUpdate } from '../UserPage/UserPage';
import { createTodayDate } from './UpdatesContainer';
export default function ProfilePage(){
    const { user, updateUser, getAllUsers, getAllFriends} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [showRequestDrop, setShowRequestDrop] = useState(false)
    const {name, email, userDetails, friendRequests, friendList, communities} = user;
    const {dateOfBirth, profileImg, location, bio} = userDetails
    const profileImgSrc = profileImg ? profileImg : defaultProfileImg;
    const [allUsersUpdates, setAllUsersUpdates] = useState(null)
    const navigate = useNavigate();
    useEffect(()=>{
        async function getAllUpdates(){  
            try{
                setLoading(true)
                const allUsers = await getAllFriends()
                const updatesArr = []
                user.updates.forEach(u=>{
                    updatesArr.push({...u, postAuthor: user, authorId: u._id })                    
                })
                allUsers.forEach(u=>{
                    u.updates.forEach(update=>{
                        updatesArr.push({...update, postAuthor: u,authorId: u._id })
                    })
                })
                const sorted = updatesArr.sort((a, b)=>{
                    const aDate = a.postDate.split("/").reverse().join()
                    const bDate = b.postDate.split("/").reverse().join()
                    return aDate > bDate ? 1 : -1
                })
                setAllUsersUpdates(sorted);
                setLoading(false)
            }
            catch(err){
                console.log("Could not get all users");
            }
        }
        getAllUpdates()

    }, [user.updates])


    useEffect(()=>{
        window.addEventListener("click", closeDrop)
        function closeDrop(e){
            if(!e.target.closest("#friend-request-dropdown") && !e.target.closest("#add-friend-btn") ){
                setShowRequestDrop(false)
            }
        }
        return ()=>{window.removeEventListener("click", closeDrop)}
    }, [])
    async function deleteUserComment(commentObj, parentUpdate){
        try{
            setLoading(true)
            const userCopy = {...user};
            const findUpdate = userCopy.updates.find(update=>update._id === parentUpdate._id)
            findUpdate.updateComments = findUpdate.updateComments.filter(comment=>comment.commentId !== commentObj.commentId)
            await updateUser(userCopy)
            setLoading(false)

        }
        catch(err){
            console.log("Could not delete comment");
        }
  
    }
    async function editUserComment(commentObj, updateId){
        try{
            setLoading(true)
            const userCopy = {...user}
            const copyUpdates = userCopy.updates;
            const updateObj = copyUpdates.find(comm=>comm._id===updateId)
            updateObj.updateComments = updateObj.updateComments.map(comment=>comment.commentId===commentObj.commentId ? commentObj : comment )
            await updateUser(userCopy)
            setLoading(false)
            console.log("successfully edited comment");
 
        }
        catch(err){
            console.log("could not edit comment");
        }
    }
    async function updateUserComments(commentObj, commentStr){
        const obj = {
            updateCommentText: commentStr,
            commentAuthor: user.name,
            authorId: user._id,
            commentId: crypto.randomUUID(),
            date: createTodayDate()
        }
        try{
            setLoading(true)
            const userCopy = {...commentObj.postAuthor}
            const findUpdate = userCopy.updates.find(update => update._id===commentObj._id)
            findUpdate.updateComments.push(obj);
            await updateUser(userCopy)
            setLoading(false)
        }
        catch(err){
            console.log("Could not post comment. Server in error");
        }
    }
    async function handleFriendRequest(isAccept, requester){
        const requestId = requester._id
        try{    
            setLoading(true)
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

                userCopy.friendList.push(requestId)
                updateUser(userCopy)

                const requesterCopy = {...requester}
                requesterCopy.friendList.push(user._id);
                await updateUser(requesterCopy)
                console.log(`You are now friends with ${requesterCopy.name}`);

                const usersObj = {
                    user1: user._id,
                    user2: requestId
                }

                const response = await axios.post(backendUrl + "/chat/add", usersObj)
                //window.location.reload(false)
                setLoading(false)

            }
        }
        catch(err){
            console.log("friend request error", err);
        }
    }

    return (
        <div id="profile-page">
            {loading && <div id='loading-div'>Loading...</div> }
            {!loading && (
                <>
        <div className="profile-left-side">
                    <>
                    <UpdatesContainer />
                
                        {allUsersUpdates.map((elem,i) =><UserProfileUpdate 
                            key={i}
                            elem={elem} 
                            update={updateUserComments} 
                            del={deleteUserComment}
                            userId={user._id} 
                            editComment={editUserComment}/>
                         ).reverse()}
                    </>

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
                    {!loading && (<ProfileFriendList friendList={friendList} rmOptions={false}/>)}
                
            </div>                
                </>
            )}
           
        </div>
    )
}


