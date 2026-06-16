import {backdropStyle,boxStyle} from "../assets/errorBox"
import {useState,useEffect} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"

export function CreateGroupForm(){
    const navigate = useNavigate();

    const [groupName, setGroupName]= useState("");
    const [showError, setShowError]=useState(false);

    async function createGroup (){
        try{
            console.log(groupName);
            const res = await axios.post("/api/groups/create",{groupName});
            const groupId=res.data._id;
            return navigate(`/groupDetails/${groupId}`)
        }
        catch(err){
            setShowError(true);
        }
        finally{
            setTimeout(()=>{
                setShowError(false);
            },2500)
        }
    }

    return (
        <>
            {showError && <div style={backdropStyle}><div style={boxStyle}>The group name is invalid </div></div>}
            <h1>Create New Group</h1>
            <h3>Enter Group Name: </h3>
            <input type="text" onChange={(e)=>{setGroupName(e.target.value)}}/>
            <button onClick={createGroup}>Create Group</button>
        </>
    )
}

