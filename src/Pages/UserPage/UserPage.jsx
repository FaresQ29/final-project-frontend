/* eslint-disable react/prop-types */
import './UserPageStyle.css'
import {AuthContext} from '../../Context/auth.context'
import { useContext, useEffect, useState } from 'react'
import {useParams} from 'react-router-dom';
import defaultImg from '../../assets/profile-default.png'
import ProfileFriendList from '../ProfilePage/ProfileFriendList';
import {createTodayDate} from '../ProfilePage/UpdatesContainer'
import { useNavigate } from 'react-router-dom';
export default function UserPage(){
    const {getAllUsers, updateUser, user} = useContext(AuthContext)
    const [userProfile, setUser] = useState(null)
    const {id} = useParams()
    useEffect(()=>{
        async function updateUsers(){
            try{
                const response = await getAllUsers();
                const foundUser = response.filter(elem=>elem._id===id)  
                setUser(foundUser[0])

            }
            catch(err){
                console.log("could not get users");
            }
        }
        updateUsers()
    }, [])
    async function deleteUserComment(commentObj, parentUpdate){
        try{
            const userCopy = {...userProfile};
            const findUpdate = userCopy.updates.find(update=>update._id === parentUpdate._id)
            findUpdate.updateComments = findUpdate.updateComments.filter(comment=>comment.commentId !== commentObj.commentId)
            await updateUser(userCopy)
        }
        catch(err){
            console.log("Could not delete comment");
        }
  
    }
    async function editUserComment(commentObj, updateId){

        try{
            const userCopy = {...userProfile}
            const copyUpdates = userCopy.updates;
            const updateObj = copyUpdates.find(comm=>comm._id===updateId)
            updateObj.updateComments = updateObj.updateComments.map(comment=>comment.commentId===commentObj.commentId ? commentObj : comment )
            await updateUser(userCopy)
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
            const userCopy = {...userProfile}
            const findUpdate = userCopy.updates.find(update => update._id===commentObj._id)
            findUpdate.updateComments.push(obj);
            await updateUser(userCopy)
        }
        catch(err){
            console.log("Could not post comment. Server in error");
        }
    }
    function isS(){
        if(!userProfile) return
        return userProfile.name.split("").pop().toLowerCase()==="s" ? userProfile.name + `'` : userProfile.name + `'s`;
    }
    return(
        <div id="user-page-container">
            {userProfile && (
                <>
                    <div className="user-profile-head">
                        <h3>{userProfile.name}</h3>
                        <img src={userProfile.userDetails.profileImg ? userProfile.userDetails.profileImg : defaultImg} alt="main-profile-image" id="main-profile-image" />
                        {(userProfile.userDetails.bio || userProfile.userDetails.location) && (
                            <div className="user-profile-more-info">
                                {userProfile.userDetails.bio && <p>{userProfile.userDetails.bio}</p>}
                                {userProfile.userDetails.location && <p>{userProfile.userDetails.location}</p>}                              
                            </div>
                        )}
                        <ProfileFriendList friendList={userProfile.friendList} rmOptions={true}/> 
                    </div>
                    <div className="user-profile-body">
                       {userProfile.updates.length===0 && (
                            <h3 className="user-page-no-updates">User has not posted any updates...</h3>
                       )}
                       {userProfile.updates.length>0 && (
                        <>
                            <p>{isS()} posts</p>
                            {userProfile.updates.map((elem,i) =><UserProfileUpdate key={i} elem={elem} update={updateUserComments} del={deleteUserComment} userId={user._id} editComment={editUserComment}/>)}
                        </>
                       )}
                    </div>
                </>
            )}
        </div>
    )
}


export function UserProfileUpdate({elem, update, del, userId, editComment}){
    const [textbox, setTextbox] = useState("");
    const [showWrite, setShowWrite] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [isProfile, setIsProfile] = useState(false)
    const navigate = useNavigate();
    function handleDelete(comment){del(comment, elem)}
    async function handleForm(e, comment){
        e.preventDefault();
        await update(comment, textbox)
        setTextbox("")
    }   
    useEffect(()=>{
        if(elem.postAuthor){
            setIsProfile(true)
        }
    }, [])
    function handleNavClick(){
        navigate("/user/"+elem.postAuthor._id)
    }
    return (
            <div className='user-profile-update-div'>
                {isProfile && (
                    <div className="up-author-div" onClick={handleNavClick}>
                        <img src={elem.postAuthor.userDetails.profileImg ? elem.postAuthor.userDetails.profileImg : defaultImg}/>
                        <p>{elem.postAuthor.name}</p>
                    </div>
                )}
                <span>{elem.postDate}</span>
                <h4>{elem.text}</h4>
                <div className="update-btn-comment-options">
                    <button className="update-btn-comment-btn-1" onClick={()=>setShowWrite(prev=>!prev)}>{!showWrite ? "Write comment" : "Hide"}</button>
                    {showWrite && (
                        <form>
                            <textarea value={textbox} onChange={(e)=>setTextbox(e.target.value)} />
                            <button onClick={(e)=>handleForm(e, elem)}>Submit Comment</button>                               
                        </form>
                    )}
                    {elem.updateComments.length>0 && (
                        <button className="update-btn-comment-btn-2" onClick={()=>setShowComments(prev=>!prev)}>{!showComments ? "Show comments" : "Hide comments"} {`(${elem.updateComments.length})`}</button>
                    )}
                </div>

                {showComments && (
                    <div className="up-comment-div">
                        {elem.updateComments.length>0 && (
                            elem.updateComments.map((comment, i)=>{
                                return (
                                    <UserComment
                                        comment={comment}
                                        handleDelete={handleDelete}
                                        key={i}
                                        userId={userId}
                                        updateObj={elem}
                                        editComment={editComment}
                                    />
                                )
                            })
                        )}
                    </div>
                )}
            </div>
    )
}



function UserComment({comment, handleDelete, userId, updateObj, editComment}){
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState(comment.updateCommentText)
    const [isOpac, setIsOpac] = useState(false)
    async function handleEdit(e){
        e.preventDefault()
        if(editForm.length===0){
            console.log("can't be empty");
            return
        }
        const commentCopy = {...comment};
        commentCopy.updateCommentText = editForm
        commentCopy.editDate = createTodayDate()
        await editComment(commentCopy, updateObj._id)
        setEditMode(false)

    }
    function handleCancel(e){
        e.preventDefault()
        setEditForm(comment.updateCommentText)
        setEditMode(false)
    }
   
    return (
        <div className="up-comment">
            <h3>{comment.commentAuthor}
                <span>{comment.date}</span>
                {comment.editDate && (<span>edited on {comment.date}</span>)}
            </h3>
            {!editMode && (
                <>
                    <p>{comment.updateCommentText}</p>
                    {comment.authorId === userId && (
                        <div className={`up-comment-btn-div ${isOpac}`} onMouseEnter={()=>setIsOpac("select-comment-div")}  onMouseLeave={()=>setIsOpac("")}>
                            <button onClick={()=>setEditMode(true)}>Edit</button>                                                
                            <button onClick={()=>handleDelete(comment)}>Delete</button>
                        </div>
                    )}                
                </>
            )}
            {editMode && (
                <form>
                    <textarea value={editForm} onChange={(e)=>setEditForm(e.target.value)}></textarea>
                    <div className='up-comment-btn-edit-div'>
                        <button onClick={(e)=>handleEdit(e)}>Save</button>
                        <button onClick={(e)=>handleCancel(e)}>Cancel</button>
                    </div>

                </form>
            )}
        </div>
    )
}