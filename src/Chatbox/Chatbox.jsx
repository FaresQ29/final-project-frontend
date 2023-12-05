import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/auth.context'
import './Chatbox.css'
import defaultUser from '../assets/profile-default.png'
import ChatRoom from './ChatRoom'


export default function Chatbox(){
    const [searchVal, setSearchVal] = useState("")
    const {user} = useContext(AuthContext)
    const [showChat, setShowChat] = useState(null)
  
    function chatChange(val){setShowChat(val)}
    function handleSearch(e){setSearchVal(e.target.value)}
    useEffect(()=>{
        console.log(showChat);
    }, [showChat])

    return (
        <div id="chat-box">
            {(showChat) && (
                <ChatRoom chatChange={chatChange} chatUser = {showChat} />
            )}
           <input type="text" value={searchVal} onChange={handleSearch} placeholder='Search friends'/>
           <div className="chat-box-friends-container">
                {(user && user.friendList.length>0) && (
                    user.friendList.map((friend, i)=>{
                        return <FriendCard key={i} friend={friend} chatChange={chatChange}/>
                    })
                )}
           </div>
        </div>
    )
}

function FriendCard({friend, chatChange}){
    const [friendObj, setFriendObj] = useState(null)
    const {getUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        async function getUserFromDB(){
            try{
                setLoading(true)
                const response = await getUser(friend)
                setFriendObj(response)
                setLoading(false)

            }
            catch(err){console.log("Could not find friend.");}
        }
        getUserFromDB()
    }, [])
   function handleClick(){
        chatChange(friendObj)
    }
    return (
            <div className="chat-friend-card" onClick={handleClick}>
            {!loading && (
                <>
                    <img src={friendObj.userDetails.profileImg ? friendObj.userDetails.profileImg : defaultUser} />
                    <p>{friendObj.name}</p>            
                </>
            )}

            </div>

    )
}