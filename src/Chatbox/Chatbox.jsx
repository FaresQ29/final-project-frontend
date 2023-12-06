import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/auth.context'
import './Chatbox.css'
import defaultUser from '../assets/profile-default.png'
import ChatRoom from './ChatRoom'


export default function Chatbox({closeChat}){
    const [searchVal, setSearchVal] = useState("")
    const {user, getUser} = useContext(AuthContext)
    const [showChat, setShowChat] = useState(null)
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true)
    const [allFriends, getAllFriends] = useState([])
    function mouseDown(e){
        setIsDragging(true);
        let initX = e.clientX;
        let initY = e.clientY;
        
        function mouseMove(e){
          const dx = e.clientX - initX;
          const dy = e.clientY - initY;
    
          setPosition((prevPosition) => {
            const newX = Math.max(0, Math.min(window.innerWidth - 400, prevPosition.x + dx));
            const newY = Math.max(0, Math.min(window.innerHeight - 400, prevPosition.y + dy));
            return { x: newX, y: newY };
          });
    
          initX = e.clientX;
          initY = e.clientY;
        }
        function mouseUp(){
            setIsDragging(false);
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
        }
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
    }

    function chatChange(val){setShowChat(val)}
    function handleSearch(e){
        setSearchVal(e.target.value)
    
    }
    useEffect(()=>{
        async function getUsersFromDB(){
                try{
                    setLoading(true)
                    for(let i=0;i<user.friendList.length;i++){
                        const response = await getUser(user.friendList[i])
                        getAllFriends(prev=>{return [...prev, response]})
                    }
                    setLoading(false)
                }
                catch(err){
                    console.log("Could not find friend.")
                }
            }
            getUsersFromDB()
    }, [])
    return (
        <>
        <div id="outer-chat-div" style={{top: `${position.y}px`,left:`${position.x}px`}}>
                    <div className="drag-element" onMouseDown={mouseDown}>
                        <button onClick={()=>closeChat()}>X</button>
                    </div>
                    <div id="chat-box">
                        {(showChat) && (
                        <ChatRoom chatChange={chatChange} chatUser = {showChat} />
                    )}
                        <input type="text" value={searchVal} onChange={handleSearch} placeholder='Search friends'/>
                        <div className="chat-box-friends-container">
                            {(user && allFriends.length>0) && (
                            allFriends.map((friend, i)=>{
                                let show = "grid";
                                if( (!friend.name.toLowerCase().includes(searchVal.toLowerCase())) && searchVal.length>0){
                                    show= "none";
                                }
                                return <FriendCard key={i} friend={friend} chatChange={chatChange} show={show}/>
                            })
                        )}
                        </div>
                    </div>                  
        </div>
      
        </>

    )
}

function FriendCard({friend, chatChange, show}){
   function handleClick(){
        chatChange(friend)
    }
    return (
            <div className="chat-friend-card" onClick={handleClick} style={{display: show}}>
                    <img src={friend.userDetails.profileImg ? friend.userDetails.profileImg : defaultUser} />
                    <p>{friend.name}</p>            
            </div>

    )
}