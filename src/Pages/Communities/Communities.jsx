import { useState } from 'react'
import './CommunitiesStyle.css'
import CreateNewForm from './CreateNewForm'
export default function Communities(){
    const [showForm, setShowForm] = useState(false)
    function hideForm(){setShowForm(false)}
    return (
        <div id="community-div">
            {showForm && (
                <CreateNewForm hide={hideForm}/>
            )}
            <h1>Communities</h1>
            <button onClick={()=>setShowForm(true)}>Create new community</button>
            <div className="your-c">
                <h3>Your communities</h3>
                <div className="your-c-div">

                </div>
            </div>
            <div className="your-c">
                <h3>Communities you are a part of</h3>
                <div className="your-c-div">
                    
                </div>
            </div>
        </div>
    )
}