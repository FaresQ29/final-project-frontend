import { useState, useContext, useRef, useEffect } from 'react';
import defaultImage from '../assets/profile-default.png'
import { useNavigate } from "react-router-dom";
import { db } from '../firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../Context/auth.context';
import defaultPicture from '../assets/profile-default.png'
import { query, orderBy, onSnapshot,limit } from "firebase/firestore";
import axios from 'axios';
import { backendUrl } from '../config';
import { ChatContext } from '../Context/chat.context'


export default function ChatRoom( {chatChange, chatUser}){
    const {showChat} = useContext(ChatContext)
    const {user} = useContext(AuthContext)
    const [text, setText] = useState("")
    const [messages, setMessages] = useState(null);
    const [currentChatId, setCurrentChatId] = useState(null)
    const scroll = useRef()
    
    useEffect(()=>{
        async function getChatId(){
            try{
               const response = await axios.get(backendUrl + "/chat/list")
               const chatEntry = response.data.filter(chat=>{
                if( (chat.user1 === user._id || chat.user1 === chatUser._id) && (chat.user2 === user._id || chat.user2 === chatUser._id))
                    return chat
               })
               if(!chatEntry){
                console.log("error retrieving user chat info");
               }
               setCurrentChatId(chatEntry[0]._id)

               handleFirebase(chatEntry[0]._id)
            }
            catch(err){
                console.log("Could not enter chat room");
            }
        }
        getChatId()
    }, [showChat])
    
    function handleFirebase(coll){
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

    const navigate = useNavigate()
    function handleClick(e){
        e.stopPropagation()
        chatChange(null)
    }
    async function handleSubmit(e){
        const imgSrc = user.userDetails.profileImg ? user.userDetails.profileImg : defaultPicture
        e.preventDefault()
        if(text.length===0) return
        await addDoc(collection(db, currentChatId), {
            text: text,
            name: user.name,
            avatar : imgSrc,
            createdAt: serverTimestamp(),
            uid: user._id
        })
        setText("");
        scroll.current.scrollIntoView(false);
    }

    function goToPage(userId){
        navigate("/user/" + userId)
        //window.location.reload();
    }
    function handleText(e){
        setText(e.target.value)

    }

    return (
        <div className="chat-room-div">
            {(chatUser && currentChatId) && (
                <div className="chat-room-inner">
                    <button onClick={handleClick}>Back</button>
                    <p onClick={()=>goToPage(chatUser._id)}>{chatUser.name}</p>
                    <img 
                    src={chatUser.userDetails.profileImg ? chatUser.userDetails.profileImg : defaultImage} 
                    onClick={()=>goToPage(chatUser._id)}
                    />
                    <div className="chat-room-text-div">
                        {messages && (
                            messages.map((msg, i)=>{
                                if(!msg.createdAt) return 
                                return <Message msg={msg} key={i}/>
                        })
                        )}
                    
                        <span id="scroll-ref" ref={scroll}></span>
                    </div>
                    <form>
                        <input type="text" value={text} onChange={handleText}/>
                        <button onClick={handleSubmit}>Enter</button>
                    </form>


                </div>
            )}

        </div>
    )
}

function Message({msg}){
    const {user} = useContext(AuthContext)
    const typeClass = user._id === msg.uid ? "user-msg" : "not-user-msg";
    const [dateStr, timeStr] = formatMsgTime(msg.createdAt.seconds)
    const [showDate, setShowDate] = useState(false)
    function show(){
        setShowDate(true)
    }
    function hide(){
        setShowDate(false)
    }
    return (
        <>
            <div className={`chat-room-msg-div ${typeClass}`}>
                <img src={msg.avatar}/> 
                {msg.text}
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