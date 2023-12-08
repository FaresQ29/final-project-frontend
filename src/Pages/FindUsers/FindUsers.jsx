import './FindUsersStyle.css'
import { AuthContext } from '../../Context/auth.context'
import { useContext, useEffect, useState, } from 'react'
import defaultImg from '../../assets/profile-default.png'
import { useNavigate } from 'react-router-dom'
import Filter from './Filter'

export default function FindUsers(){
    const {getAllUsers, user, updateUser} = useContext(AuthContext)
    const [allOriginal, setAllOriginal] = useState([])
    const [allUsers, setAllUserUsers] = useState([])
    const [searchBar, setSearchBar] = useState("")
    const [filterData, setFilterData] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    useEffect(()=>{
        if(!filterData) return
        if(loading) return 
        const {gender, location, avatar} = filterData
        if(gender==="" && location==="" && avatar===false){
            syncUsers()
            return 
        }
        //filter for gender
        const filterGender= allUsers.filter(user=>{
            const userGender = user.userDetails.gender;
                if(gender!=="" && (userGender === gender) ){
                    return user
                }
                else if(gender===""){
                    return user
                }
        })
      
        const filterLocation = filterGender.filter(user=>{
            const userLocation = user.userDetails.location
            if(location===""){
                return user
            }
            if(location!=="" && userLocation!==""){
                if(userLocation.toLowerCase().includes(location.toLowerCase())){
                    return user
                }
            }
        })
        const filterAvatar = filterLocation.filter(user=>{
            const userAvatar = user.userDetails.profileImg
            if(avatar===false){
                return user
            }
            if(avatar===true && userAvatar!==""){
                return user
            }
        })
        setAllUserUsers(filterAvatar)




    }, [filterData])


    async function syncUsers(){
        setLoading(true)
        const response = await getAllUsers();
        setAllUserUsers(response)
        setAllOriginal(response)
        setLoading(false)
    }


    function applyFilter(filterObj){
        setFilterData(filterObj)
    }
    useEffect(()=>{
        syncUsers()
    }, [])
    function goToProfile(target){
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
    function checkIfRequested(reqArr){ return reqArr.includes(user._id) ? true : false }
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
            <Filter applyFilter={applyFilter}/>
            
            <div id="listed-users-container">
                {allUsers.length>0 && (
                    allUsers.map((elem, i)=>{
                        if(elem._id===user._id) return
                        const imgSrc = elem.userDetails.profileImg ? elem.userDetails.profileImg : defaultImg;
                        const classN = "listed-user-"+elem._id
                        return (
                            <div key={i} className="listed-user" id={classN} onClick={(e)=>goToProfile(e.target)}>
                                <img src={imgSrc} alt="user-profile-image"  id={classN} />
                                <h3  id={classN} >{elem.name}</h3>
                                {(checkIfRequested(elem.friendRequests) && !checkIfRequested(elem.friendList)) && (
                                    <button id="cancel-friend-list-btn" onClick={cancelFriend} className={`listed-btn-${elem._id}`} >Cancel Friend Request</button>
                                )}                              
                                {(!checkIfRequested(elem.friendRequests) && !checkIfRequested(elem.friendList)) && (
                                    <button id="add-friend-list-btn" onClick={addFriend} className={`listed-btn-${elem._id}`} >Add Friend</button>
                                )}   
                                 {(checkIfRequested(elem.friendList) && !checkIfRequested(elem.friendRequests)) && (
                                    <div className="already-friends-div" id={classN}>Friends</div>
                                )}                               
                                
                            </div>
                        )
                    })
                )}
            </div>

        </div>
    )
}