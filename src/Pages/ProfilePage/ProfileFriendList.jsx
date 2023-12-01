import { AuthContext } from "../../Context/auth.context"
import { useContext, useEffect, useState } from "react"
import defaultImage from '../../assets/profile-default.png'
export default function ProfileFriendList({friendList}){
    const {allUsers} = useContext(AuthContext)
    const [friendArr, setFriendArr] = useState(null)
    const [searchVal, setSearchVal] = useState("")
    useEffect(()=>{
        if(!allUsers) return 
        getFriends()
    }, [allUsers])
    function getFriends(){
        const friends = allUsers.filter(elem=>friendList.includes(elem._id))
        const searched = searchVal.length > 0 ? friends.filter(elem=>elem.name.includes(searchVal)) : friends;
        setFriendArr(searched)
    }

    useEffect(()=>{getFriends()}, [searchVal])


    return (
        <div className='friend-list-container'>
            <h4>Friends</h4>
            <input type="text" placeholder="Search..." value={searchVal} onChange={(e)=>setSearchVal(e.target.value)} />
            {!friendList && <div className="no-friends-profile">No friends...</div> }
            {friendArr && (
                <div className="friend-profile-div">
                    {friendArr.map((elem, i)=>{
                        const imgSrc = elem.userDetails.profileImg ? elem.userDetails.profileImg : defaultImage;
                        return (
                            <div className="friend-profile-card" key={i}>
                                <img src={imgSrc}/>
                                <p>{elem.name}</p>
                            </div>
                        )
                    })}
                </div>

            )}


        </div>
    )
}