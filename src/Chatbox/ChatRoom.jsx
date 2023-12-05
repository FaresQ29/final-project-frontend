import { useState, useContext, useRef, useEffect } from 'react';
import defaultImage from '../assets/profile-default.png'
import { useNavigate } from "react-router-dom";
import { db } from '../firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../Context/auth.context';
import defaultPicture from '../assets/profile-default.png'
import { query, orderBy, onSnapshot,limit } from "firebase/firestore";
export default function ChatRoom( {chatChange, chatUser}){
    const {user} = useContext(AuthContext)
    const [text, setText] = useState("")
    const [messages, setMessages] = useState(null);

    const scroll = useRef()
    
    useEffect(()=>{
        const q = query(
            collection(db, "messages"),
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

    }, [])

    const navigate = useNavigate()
    function handleClick(e){
        e.stopPropagation()
        chatChange(null)
    }
    async function handleSubmit(e){
        console.log(messages);
        const imgSrc = user.userDetails.profileImg ? user.userDetails.profileImg : defaultPicture
        e.preventDefault()
        if(text.length===0) return
        await addDoc(collection(db, "messages"), {
            text: text,
            name: user.name,
            avatar : imgSrc,
            createdAt: serverTimestamp(),
            uid: user._id
        })
        setText("");
    }

    function goToPage(userId){
        navigate("/user/" + userId)
        window.location.reload();
    }
    function handleText(e){
        setText(e.target.value)

    }

    return (
        <div className="chat-room-div">
            {chatUser && (
                <div className="chat-room-inner">
                    <button onClick={handleClick}>Back</button>
                    <p onClick={()=>goToPage(chatUser._id)}>{chatUser.name}</p>
                    <img 
                    src={chatUser.userDetails.profileImg ? chatUser.userDetails.profileImg : defaultImage} 
                    onClick={()=>goToPage(chatUser._id)}
                    />
                    <div className="chat-room-text-div">
                        {messages && (
                            messages.map((msg, i)=><Message msg={msg} key={i}/>)
                        )}
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
    return (
        <div className="chat-room-msg-div">
            <p>{msg.text}</p>
        </div>
    )
}