import './FindUsersStyle.css'
import { AuthContext } from '../../Context/auth.context'
import { useContext, useEffect, useState, } from 'react'
import defaultImg from '../../assets/profile-default.png'
import { useNavigate } from 'react-router-dom'

export default function FindUsers(){
    const {getAllUsers, user, updateUser} = useContext(AuthContext)
    const [allUsers, setAllUserUsers] = useState([])
    const [searchBar, setSearchBar] = useState("")
    const navigate = useNavigate();

    //left off at searchbar
    useEffect(()=>{
        async function syncUsers(){
            const response = await getAllUsers();
            setAllUserUsers(response)
        }
        syncUsers()
    }, [])
    function goToProfile(target){
        //so add friends btn doesn't redirect you
        if(target.id!=="add-friend-list-btn" && target.id!=="cancel-friend-list-btn" ){
            const targetId = target.id.split("-")[2]
            navigate(`/user/${targetId}`)
        }
    }
    async function addFriend(e){
        const id = e.target.className.split("-")[2]
        try{
            const selectedUser = allUsers.filter(elem=>elem._id===id)[0]
            const userCopy = {...selectedUser};
            userCopy.friendRequests.push(user._id)
            await updateUser(userCopy)
            console.log("friend request added");

        }
        catch(err){
            console.log("could not add friend");
        }
    }
    async function cancelFriend(e){
         e.preventDefault()
     
        try{
            const id = e.target.className.split("-")[2]
            const selectedUser = allUsers.filter(elem=>elem._id===id)[0]
            const userCopy = {...selectedUser};
            const indexOfMyId = userCopy.friendRequests.indexOf(user._id)
            userCopy.friendRequests.splice(indexOfMyId, 1)
            await updateUser(userCopy)
            console.log("canceled friend request");

        }
        catch(err){
            console.log("could not cancel friend request");
        }
    }
    function checkIfAlreadyRequested(reqArr){ return reqArr.includes(user._id) ? true : false }
    async function handleSearchbar(e){
        const text = e.target.value
        setSearchBar(text)
        try{
            const response = await getAllUsers(text);
            setAllUserUsers(response)
        }
        catch(err){
            console.log("Could not retrieve users. Error in server");
        }




    }
    return (
        <div id="find-users-container">
            <input id="find-user-input" type="text" placeholder='Search for user' value={searchBar} onChange={handleSearchbar}/>
            <div id="listed-users-container">
                {allUsers.length>0 && (
                    allUsers.map((elem, i)=>{
                        const imgSrc = elem.userDetails.profileImg ? elem.userDetails.profileImg : defaultImg;
                        return (
                            <div key={i} className='listed-user' id={`listed-user-${elem._id}`} onClick={(e)=>goToProfile(e.target)}>
                                <img src={imgSrc} alt="user-profile-image" />
                                <h3>{elem.name}</h3>
                                {checkIfAlreadyRequested(elem.friendRequests) && (
                                    <button id="cancel-friend-list-btn" onClick={cancelFriend} className={`listed-btn-${elem._id}`} >Cancel Friend Request</button>
                                )}
                                {checkIfAlreadyRequested(elem.friendList) && (
                                    <div className="already-friends-div">Already friends</div>
                                )}                                
                                {!checkIfAlreadyRequested(elem.friendRequests) && (
                                    <button id="add-friend-list-btn" onClick={addFriend} className={`listed-btn-${elem._id}`} >Add Friend</button>
                                )}                                
                                
                            </div>
                        )
                    })
                )}
            </div>

        </div>
    )
}