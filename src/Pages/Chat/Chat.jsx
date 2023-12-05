import { useContext, useState } from 'react'
import './Chat.jsx'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import { db } from '../../firebase-config.js'
import { AuthContext } from '../../Context/auth.context.jsx'
export default function Chat(){
   return (
        <div>
            
        </div>
   )
}


/*
export default function Chat(){
    const {user} = useContext(AuthContext)
    const [newMessage, setNewMessage] = useState("")

    const messagesRef = collection(db, "messages")


    async function handleSubmit(e){
 
        e.preventDefault()
        if(newMessage.length===0) return
        console.log(user);
        await addDoc(messagesRef, {
            text:newMessage,
            createdAt: serverTimestamp(),
            user: user.name,
            userId: user._id,
        })
    }
    return (
        <div className="chat-app">
            <form className='new-message-form' onSubmit={handleSubmit}>
                <input className='new-message-input' placeholder='Type message...' value={newMessage} onChange={(e)=>setNewMessage(e.target.value)}/>
                <button type='submit' className='send-button'>Enter</button>
            
            </form>
        </div>
    )
}
*/