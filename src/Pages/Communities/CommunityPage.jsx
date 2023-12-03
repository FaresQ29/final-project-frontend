import './CommunityPage.css'
import { useContext, useEffect, useState } from "react"
import { CommContext } from "../../Context/communities.context"
import { useParams } from "react-router-dom"
import defaultCommunity from '../../assets/community-default.png'

export default function CommunityPage(){
    const {getCommunity, communities, getCommunities} = useContext(CommContext)
    const [isLoading, setLoading] = useState(true)
    const [community, setCommunity] = useState(null)
    const {id} = useParams()

    useEffect(()=>{
        async function getInfo(){
            try{
                const response = await getCommunity(id);
                setCommunity(response)
                setLoading(false)

            }
            catch(err){
                console.log("Could not find community");
            }
        }
        getInfo()
    }, [])
    return (
        <div id="community-page">
            {!isLoading && (
                <>
                    <div className="c-page-left">
                        <h2>{community.name}</h2>
                        <img src={community.img ? community.img : defaultCommunity} />
                        <p>{community.description}</p>
                        <div className="c-page-themes-div">
                            {community.themes.map((elem,i)=><span key={i}>{elem}</span>)}
                        </div>
                        <h4>Members</h4>
                        <div className="c-page-members-div">
                            {community.members.map((elem,i)=>{
                                return <Member elem={elem} key={i} adminId={community.admin._id}/>
                            })}
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
    return (
        <div className="c-page-member-square">
            {isAdmin && ( <p>admin</p> )}
            {elem.name}
        </div>
    )
}