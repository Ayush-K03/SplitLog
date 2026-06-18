import axios from "axios";
import {useParams,useLoaderData,useNavigate} from "react-router-dom";
import {useState} from 'react'

export function ShowGroupDetails(){
    const navigate= useNavigate();
    const {groupId} = useParams();
    const {groupDetails,groupTransactionData,userExpenseInGroup} = useLoaderData();

    const [showSettlements,setShowSettlements] = useState(false);
    const [settlements,setSettlements] = useState([]);

    async function getSettlements(){
        try{
            const res = await axios.get(`/api/${groupId}/settlements`)
            const afterSettlementData= res.data 
            console.log(Array.isArray(afterSettlementData));
            setShowSettlements(true)
            setSettlements(afterSettlementData)
        }
        catch{

        }
    }

    
    console.log(groupTransactionData)
    return(
        <>
            <h1>Group Details: </h1>
            <h2>
                Group Name: {groupDetails.groupName} <br />
                Invite Code : {groupDetails.inviteCode}<br />
                Created By : {groupDetails.createdBy.firstName}<br />
                Members : {groupDetails.members.map(value=>value.firstName+", ")}<br />
                Created On :  {groupDetails.createdAt}
            </h2>
            <button onClick={()=>navigate(`/${groupId}/addExpense`)}>Add Expense</button>

            <h2>{(userExpenseInGroup>=0)? `Your credit in this group : ${userExpenseInGroup}`: `Your debt in this group : ${userExpenseInGroup}`} </h2>

            <h1> Group Expenses : </h1>  

            {typeof(groupTransactionData)!="object" ? "No expenses till now !" : 
            groupTransactionData.map((value)=>{
                return (
                    <>
                        <br />
                        Description : {value.description}
                        <br />
                        Amount : {value.amount}
                        <br />
                        Paid By : {value.paidBy.firstName}
                        <br />
                        Split Among : {value.splitAmong.map((member)=>member.firstName+" ")}
                        <br />
                    </>

                )
            })}

            <h1><button onClick={getSettlements}>Settle Expenses </button></h1>

            {showSettlements && settlements.map((value)=>{return(<>
            <br />
                From: {value.from.firstName}
            <br />
                To: {value.to.firstName}
            <br />
                Amount:{value.amount}
            <br />
            </>)})}
            <button>Home</button>
        </>
    );
}

