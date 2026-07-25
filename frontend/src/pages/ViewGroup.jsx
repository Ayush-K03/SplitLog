import axios from "axios"
import { useParams, useLoaderData, useNavigate } from "react-router"
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
          <p className="text-muted" style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>Group Details &amp; Expenses</p>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code className="invite-code-badge">{groupDetails.inviteCode}</code>
                  <button className="btn btn-outline btn-sm" onClick={() => {
                    navigator.clipboard.writeText(groupDetails.inviteCode)
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 2000)
                  }}>
                    {isCopied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="flex-between">
                <span className="text-muted">Created by</span>
                <span style={{ fontWeight: 600 }}>
                  {groupDetails.createdBy.firstName}
                </span>
              </div>
              <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                <span className="text-muted">Members</span>
                <div className="member-pill-list">
                  {groupDetails.members.map(v => (
                    <span key={v._id} className="member-pill">{v.firstName}</span>
                  ))}
                </div>
              </div>
              <div className="flex-between">
                <span className="text-muted">Created on</span>
                <span style={{ fontWeight: 500 }}>
                  {new Date(groupDetails.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
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
                  <div key={index} className="list-item expense-list-item">
                    <div className="list-item-content">
                      <div className="list-item-title">{expense.description}</div>
                      <div className="list-item-subtitle">
                        Paid by <strong>{expense.paidBy.firstName}</strong> • Split among{' '}
                        {expense.splitAmong.map(m => m.firstName).join(", ")}
                      </div>
                      <div style={{ marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="expense-category-pill">{expense.category}</span>
                        <span className="expense-date-pill">{new Date(expense.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                      </div>
                    </div>
                    <div className="expense-amount-badge">
                      ₹{(expense.amount/ 100).toFixed(2)}
                    </div>
                    <div>
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
                    <div key={index} className="list-item settlement-item">
                      <div className="list-item-content">
                        <div className="settlement-arrow-row">
                          <span className="settlement-from">{settlement.from.firstName}</span>
                          <span className="settlement-arrow-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </span>
                          <span className="settlement-to">{settlement.to.firstName}</span>
                        </div>
                      </div>
                      <div className="settlement-amount">
                        ₹{(settlement.amount/ 100).toFixed(2)}
                      </div>
                      <div>
                        {settlement.from._id===user.userId && 
                        <button className="btn btn-success btn-sm" disabled={isProcessingSettlement} onClick={()=>doSettlement(settlement.from._id,settlement.to._id,settlement.amount,"")}>Mark paid</button>}
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card balance-card">
          <div className="card-header">
            <h2 className="card-title">Your Balance</h2>
          </div>
          <div className="balance-card-body">
            <div className="balance-label">
              {userBalance >= 0 ? 'You are owed' : 'You owe'}
            </div>
            <div 
              className={`balance-amount ${userBalance >= 0 ? 'positive' : 'negative'}`}
            >
              ₹{Math.abs((userBalance/ 100).toFixed(2))}
            </div>
          </div>
          <button 
            className="btn btn-outline mt-2" 
            style={{ width: '100%' }}
            onClick={() => navigate("/dashboard",{replace: true})}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

