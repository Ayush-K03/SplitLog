import axios from "axios"
import { useParams, useLoaderData, useNavigate } from "react-router-dom"
import { useState } from 'react'

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
          setShowSettlements(true)
          setSettlements(afterSettlementData)
        }
        catch{
          console.log(err)  
        }
    }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{groupDetails.groupName}</h1>
          <p className="text-muted">Group Details & Expenses</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/${groupId}/addExpense`)}>
          + Add Expense
        </button>
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
                    </div>
                    <div style={{ fontWeight: 500, color: 'var(--accent-primary)' }}>
                      ₹{expense.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showSettlements && settlements.length > 0 && (
            <div className="card mt-2">
              <div className="card-header">
                <h2 className="card-title">Settlements</h2>
              </div>
              <div className="list-container">
                {settlements.map((settlement, index) => (
                  <div key={index} className="list-item">
                    <div className="list-item-content">
                      <div className="list-item-title">
                        {settlement.from.firstName} → {settlement.to.firstName}
                      </div>
                    </div>
                    <div style={{ fontWeight: 500, color: 'var(--accent-success)' }}>
                      ₹{settlement.amount}
                    </div>
                  </div>
                ))}
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
              {userExpenseInGroup >= 0 ? 'You are owed' : 'You owe'}
            </div>
            <div 
              className={`stat-value ${userExpenseInGroup >= 0 ? 'positive' : 'negative'}`}
              style={{ fontSize: '36px' }}
            >
              ₹{Math.abs(userExpenseInGroup)}
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

