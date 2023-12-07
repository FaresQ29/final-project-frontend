import './CommunityPage.css'
import { useContext, useEffect, useState } from "react"
import { CommContext } from "../../Context/communities.context"
import { AuthContext } from '../../Context/auth.context'
import { useNavigate, useParams } from "react-router-dom"
import defaultCommunity from '../../assets/community-default.png'
import defaultUser from '../../assets/profile-default.png'
import CreateNewForm from './CreateNewForm'
import { createTodayDate } from '../ProfilePage/UpdatesContainer'
import CommunityChat from './CommunityChat'
export default function CommunityPage(){
    const [showForm, setShowForm] = useState(false)
    const { user, updateUser } = useContext(AuthContext)
    const {getCommunity, editCommunity} = useContext(CommContext)
    const [isLoading, setLoading] = useState(true)
    const [community, setCommunity] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isMember, setIsMember] = useState(false)
    const {id} = useParams()
    function hideForm(){setShowForm(false)}
    console.log(id);
    useEffect(()=>{
        async function getInfo(){
            try{
                const response = await getCommunity(id);
                setCommunity(response)
                if(user._id === response.admin._id){
                    setIsAdmin(true)
                }
                const findMember = response.members.find(member=>member._id===user._id)
                findMember ? setIsMember(true) : setIsMember(false)
                setLoading(false)

            }
            catch(err){console.log("Could not find community");}
        }
        getInfo()
    }, [isLoading])

    async function handleJoin(){
        const commCopy = {...community};
        commCopy.members.push(user._id)
        const userCopy = {...user}
        userCopy.communities.push(community._id)
        try{
            setLoading(true)
            const editResponse = await editCommunity(community._id, commCopy)
            const getResponse = await getCommunity(community._id);
            const userReponse = await updateUser(userCopy)
            setCommunity(getResponse)
            setLoading(false)
            console.log("Successfully joined community");
        }
        catch(err){
            console.log("Could not join community");
        }
    }
    async function handleLeave(){
        const commCopy = {...community}
        const removeElem = commCopy.members.filter(elem=>elem._id !== user._id)
        commCopy.members = removeElem
        const userCopy = {...user}
        const removeFromUser = userCopy.communities.filter(elem=>elem._id!==community._id)
        userCopy.communities = removeFromUser
        try{
            setLoading(true)
            const editResponse = await editCommunity(community._id, commCopy)
            const getResponse = await getCommunity(community._id);
            const userReponse = await updateUser(userCopy)
            setCommunity(getResponse)
            setLoading(false)
            console.log("Successfully left community");
        }
        catch(err){
            console.log("Could not leave community");
        }
    }
    async function handleAddThread(commObj){
        try{
            setLoading(true)
            const response = await editCommunity(commObj._id, commObj)
            const updated = await getCommunity(commObj._id)
            setCommunity(updated)
            setLoading(false)
            console.log("Successfully added thread");
        }
        catch(err){
            console.log("Could not add thread");
        }
    }
    async function updateThreadComments(commentObj, contentId){

        try{
            setLoading(true)
            const communityCopy = {...community}
            const findContent = communityCopy.content.find(elem=>elem._id===contentId)
            findContent.comments.push(commentObj)
            const response = await editCommunity(communityCopy._id, communityCopy)
            console.log("Successfully posted comment");
            setLoading(false)

        }
        catch(err){
            console.log("Could not post comment");
        }

    }
    return (
        <div id="community-page">
            {showForm && (<CreateNewForm hide={hideForm} isEdit={true} commData={community}/>)}
            {(!isLoading) && (
                <>
                    <div className="c-page-left">
                        {isAdmin && (
                            <div className="c-page-admin-div">
                                <button onClick={()=>setShowForm(true)}>Admin Settings</button>
                            </div>
                        )}
                        {(isMember && !isAdmin) && (
                            <div className="c-page-non-admin-div">
                                <button onClick={handleLeave}>Leave group</button>
                            </div>                            
                            
                        )}
                        {(!isMember && !isAdmin) && (
                            <div className="c-page-non-admin-div">
                                <button onClick={handleJoin}>Join group</button>
                            </div>  
                        )}
                        <h2>{community.name}</h2>
                        <img src={community.img ? community.img : defaultCommunity} />
                        <p>{community.description}</p>
                        <div className="c-page-themes-div">
                            {community.themes.map((elem,i)=><span key={i}>{elem}</span>)}
                        </div>
                        <h4>Members</h4>
                        <div className="c-page-members-div">
                            {community.members.map((elem,i)=><Member elem={elem} key={i} adminId={community.admin._id}/>)}
                        </div>

                    </div>
                    <div className="c-page-right">
                            <Thread 
                                handleAddThread={handleAddThread}
                                community={community}
                                isMember={isMember}
                                user={user}
                                update={updateThreadComments}
                                />
                    </div>
                    <div className="c-page-chat">
                        <CommunityChat commId = {id}/>
                    </div>             
                </>

            )}
        </div>
    )
}


function Thread({handleAddThread, community, isMember, user, update}){
    const [inputData, setInputData] = useState("");
    const [overLength, setOverLength] = useState(false);
   
    const maxLength = 500;
    function handleInput(e){
        const length = e.target.value.length
        if(length>maxLength){
            setOverLength(true)
            return
        }
        else{setOverLength(false) }
        setInputData(e.target.value)
    }
    async function handleSubmit(e){
        e.preventDefault()
        if(e.target.value.length>maxLength || !inputData.length ) return
        const contentObj = {
            post: inputData,
            date: createTodayDate(),
            postAuthor: user._id,
            comments: []
        }
        const commCopy = {...community};
        commCopy.content.push(contentObj)
        try{
            await handleAddThread(commCopy)
        }
        catch(err){console.log(err);}
    }
    const isMemberClass = isMember ? "" : "disable-input-thread"
    return (
        <>
        <div className="thread-input-container">
            {!isMember && ( <div className='not-member-thread'> <span>Must join community to post...</span></div> )}
            <form className={`updates-container ${isMemberClass}`}>
                <div className="updates-input-container">
                    <textarea placeholder="Create a post..." value={inputData}  onChange={handleInput}/>
                    <p className={ overLength ?"invalid-length" : ""}>{inputData.length}/{maxLength}</p>
                </div>
                <button onClick={handleSubmit}>Submit Thread</button>
            </form>
        </div>
        <div className="thread-content-container">
            {community.content.map((elem, i)=>{
                return <ThreadContent key={i} elem={elem} update={update} community={community}/>
            }).reverse()}
        </div>
        </>

    )
}

function ThreadContent({elem, update, community}){
    const {getUser, user} = useContext(AuthContext)

    const [textbox, setTextbox] = useState("");
    const [showWrite, setShowWrite] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [author, setAuthor] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        async function getAuthor(){
            try{
                setIsLoading(true)
                const response = await getUser(elem.postAuthor)
                setAuthor(response)
                setIsLoading(false)
            }
            catch(err){
                console.log("could not get post author");
                console.log(err)
            }
        }
        getAuthor()
    }, [])
    async function handleForm(e){
        e.preventDefault();
        if(textbox.length===0) return
        const commentObj={
            userComment: textbox,
            commentAuthor: user._id,
            commentDate: createTodayDate()
        }
        try{
            await update(commentObj, elem._id)
            setTextbox("")

        }
        catch(err){
            console.log("Could not add comment");
        }

    }
    return (
        <div className="thread-content">
            {(!isLoading && author && elem) && (
                <div className='user-profile-update-div'>
                    <div className="author-div" onClick={()=>navigate("/user/"+ author._id)}>
                        <p>{author.name}</p>
                        <img src={author.userDetails.profileImg ? author.userDetails.profileImg : defaultUser} />
                    </div>
                    <span>{elem.date}</span>
                    <h4>{elem.post}</h4>
                    <div className="update-btn-comment-options">
                    <button className='update-btn-comment-btn-1' onClick={()=>setShowWrite(prev=>!prev)}>{!showWrite ? "Write comment" : "Hide"}</button>
                {showWrite && (
                    <form>
                        <textarea value={textbox} onChange={(e)=>setTextbox(e.target.value)} />
                        <button onClick={(e)=>handleForm(e, elem)}>Submit Comment</button>                               
                    </form>
                )}
                    {elem.comments.length>0 && (
                        <button className='update-btn-comment-btn-2' onClick={()=>setShowComments(prev=>!prev)}>{!showComments ? "Show comments" : "Hide comments"} {`(${elem.comments.length})`}</button>
                    )}
                    </div>

                    {showComments && (
                        <div className="up-comment-div">
                            {elem.comments.length>0 && (
                                elem.comments.map((comment, i)=>{
                                    return (
                                        <ThreadUserComment comment={comment} key={i} userId={user._id} threadId={elem._id} community={community} />
                                    )
                                })
                            )}
                        </div>
                    )}
            </div>
            )}
        </div>
    )
}

function ThreadUserComment({comment, userId, community, threadId}){
    const {getUser} = useContext(AuthContext)
    const {editCommunity} = useContext(CommContext)
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState(comment.userComment)
    const [author, setAuthor] = useState(null);
    const navigate = useNavigate()

    useEffect(()=>{
        async function syncAuthor(){
            try{
                const response = await getUser(comment.commentAuthor)
                setAuthor(response)
            }
            catch(err){
                console.log("could not get author information");
            }
        }
        syncAuthor()
    }, [])
    async function handleDelete(e){
        e.preventDefault()
        const communityCopy = {...community}
        const findThread = communityCopy.content.find(elem=>elem._id===threadId)
        const filterComment = findThread.comments.filter(elem=>elem._id!==comment._id)
        findThread.comments = filterComment
            try{
                await editCommunity(communityCopy._id, communityCopy)
                setEditMode(false)
            }
            catch(err){
                console.log("Could not delete comment");
            }
    }
    async function handleEdit(e){
        e.preventDefault()
        if(editForm.length===0){
            console.log("can't be empty");
            return
        }
        const commentCopy = {...comment};
        commentCopy.userComment = editForm
        commentCopy.editDate = createTodayDate()
        const communityCopy = {...community}
        const findThread = communityCopy.content.find(elem=>elem._id===threadId)
        const findComment = findThread.comments.map(elem=>elem._id===comment._id ? commentCopy : elem)
        findThread.comments = findComment

        communityCopy.content.map(elem=>elem._id===findThread._id ? findThread : elem)
        try{
            await editCommunity(communityCopy._id, communityCopy)
            setEditMode(false)
        }
        catch(err){
            console.log("Could not edit user");
        }


    }
    function handleCancel(e){
        e.preventDefault()
        setEditForm(comment.updateCommentText)
        setEditMode(false)
    }

    return (
        <div className="up-comment up-comment-comm">
            {author && (
                <>
                <div>
                    <img onClick={()=>navigate("/user/"+author._id)} src={author.userDetails.profileImg ? author.userDetails.profileImg : defaultUser } />
                    <p>{author.name}</p> 
                    <span>{comment.commentDate}</span>
                    {comment.editDate && (<span id="edited-up-comment">edited on {comment.editDate}</span>)}
                </div>
                {!editMode && (
                <>
                <p>{comment.userComment}</p>
                {comment.commentAuthor[0]===userId && (
                    <div className='up-comment-btn-div'>
                        <button onClick={()=>setEditMode(true)}>Edit</button>                                                
                        <button onClick={handleDelete}>Delete</button>
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
                </>

            )}
        </div>
    )
}


function Member({elem, adminId}){
    const isAdmin = elem._id === adminId
    const imgSrc = elem.userDetails.profileImg ? elem.userDetails.profileImg : defaultUser;
    const navigate= useNavigate()
    return (
        <div className="c-page-member-square" onClick={()=>navigate("/user/"+elem._id)}>
            {isAdmin && ( <span>admin</span> )}
            <p>{elem.name}</p>
            <img src={imgSrc} />
            
            

        </div>
    )
}