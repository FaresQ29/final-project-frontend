import { AuthContext } from '../../Context/auth.context'
import {useState, useEffect, useContext} from 'react';
import './profilePageStyle.css'
import UpdatesContainer from './UpdatesContainer';
import defaultProfileImg from '../../assets/profile-default.png'
import { useNavigate } from 'react-router-dom';
export default function ProfilePage(){
    const {isLoading, user} = useContext(AuthContext)
    const {name, email, userDetails, friendRequests, friendList, communities} = user;
    const {dateOfBirth, profileImg, location, bio} = userDetails
    const profileImgSrc = profileImg ? profileImg : defaultProfileImg;
    const navigate = useNavigate();
    return (
        <div id="profile-page">
            <div className="profile-left-side">
                <div className="profile-edit-div">
                    <button onClick={()=>navigate("/edit-user")}>Edit Profile</button>
                    <button>Preview Profile</button>
                </div>
                <h3>{name}</h3>
                <img src={profileImgSrc} alt="main-profile-image" id="main-profile-image" />
                {bio && <p>{bio}</p>}
                <div className='friend-list-container'>Friends</div>
                <div className='communities-list-container'>Communities</div>
            </div>
            <div className="profile-right-side">
                <UpdatesContainer />
            </div>
        </div>
    )
}