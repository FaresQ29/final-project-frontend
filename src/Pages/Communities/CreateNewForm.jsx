import { useContext, useState } from "react"
import './CommunitiesFormStyle.css'
import themesData from './themesData'
import { CommContext } from "../../Context/communities.context";
import { AuthContext } from "../../Context/auth.context";
import {createTodayDate} from '../ProfilePage/UpdatesContainer'
import { useNavigate, useParams } from "react-router-dom";

export default function CreateNewForm({hide, isEdit, commData}){
    const {communities, addCommunity, editCommunity, deleteCommunity} = useContext(CommContext)
    const {user, updateUser} = useContext(AuthContext)
    const [showTheme, setShowTheme] = useState(false);
    const [chosenThemes, setChosenThemes] = useState([]);
    const {id} = useParams()
    const navigate = useNavigate()
    const [formError, setFormError] = useState({
        name: false,
        description: false,
        themes:false
    })
    
    const [formData, setFormData] = useState({
        name: commData ? commData.name : "",
        img: commData ? commData.img : "",
        description: commData ? commData.description : "",
        themes: commData ? commData.themes : "",
    })
    async function handleDelete(e){
        e.preventDefault()
        try{
            await deleteCommunity(id)
            navigate("/communities")
            window.location.reload(false);
            console.log("Successfully deleted community");
        }
        catch(err){
            console.log("Could not delete community");
        }

    }

    async function handleSubmit(e){
        e.preventDefault()
        if(formData.name.length===0){
            console.log("name is mandatory");
            setFormError(prev=>{return {...prev, name:true}})
            return
        }
        else{setFormError(prev=>{return {...prev, name:false}})}
        if(formData.description.length===0){
            console.log("description is mandatory");
            setFormError(prev=>{return {...prev, description:true}})
            return
        }
        else{setFormError(prev=>{return {...prev, description:false}})}
        if(formData.themes.length===0){
            console.log("Choose at least one theme");
            setFormError(prev=>{return {...prev, themes:true}})
            return
        }
        else{setFormError(prev=>{return {...prev, themes:false}})}
        
        const obj = 
            {
                ...formData,
                dateCreated: createTodayDate(),
                admin: user._id,
                members: [user._id],
                content: []
            }
        
        try{
            if(!isEdit){
                const response = await addCommunity(obj)
                const userCopy = {...user}
                userCopy.communities.push(response)
                await updateUser(userCopy)
                hide()
                navi
            }
            else{
                const editObj = {...formData}
                const response = await editCommunity(id, editObj)
                hide()
                window.location.reload(false);
                console.log("Sucesfully edited community");
            }

        }
        catch(err){
            console.log("Could not add/edit community ");
        }
        
    }
    function handleForm(e){
        const {name, value} = e.target;
        setFormData(prev=>{
            return {...prev, [name]:value}
        })
    }
    function showThemeFunc(e){
        if(!e.target.closest(".theme-picker-div")){
            setShowTheme(true)
        }
    }
    function cancelTheme(e){
        e.preventDefault()
        setShowTheme(false)
    }
    function saveTheme(e){
        e.preventDefault()
        if(chosenThemes.length===0) return
        setFormData(prev=>{
            return {...prev, themes:chosenThemes}
        })
        setShowTheme(false)
    }
    function handleThemeBtn(e){
        const val = e.target.innerText;
        if(!chosenThemes.includes(val)){
            if(chosenThemes.length>=5) return 
            setChosenThemes(prev=>{
                return [...prev, val]
            })
        }
        else{
            setChosenThemes(prev=>{
                const copy = [...prev]
                const index = copy.indexOf(val)
                copy.splice(index, 1)
                return copy
            })
        }

    }
    function closeTheme(e){
        if(showTheme && !e.target.closest(".theme-picker-div")){
            setShowTheme(false)
        }
    }
    return (
        <>
            <div id="c-form-bg" onClick={hide}></div>
            <form id="community-form" onClick={(e)=>closeTheme(e)}>
                <div className={`c-form-entry ${!formError.name?"":"c-form-entry-error"}`}>
                    <label htmlFor="c-name">Name*</label>
                    <input onChange={handleForm} value={formData.name} name="name" id="c-name" type="text" placeholder="Name your community..."/>
                </div>

                <div className={`c-form-entry ${!formError.description?"":"c-form-entry-error"}`}>
                    <label htmlFor="c-desc">Description*</label>
                    <input onChange={handleForm} value={formData.description} name="description" type="text" id="c-desc" placeholder="Write a community description..."/>                   
                </div>
                <div className="c-form-entry">
                    <label htmlFor="c-image">Image</label>
                    <input onChange={handleForm} value={formData.img} name="img"  type="text" id="c-image" placeholder="Enter an image url..."/>                   
                </div>               
                <div className={`c-form-entry c-form-theme ${!formError.themes?"":"c-form-entry-error"}`} onClick={(e)=>showThemeFunc(e)}>
                    <label>Add a community theme*</label>
                    <div>
                        {formData.themes.length===0 ? (
                            <span>Pick at least one theme</span>
                        ): (
                            formData.themes.map((val, i)=>{
                                return (
                                    <span className="form-theme-val" key={i}>{val}</span>
                                )
                            })
                        )}
                    </div>
                </div>
                {showTheme && (
                        <div className="theme-picker-div">
                            <div className="themes-container">
                                {themesData.map((theme, i)=>{
                                    return (
                                        <div className="theme-category" key={i}>
                                            <p>{theme.topicCategory}</p>
                                            <div className="theme-category-container">
                                                {theme.topics.map((themeName, x)=>{
                                                    const classN = chosenThemes.includes(themeName) ? "theme-btn-selected" : "";
                                                    return (
                                                        <span onClick={(e)=>handleThemeBtn(e)} className={`theme-btn ${classN}`} key={x}>{themeName}</span>
                                                    )
                                                })}
                                            </div>
                                        </div>  
                                    )                                  
                                })}
                            </div>
                            <span className="theme-length-div">{chosenThemes.length}/5</span>
                            <div className="themes-check-div">
                                {chosenThemes.length===0 ? (
                                    <p>Choose at least one theme</p>
                                ) : 
                                    <>
                                        {chosenThemes.map((elem, i)=>{
                                            let str= "";
                                            if(i===chosenThemes.length-1){str="."}
                                            else if(i===chosenThemes.length-2){str=" and "}
                                            else{str=", "}
                                            return (<span key={i}>{elem + str}</span>)
                                        })}
                                        <div onClick={()=>setChosenThemes([])}>Clear</div>                                  
                                    </>
                                }
                            </div>
                            <div className="tp-btn-div">
                                <button onClick={(e)=>saveTheme(e)}>Save</button>
                                <button onClick={(e)=>cancelTheme(e)}>Cancel</button>
                            </div>
                        </div>
                    )}
                    {!isEdit && (
                        <button onClick={handleSubmit}>Create Community</button>

                    )}
                    {isEdit && (
                        <>
                            <button onClick={handleSubmit}>Edit Community</button>
                            <button onClick={handleDelete}>Delete Community</button>
                        </>

                    )}
            </form>        
        </>

    )
}

