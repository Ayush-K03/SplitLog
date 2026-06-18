import { useState } from "react";
import {backdropStyle,boxStyle} from "../assets/errorBox"
import {useNavigate} from 'react-router-dom'


export function AddExepense(){

    const [description,setDescription]=useState("");
    const [amount,setAmount]=useState(0);
    const [participants,setParticipants]=useState([]);
    const [showSuccessBox,setShowSuccessBox]= useState(false);
    const [showError,setShowError]= useState(false);
    const navigate=useNavigate();

    async function createExpense() {
        try{
            const res = await axios.post("/api/group/");
            // navigate ()
        }

        catch(err){
            setShowError(true);
        }
        finally{
            const timerId = setTimeout(()=>{
                setShowError(false);
            },2500)
        }
    }




    return (
        <>
            {showError && (<div style={backdropStyle} ><div style={boxStyle}>Invalid Credentials.. Please check and try again</div></div>) }
            {showSuccessBox && <div style={backdropStyle}><div style={boxStyle}>Invite Code Verified ! <br /> Successfully joined the group </div></div>}
            
            <label>Description</label>
            <input type="text" onChange={(e)=>{setDescription(e.target.value)}}/>
            <br />
            <label>Amount</label>
            <input type="text" onChange={(e)=>{setAmount(e.target.value)}}/>
            <br />
            <label>Participants</label>
            <input type="text" onChange={(e)=>{setParticipants(e.target.value)}}/>
            <br />
            <button onClick={createExpense}>Create Expense</button>
        </>
    )
}