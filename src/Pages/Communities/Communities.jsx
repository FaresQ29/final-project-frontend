import { useState, useEffect, useContext } from 'react';
import './CommunitiesStyle.css';
import CreateNewForm from './CreateNewForm'
import { CommContext } from '../../Context/communities.context';
export default function Communities(){
    const {communities} = useContext(CommContext);
    const [showForm, setShowForm] = useState(false)
    function hideForm(){setShowForm(false)}
    return (
        <div id="community-div">
            {showForm && (<CreateNewForm hide={hideForm}/>)}
            <div className="comm-left-side">
                <h1>Communities</h1>
                <button onClick={()=>setShowForm(true)}>Create new community</button>
                <div className="your-c">
                    <h3>Your communities</h3>
                    <div className="your-c-div">
                        {communities.length===0 && ( <p>You are not part of any communities...</p> )}
                        {communities.length>0 &&(
                            communities.map((elem, i)=>{
                                return (
                                    <CommunityCard key={i} elem={elem}/>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
            <div className="comm-right-side">
                <input type="text" placeholder="Search communities..." />
                <div className="comm-filter-div">

                </div>
                <div className="comm-display">

                </div>
            </div>
        </div>
    )
}

function CommunityCard({elem}){
    console.log(elem);
    return (
        <div className="community-card">

        </div>
    )
}