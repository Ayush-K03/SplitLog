import {backdropStyle,boxStyle} from "../assets/errorBox"
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import axios from 'axios'

export function JoinGroup(){
    const navigate = useNavigate();
    const [showError,setShowError]= useState(false);
    const [showSuccessBox,setShowSuccessBox]= useState(false);
    const [inviteCode,setInviteCode]=useState("");

    async function joinInvitedGroup(){
        try{
            const res = await axios.get(`/api/groups/join/${inviteCode}`);
            setShowSuccessBox(true);
            setTimeout(()=>
                {
                    setShowSuccessBox(false)
                    navigate(`/groupDetails/${res.data}`)
                }
            ,3000)
        }
        catch(err){
            setShowError(true);
            console.log(err);
        }
        finally{
            setTimeout(()=>{
                setShowError(false);
            },2500)
        }
    }



    return (
        <>
            {showError && <div style={backdropStyle}><div style={boxStyle}>Sorry , Not a valid invite code ! </div></div>}
            {showSuccessBox && <div style={backdropStyle}><div style={boxStyle}>Invite Code Verified ! <br /> Successfully joined the group </div></div>}
            You can join a group by their Refferal Link
            <br />
            <br />
            <label >Enter Invite Code: </label>
            <input type="text" onChange ={(e)=>{setInviteCode(e.target.value)}}/>
            <button onClick={joinInvitedGroup}>Join Group</button>
        </>
    )
}

