import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../Context/auth.context";


export default function UpdatesContainer(){
    const {updateUser, user, authenticateUser} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false)
    const [inputData, setInputData] = useState("");
    const [overLength, setOverLength] = useState(false);
    const maxLength = 150;
    async function handleUpdate(e){
        e.preventDefault()
        if(e.target.value.length>maxLength) return
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
            {!isLoading && (
                <>
                    <div className="updates-input-container">
                        <textarea placeholder="Write an update..." value={inputData}  onChange={handleInput}/>
                        <p className={ overLength ?"invalid-length" : ""}>{inputData.length}/{maxLength}</p>
                    </div>
                    <button onClick={handleUpdate}>Submit update</button>
                </>
            )}

        </form>
    )
}

export function createTodayDate(){
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth()+1;
    return `${day<10 ?"0"+ day:day}/${month<10 ?"0"+ month:month}/${date.getFullYear()}`

}