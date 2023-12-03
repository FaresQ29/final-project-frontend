import './CommunityPage.css'
import { useContext, useEffect, useState } from "react"
import { CommContext } from "../../Context/communities.context"
import { AuthContext } from '../../Context/auth.context'
import { useNavigate, useParams } from "react-router-dom"
import defaultCommunity from '../../assets/community-default.png'
import defaultUser from '../../assets/profile-default.png'
import CreateNewForm from './CreateNewForm'
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

                    </div>                
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