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
            setPendingApprovalList(list);
            if (list.length!==0) showNotification("success","You have pending approval request. Please settle them.")
        }
        catch(err){
            console.log(err);
            showNotification("error", "An error occoured while fetching pending settlement request")
        }
    }

    useEffect(() => {
        getAllApprovalReq();
    }, []);

    if (pendingApprovalList.length === 0) return null;
    
    return (
        <div className="card pending-settlement-card">
            <div className="card-header">
                <h2 className="card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-3px', marginRight: '8px' }}>
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    Pending Approvals
                </h2>
                <span className="group-count-badge pending-badge">
                    {pendingApprovalList.length} pending
                </span>
            </div>
            <div className="list-container">
                {pendingApprovalList.map((pendingSettlement) => (
                    <div key={pendingSettlement._id} className="list-item pending-settlement-item">
                        <div className="pending-settlement-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 7h11l-3-3M20 17H9l3 3"/>
                            </svg>
                        </div>
                        <div className="list-item-content">
                            <div className="list-item-title">Settlement Request</div>
                            <div className="list-item-subtitle">
                                Amount: <strong>₹{(pendingSettlement.amount / 100).toFixed(2)}</strong>
                            </div>
                        </div>
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApproval(pendingSettlement._id)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }}>
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Approve
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}