import axios from "axios"
import { useParams, useLoaderData, useNavigate } from "react-router"
import { useState } from 'react'
import { user } from "../App";
import { showErrorPage } from "./ErrorPage";
import { showNotification } from "../helper_functions/toast_helper";
axios.defaults.withCredentials = true;

const EXPENSES_PER_PAGE = 8;

// SVG trash icon for the delete button
function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function PaginatedExpenseList({ expenses, currentUserId, onDeleteClick }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(expenses.length / EXPENSES_PER_PAGE);
  const start = (page - 1) * EXPENSES_PER_PAGE;
  const visible = expenses.slice(start, start + EXPENSES_PER_PAGE);

  return (
    <>
      <div className="list-container">
        {visible.map((expense, index) => (
          <div key={start + index} className="list-item expense-list-item">
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
              ₹{(expense.amount / 100).toFixed(2)}
            </div>
            <div>
              {expense.paidBy._id === currentUserId && (
                <button
                  className="btn btn-danger btn-sm expense-delete-btn"
                  onClick={() => onDeleteClick && onDeleteClick(expense)}
                  title="Delete expense"
                  aria-label={`Delete expense: ${expense.description}`}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`pagination-btn${p === page ? ' active' : ''}`}
              onClick={() => setPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

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
              <PaginatedExpenseList
                expenses={groupTransactionData}
                currentUserId={user.userId}
              />
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
                  <div className="loading-container" style={{ minHeight: '120px' }}>
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

