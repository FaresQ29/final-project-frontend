import { useState, useContext, useRef, useEffect } from 'react';

import { useNavigate } from "react-router-dom";
import { db } from '../../firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../Context/auth.context';
import defaultPicture from '../../assets/profile-default.png'
import { query, orderBy, onSnapshot,limit } from "firebase/firestore";

export default function CommunityChat({commId, isMember}){
    const {user} = useContext(AuthContext)
    const [text, setText] = useState("")
    const [messages, setMessages] = useState(null);
    const [loading, setLoading] = useState(true)
    const [isShown, setIsShown] = useState(true)
    useEffect(()=>{
        async function getChatId(){
            try{
                setLoading(true)
               await handleFirebase(commId)
               setLoading(false)
               console.log(messages);

            }
            catch(err){
                console.log("Could not enter chat room");
            }
        }
        getChatId()
        

    }, [])
    async function handleFirebase(coll){
        const q = query(
            collection(db, coll),
            orderBy("createdAt", "desc"),
            limit(50)
          );
          const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
              fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
              (a, b) => a.createdAt - b.createdAt
            );
            setMessages(sortedMessages);
          });
          return () => unsubscribe;
    }


    async function handleSubmit(e){
        const imgSrc = user.userDetails.profileImg ? user.userDetails.profileImg : defaultPicture
        e.preventDefault()
        if(text.length===0) return
        setLoading(true)
        await addDoc(collection(db, commId), {
            text: text,
            name: user.name,
            avatar : imgSrc,
            createdAt: serverTimestamp(),
            uid: user._id
        })
        setText("");
        setLoading(false)

    }

    function handleText(e){
        setText(e.target.value)
    }
    return (
        <div className ={`c-page-chat ${!isShown ? "comm-hidden-cont" : ""}`}>
            {!isMember && ( <div className="not-member-chat"> <span>Must be a member to chat</span> </div>)}
            <div id="community-chat" className={!isShown ? "comm-hidden-cont" : ""}>
                        {loading && <div>Loading...</div> }
                        {!loading && (
                            <>
                            <h2 onClick={()=>{setIsShown(prev=>!prev)}}>Community Chat <span>{isShown ?  "(hide)" : "(show)"}</span></h2>
                                <div className={`cc-text-div ${!isShown ? "comm-hidden-chat" : ""}`}>
                                    {(messages!==null && messages.length===0) && ( <div className="empty-chat-div">No chats...</div> )}
                                    {messages && (
                                        messages.map((msg, i)=>{
                                            if(!msg.createdAt) return 
                                            return <Message msg={msg} key={i}/>
                                    })
                                    )}
                            </div>
                            <form className={`cc-form-area ${!isShown ? "comm-hidden-chat" : ""}`}  >
                                    <input type="text" value={text} onChange={handleText} placeholder='Type your message'/>
                                    <button onClick={handleSubmit}>Enter</button>
                            </form>    
                            </>
                        
                        )}

            </div>            
        </div>
      
    )
}

function Message({msg}){
    const {user} = useContext(AuthContext)
    const typeClass = user._id === msg.uid ? "user-msg" : "not-user-msg";
    const [dateStr, timeStr] = formatMsgTime(msg.createdAt.seconds)
    const [showDate, setShowDate] = useState(false)
    const navigate = useNavigate()
    function show(){
        setShowDate(true)
    }
    function hide(){
        setShowDate(false)
    }
    console.log(msg);
    function goToUser(){
        navigate("/user/" + msg.uid)
        //window.location.reload();
    }
    return (
        <>
            <div className={`chat-room-msg-div ${typeClass}`}>
                <img onClick={goToUser} src={msg.avatar}/> 
                <div className="comm-chat-text-div">
                    <p onClick={goToUser}>{msg.name}</p>
                    <p>{msg.text}</p>
                </div>

                {showDate && (<span>{dateStr}</span>)}
            
                <div className="chat-time-info">
                    <p onMouseEnter={show} onMouseLeave={hide}>{timeStr}</p> 
                </div>
            </div>
        </>


    )
}

function formatMsgTime(sec){
    const date = new Date(sec*1000)
    const day = date.getDate()
    const month =date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear()
    const hour = date.getHours()
    const min = date.getMinutes()
    const dateStr = `${day} ${month}, ${year}`;
    const timeStr = `${hour<10?"0"+hour : hour}:${min<10?"0"+min : min}`
    return [dateStr, timeStr]
}