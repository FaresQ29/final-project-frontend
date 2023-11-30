import './EditPageStyle.css';
import { AuthContext } from '../../Context/auth.context';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditPage(){
    const {user, updateUser} = useContext(AuthContext)
    const {bio, dateOfBirth, location, profileImg} = user.userDetails;
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: user.name,
        bio: bio,
        dateOfBirth: dateOfBirth,
        location:location,
        profileImg:profileImg
    })
    async function handleForm(e){
        e.preventDefault()
        //form validation
        if(formData.name===""){
            setErrMsg("Name can't be empty")
            return
        }
        if(formData.name.length>50){
            setErrMsg("Name max characters: 50")
            return
        }
        if(formData.bio.length>150){
            setErrMsg("Bio max characters: 150")
            return
        }
        if(!dateRegex(formData.dateOfBirth) && formData.dateOfBirth.length>0){
            setErrMsg("Invalid Date")
            return
        }
        if(formData.location.length>50){
            setErrMsg("Location max characters: 50")
            return
        }
        if(!urlRegex(formData.profileImg) && formData.profileImg.length>0){
            setErrMsg("Invalid profile url")
            return
        }
        try{
            const userCopy = {...user}
            userCopy.userDetails = formData;
            userCopy.name = formData.name
            await updateUser(userCopy)
            navigate("/profile")
            
        }
        catch(err){
            setErrMsg("Could not edit user. Server error")
        }


    }
    function handleInput(e){
        const {name, value} = e.target;
        setFormData(prev=>{return {...prev, [name]:value}})
    }

    return (
        <form id="edit-page-form">
            <div>
                <label htmlFor='edit-name'>Name</label>
                <input id="edit-name"type="text" name="name" value={formData.name} onChange={handleInput} placeholder='Name'/>
            </div>
            <div>
                <label htmlFor="edit-bio">Biography</label>
                <textarea id="edit-bio" type="text" name="bio" value={formData.bio} onChange={handleInput} placeholder='Biography'/>
            </div>
            <div>
                <label htmlFor="edit-dob">Date of Birth</label>
                <input id="edit-dob" type="text" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInput} placeholder='DD / MM /  YY'/>
            </div>
            <div>
                <label htmlFor="edit-location">Location</label>
                <input id="edit-location" type="text" name="location" value={formData.location} onChange={handleInput} placeholder='Location'/>
            </div>
            <div>
                <label htmlFor="edit-img">Image source</label>
                <input id="edit-img" type="text" name="profileImg" value={formData.profileImg} onChange={handleInput} placeholder='Profile image url'/>
            </div>
            <span id="edit-error-div">{errMsg}</span>
            <button onClick={handleForm}>Save</button>
        </form>
    )
}

function dateRegex(val){
    const regex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    return regex.test(val) ? true : false
}

function urlRegex(val){
    const regex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,}/
    return regex.test(val) ? true : false
}