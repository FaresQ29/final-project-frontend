import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../Context/auth.context";
import axios from "axios";
import { backendUrl } from "../../config";

export default function UpdatesContainer(){
    const {updateUser, user, authenticateUser} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false)
    const [inputData, setInputData] = useState("");
    const [overLength, setOverLength] = useState(false);
    const maxLength = 150;



    async function handleUpdate(e){
        e.preventDefault()
        if(!inputData.length){
            //add error message
            return
        } 
        try{

            const formatDate = createTodayDate()
            const updateObj = {
                text : inputData,
                postDate: formatDate,
                updateComments: []
            }
            const newUserObj = {...user}
            newUserObj.updates.push(updateObj)
            setIsLoading(true)
            await updateUser(newUserObj)
            setIsLoading(false)
        }
        catch(err){
            //add error
            console.log("Could not add update. Error on the server.");
        }

    }
    function handleInput(e){
        const length = e.target.value.length
        if(length>maxLength){
            setOverLength(true)
            return
        }
        else{setOverLength(false) }
        setInputData(e.target.value)
    }
    return (
        <form className="updates-container">
                <div className="updates-input-container">
                    <textarea placeholder="Write an update..." value={inputData}  onChange={handleInput}/>
                    <p className={ overLength ?"invalid-length" : ""}>{inputData.length}/{maxLength}</p>
                </div>
                <button onClick={handleUpdate}>Submit update</button>
                <div id="display-updates-container">
                    {user.updates.length === 0 ? "No updates" : (
                        !isLoading && (<CreateUpdateDisplay updates={user.updates}/>)
                    )}
                </div>
        </form>
    )
}

function CreateUpdateDisplay({updates}){
    const updateMap = updates.map((elem, i)=>{
        const commentsLength = elem.updateComments.length
        return (
            <div className="updates-disp" key={i}>
                <div className="update-date-div">{elem.postDate}</div>
                <p>{elem.text}</p>
                {commentsLength===0 ? <span>No comments</span> : (
                    <button id="updates-comments-btn">Show comments {commentsLength}</button>
                )}

                <div className="updates-text-comments">

                </div>
            </div>
        )
    }).reverse()
    return(
        <>

            {updateMap}
        </>
    )
}

export function createTodayDate(){
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth()+1;
    return `${day<10 ?"0"+ day:day}/${month<10 ?"0"+ month:month}/${date.getFullYear()}`

}