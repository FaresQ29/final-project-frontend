import { useState, useEffect, useContext } from 'react';
import './CommunitiesStyle.css';
import CreateNewForm from './CreateNewForm'
import { CommContext } from '../../Context/communities.context';
import { AuthContext } from '../../Context/auth.context';
import defaultCommunity from '../../assets/community-default.png'
import { useNavigate } from 'react-router-dom';

export default function Communities(){
    const {user} = useContext(AuthContext)
    const {communities} = useContext(CommContext);
    const [showForm, setShowForm] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [searchVal, setSearchVal] = useState("");
    function hideForm(){setShowForm(false)}
    function handleSearch(e){
        const val = e.target.value;
        setSearchVal(val)
    }
    useEffect(()=>{
        setIsSearching(false)
    }, [searchVal])
    return (
        <div id="community-div">
            {showForm && (<CreateNewForm hide={hideForm} isEdit={false}/>)}
            <div className="comm-left-side">
                <h1>Communities</h1>
                <button onClick={()=>setShowForm(true)}>Create new community</button>
                <div className="your-c">
                    <h3>Your communities</h3>
                    <div className="your-c-div">
                        {(communities && communities.length===0) && ( <p>You are not part of any communities...</p> )}
                        {(communities && communities.length)>0 &&(
                            communities.map((elem, i)=>{
                                const isMember = elem.members.find(member=>member._id === user._id)
                                if(!isMember) return 
                                return (<CommunityCard key={i} elem={elem}/>)
                            })
                        )}
                    </div>
                </div>
            </div>
            <div className="comm-right-side">
                <input type="text" placeholder="Search communities by name or category" onChange={handleSearch} value={searchVal}/>
                <div className="comm-display">
                    {!isSearching && (
                        communities.map((elem, i)=>{
                            const name = elem.name.toLowerCase();
                            const search = !searchVal ? "" : searchVal.toLowerCase() 
                            if(!searchCategories(search, elem.themes) && !name.includes(search)) return
                            return <CommDisp key={i} elem={elem} searchVal={searchVal}/>
                        }             
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
function searchCategories(val, themes){
    if(val.length===0) return true;
    let bool = false;
    themes.forEach(theme=>{
        if(theme.toLowerCase().includes(val)){
            return bool= true
        }
    })
    return bool
}

function CommDisp({elem}){
    const imgSrc = elem.img ? elem.img : defaultCommunity
    const navigate = useNavigate()


    return (
        <div className="comm-disp-card" onClick={()=>navigate("/communities/"+elem._id)}>
            <img src={imgSrc}/>
            <p className='comm-disp-name'>{elem.name}</p>
            <p className='comm-disp-description'>{elem.description}</p>
            <div className="comm-category-div">
                <p>Categories</p>
                <div>
                    {elem.themes.map((elem, i)=><span key={i}>{elem}</span>)}
                </div>
            </div>
            <div className="comm-members-div">
                <p>Members</p>
                <span>{elem.members.length}</span>
            </div>
        </div>
    )
}

function CommunityCard({elem}){
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const imgSrc = elem.img ? elem.img : defaultCommunity
    const isAdmin = elem.admin._id === user._id

    function handleButton(){
        navigate("/communities/"+elem._id)
    }
    return (
        <div className="community-card" onClick={handleButton}>
            {isAdmin && <span>admin</span>}
            <img src={imgSrc} />
            <p>{elem.name}</p>
        </div>
    )
}