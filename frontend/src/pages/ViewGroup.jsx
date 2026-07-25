import axios from "axios"
import { useParams, useLoaderData, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { user } from "../App";
import { showErrorPage } from "./ErrorPage";
import { showNotification } from "../helper_functions/toast_helper";
axios.defaults.withCredentials = true;

export function ShowGroupDetails(){
    const navigate= useNavigate();
    const {groupId} = useParams();
    const {groupDetails,groupTransactionData,userExpenseInGroup} = useLoaderData();

    const [showSettlements,setShowSettlements] = useState(false);
    const [settlements,setSettlements] = useState([]);
    const [userBalance,setUserBalance] = useState(userExpenseInGroup);
    const [isFetchingSettlement,setIsFetchingSettlement] = useState(false);
    const [isProcessingSettlement, setIsProcessingSettlement] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [] = useState(false)
    if (groupDetails==null)  return showErrorPage("GROUP_NOT_FOUND")//call the function telling it the type of error page to show 


    async function getSettlements(showToastNotification=true){
      setIsFetchingSettlement(true);
        try{
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/settlements`)
          const afterSettlementData= res.data 
          
          setSettlements(afterSettlementData)
          console.log(userBalance)
        }
        catch(err){
          console.log(err)
          showNotification("error","Error calculating settlements. Please try again later.");  
        }
        finally{
          setIsFetchingSettlement(false);
          setShowSettlements(true)
          if(!showToastNotification) return 
          showNotification("success","Optimized settlements calculated successfully.");
          setTimeout(()=>showNotification("success","Please check the settlements section below."), 1000) ;
        }
    }

    async function doSettlement(from,to,amount,description){
      try{
        setIsProcessingSettlement(true);
        console.log(amount);
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/settlements`,{groupId,from,to,amount,description})
        // const newData = await fetchGroupList({ params: { groupId } });
        //update settlements by new ones
        getSettlements(false)
        setUserBalance(userBalance+amount);
      }
      catch (err){
        console.log(err)
        showNotification("error","Error processing settlement. Please try again later.");
      }
      finally{
        showNotification("success","Settlement processed successfully!");
        setIsProcessingSettlement(false);
      }
    }

  return (





    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{groupDetails.groupName}</h1>
          <p className="text-muted">Group Details & Expenses</p>
        </div>
        {groupDetails.members.length===1 ? 
          <button type ="button" disabled className="btn btn-primary" title="Please add more poeple to start splitting">
            + Add Expense
          </button> 
          : 
          <button className="btn btn-primary" onClick={() => navigate(`/${groupId}/addExpense`)}>
            + Add Expense
          </button>
        }
      </div>

      <div className="two-column-layout">
        <div>
          <div className="card mb-2">
            <div className="card-header">
              <h2 className="card-title">Group Information</h2>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="flex-between">
                <span className="text-muted">Invite Code</span>
                <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>
                  <button onClick={() => {
                    navigator.clipboard.writeText(groupDetails.inviteCode)
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 2000)
                    }}>
                    {isCopied ? "Copied!" : "Copy Code"}
                  </button>
                  {groupDetails.inviteCode}
                </span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Created By</span>
                <span style={{ fontWeight: 500 }}>
                  {groupDetails.createdBy.firstName}
                </span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Members</span>
                <span style={{ fontWeight: 500 }}>
                  {groupDetails.members.map(v => v.firstName).join(", ")}
                </span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Created On</span>
                <span style={{ fontWeight: 500 }}>
                  {new Date(groupDetails.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Expenses</h2>
              <button className="btn btn-outline btn-sm" onClick={getSettlements}>
                Settle Up
              </button>
            </div>


            {!groupTransactionData || groupTransactionData.length === 0 ? 
            (
              <div className="empty-state">
                <div className="empty-state-icon">💳</div>
                <h3 className="empty-state-title">No expenses yet</h3>
                <p className="empty-state-description">
                  Add your first expense to start tracking
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/${groupId}/addExpense`)}
                >
                  Add Expense
                </button>
              </div>
            ) : 
            (
              <div className="list-container">
                {groupTransactionData.map((expense, index) => (
                  <div key={index} className="list-item">
                    <div className="list-item-content">
                      <div className="list-item-title">{expense.description}</div>
                      <div className="list-item-subtitle">
                        Paid by {expense.paidBy.firstName} • Split among{' '}
                        {expense.splitAmong.map(m => m.firstName).join(", ")}
                      </div>
                      <div className="list-item-subtitle">
                        •{expense.category} •{new Date(expense.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontWeight: 500, color: 'var(--accent-primary)' }}>
                      ₹{(expense.amount/ 100).toFixed(2)}
                    </div>
                    <div>
                      {/* <button onClick={}>Edit</button> */}
                      {expense.paidBy._id === user.userId && <button >Delete</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          

          {(isFetchingSettlement ||(showSettlements && settlements.length > 0) )&& (
            <div className="card mt-2">
              <div className="card-header">
                <h2 className="card-title">Settlements</h2>
              </div>
              <div className="card-body" style={{ position: 'relative', minHeight: '100px' }}>
                {isProcessingSettlement && (
                  <div className ="card-processing-overlay"> </div>
                )}
                {isFetchingSettlement ? 
                (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <pre>  </pre>
                    <p className="text-muted">Calculating group balances...</p>
                  </div>
                ):(
                <div className="list-container">
                  {settlements.map((settlement, index) => (
                    <div key={index} className="list-item">
                      <div className="list-item-content">
                        <div className="list-item-title">
                          {settlement.from.firstName} → {settlement.to.firstName}
                        </div>
                      </div>
                      <div style={{ fontWeight: 500, color: 'var(--accent-success)' }}>
                        ₹{(settlement.amount/ 100).toFixed(2)}
                      </div>
                      <div>
                        {settlement.from._id===user.userId && 
                        <button disabled={isProcessingSettlement} onClick={()=>doSettlement(settlement.from._id,settlement.to._id,settlement.amount,"")}>Mark as paid</button>}
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Balance</h2>
          </div>
          <div className="text-center">
            <div className="stat-label mb-1">
              {userBalance >= 0 ? 'You are owed' : 'You owe'}
            </div>
            <div 
              className={`stat-value ${userBalance >= 0 ? 'positive' : 'negative'}`}
              style={{ fontSize: '36px' }}
            >
              ₹{Math.abs((userBalance/ 100).toFixed(2))}
            </div>
          </div>
          <button 
            className="btn btn-outline mt-2" 
            style={{ width: '100%' }}
            onClick={() => navigate("/dashboard",{replace: true})}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

