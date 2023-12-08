import { useEffect, useState } from "react"
import './FilterStyle.css'
export default function Filter({applyFilter}){
    const [isOpen, setIsOpen] = useState(false)
    const [filterData, setFilterData] = useState({
        gender: "",
        location: "",
        avatar: false
    })
    useEffect(()=>{
        applyFilter(filterData)
    }, [filterData])
    function handleShowClick(){
        setIsOpen(prev=>!prev)
        setFilterData({gender: "",location: "",avatar: false})

    }
    function handleData(e){
        const {name, value} = e.target;
        setFilterData(prev=>{
            return {...prev, [name]: value }
        })
    }
    function handleCheck(e){
        setFilterData(prev=>{
            return {...prev, avatar: !filterData.avatar}
        })
    }
    return (
        <div className="filter-toolbar-main">
            <div className={`filter-toolbar ${isOpen ? "toolbar-show":""}`}>
                <div className="filter-group filter-gender">
                    <label>Gender</label>
                    <div className="radio-btn-filter">
                            <label htmlFor="Male">Male</label>
                            <input type="radio" id="Male" name="gender" value="Male" onChange={handleData}/>
                    </div>
                    <div className="radio-btn-filter">
                            <label htmlFor="Female">Female</label>
                            <input type="radio" id="Female" name="gender" value="Female" onChange={handleData} />
                    </div>
                    <div className="radio-btn-filter">
                        <label htmlFor="None">None</label>
                        <input type="radio" id="Empty" name="gender" value="" onChange={handleData} />
                    </div>                 
                </div>
                <div className="filter-group filter-location">
                    <label htmlFor="location">Location</label>
                    <input id="location" type="text" name="location" value={filterData.location} onChange={handleData} />
                </div>
                <div className="filter-group filter-avatar">
                    <label htmlFor="avatar">Avatar</label>
                    <input type="checkbox" id="avatar" name="avatar" checked={filterData.avatar} onChange={handleCheck} />
                </div>
            </div>
           <button id="toolbar-btn" onClick={handleShowClick}>{!isOpen ? "More Options":"X"}</button>
        </div>
    )
}