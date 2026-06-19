import { useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"

export function AddExepense(){
    const {groupId} =useParams();
    const [description,setDescription]=useState("");
    const [amount,setAmount]=useState(0);
    const [participants,setParticipants]=useState([]);
    const [showSuccessBox,setShowSuccessBox]= useState(false);
    const [showError,setShowError]= useState(false);
    const navigate=useNavigate();

    async function createExpense(e) {
      e.preventDefault()
        try{
          const res = await axios.post("/api/group/",{description,amount:Number(amount)});
          navigate (`/api/${groupId}/expense`)
        }

        catch(err){
          setShowError(true);
          const timerId = setTimeout(()=>setShowError(false),2500)
        }
    }




    return (
      <div className="page-container">
        <div className="form-container">
          <div className="card">
            <div className="text-center mb-3">
              <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Add New Expense</h1>
              <p className="text-muted">Record a new expense for the group</p>
            </div>

            {showError && (
              <div className="alert alert-error">
                <span>⚠️</span>
                Error creating expense. Please try again.
              </div>
            )}

            <form onSubmit={createExpense}>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Add Expense
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/groupDetails/${groupId}`)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}