import axios from "axios"
import {useState, useEffect} from "react"
import {user} from "../App"
import {showNotification} from "../helper_functions/toast_helper"

axios.defaults.withCredentials = true;

export function SettlePendingRequest(){
    const [pendingApprovalList,setPendingApprovalList] = useState([]);
    async function handleApproval(settlementId) {
        try{
            const response = await axios.patch (`${import.meta.env.VITE_BACKEND_URL}/api/${settlementId}/approve`)
            setPendingApprovalList((prev) =>prev.filter((settlement) => settlement._id !== settlementId));
            showNotification("success","Settlement request approved successfully")
        }
        catch(err){
            console.log(err)
            showNotification("error",err?.response?.data?.msg || "An error in resolving settlement..")
        }
    }


    async function getAllApprovalReq() {
        try{
            const list = (await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/showPendingList`)).data;
            console.log(list)
            setPendingApprovalList(list);
            if (list.length!==0) showNotification("success","You have pending approval request. Please settle them.")
                console.log("List was fetched!")
        }
        catch(err){
            console.log(err);
            showNotification("error", "An error occoured while fetching pending settlement request")
        }
    }

    useEffect(() => {
        getAllApprovalReq();
    }, []);
    
    return (
        <>hi
        {console.log(pendingApprovalList)}
            <div>
                {pendingApprovalList.map((pendingSettlement)=>(
                <div key={pendingSettlement._id}>
                    <button onClick ={()=>handleApproval(pendingSettlement._id)}>Approve</button>
                </div>
                ))}
            </div>
        </>
    )
}