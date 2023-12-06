import { AuthContext } from "../../Context/auth.context"
import { useContext, useEffect, useState } from "react"
import defaultImage from '../../assets/profile-default.png'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { backendUrl } from "../../config"

export default function ProfileFriendList({friendList, rmOptions}){
    const {allUsers, user, updateUser} = useContext(AuthContext)
    const [friendArr, setFriendArr] = useState(null)
    const [searchVal, setSearchVal] = useState("")
    const [isOpen, setIsOpen] = useState("");

    useEffect(()=>{
        getFriends()
    },[allUsers, searchVal, user])
    function getFriends(){
        if(!allUsers) return 
        const friends = allUsers.filter(elem=>friendList.includes(elem._id))
        const searched = searchVal.length > 0 ? friends.filter(elem=>elem.name.includes(searchVal)) : friends;
        setFriendArr(searched)
    }

    async function removeFriend(friend){
        //first remove from your list
        const removeFriendListUser = user.friendList.filter(elem=>elem!==friend._id)
        const userCopy = {...user}
        userCopy.friendList = removeFriendListUser
        //remove from friend list
        const removeFriendListFriend = friend.friendList.filter(elem=>elem!==user._id)
        const friendCopy = {...friend}
        friendCopy.friendList = removeFriendListFriend
        try{
            const responseUser = await updateUser(userCopy)
            const responseFriend = await updateUser(friendCopy)
            console.log("successfully removed friend");

            //remove chat connection
            const responseChats = await axios.get(backendUrl + "/chat/list")
            const getChats = responseChats.data
  
            const findId = getChats.find((chat)=>{
                if( (chat.user1 === user._id || chat.user1 === friend._id) &&
                (chat.user2 === user._id || chat.user2 === friend._id)
                )
                return chat
            })
            await axios.delete(backendUrl+"/chat/delete/"+ findId._id)
            console.log("Successfully removed from chat model");
            
        }
        catch(err){
            console.log(err);
        }
    }
    const listClass = rmOptions ? "friend-list-user" : "";

    return (

        <div className={`friend-list-container ${listClass}`}>
            <h4 onClick={()=>setIsOpen(prev=>!prev)}>Friends {friendArr!==null && <span>({friendList.length})</span>}</h4>
            {(friendArr!==null) && (
                <>
                    <input type="text" placeholder="Search..." value={searchVal} onChange={(e)=>setSearchVal(e.target.value)} />
                    <ProfileCard friendArr={friendArr} removeFriend={removeFriend} rmOptions={rmOptions}/>
                </>
            )}

        </div>
    )
}

function ProfileCard({friendArr, removeFriend, rmOptions}){
    const [openOption, setOpenOption] = useState(null)
    const navigate = useNavigate()
    function handleClick(e){
        if(e.target.closest(".friend-card-options")) return
        const idName = e.target.id
        setOpenOption(idName.split("-").pop());
    }
    useEffect(()=>{
        window.addEventListener("click", closeOptions)
        function closeOptions(e){
            if(!e.target.closest(".friend-profile-card")){setOpenOption(null)}
        }
        return ()=>{window.removeEventListener("click", closeOptions)}
    }, [])



    return(
        <div className="friend-profile-div">{friendArr.map((elem, i)=>{
            const imgSrc = elem.userDetails.profileImg ? elem.userDetails.profileImg : defaultImage;
            return (
                <div className="friend-profile-card" onClick={handleClick} key={i} id={`friend-card-options-btn-${i}`}>
                <img src={imgSrc}/>
                <p>{elem.name}</p>
                    {(i===Number(openOption) && openOption!==null && !rmOptions) && (
                    <div className="friend-card-options">
                            <button onClick={()=>navigate("/user/"+elem._id)}>Visit</button>
                            <button>Chat</button>
                            <button onClick={()=>removeFriend(elem)}>Remove</button>                          
                    </div>
                    )}

            </div>
            )
        })}</div>

    )
}