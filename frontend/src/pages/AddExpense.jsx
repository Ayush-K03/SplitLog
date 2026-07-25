import { useState } from "react"
import { useNavigate, useParams, useLoaderData } from 'react-router'
import axios from "axios"
import {showNotification,resolveLoadingNotification} from "../helper_functions/toast_helper"
axios.defaults.withCredentials = true;

export function AddExepense(){
    const {groupId} =useParams();
    const [description,setDescription]=useState("");
    const [amount,setAmount]=useState(0);
    const [userList , setUserList] = useState([]);
    const [participantListOpen,setParticipantListOpen]= useState(false);
    const [formSubmission,setFormSubmission] = useState(false);
    const [category,setCategory] = useState("");
    const navigate=useNavigate();
    const {participantsDetails} = useLoaderData();

    
    
    const categories = ["Food", "Travel", "Shopping", "Entertainment", "Education", "Groceries", "Rent and Utilities", "Healthcare", "Subscriptions", "Other"];
    //function for category selection and change
    const handleChange = (e) => {
      const value = e.target.value;
      setCategory(value);
      if (onSelect) onSelect(value);
    };


    async function updateUserList(userId){
      if (userList.includes(userId)){
        setUserList(userList.filter(id => id!==userId ));
      }
      else setUserList([...userList,userId]);
    }

    async function createExpense(e) {
      setFormSubmission(true);
      e.preventDefault()
        try{
          //validating adding an expense 
          if (description.trim() === "" ){
            showNotification("error","Description cannot be empty");
            setFormSubmission(false);
            return
          }
          if (amount <= 0 ){
            showNotification("error","Amount should be greater than 0");
            setFormSubmission(false);
            return
          }
          if (userList.length === 0 ) {
            showNotification("error","Select atleast one participant to split the expense");
            setFormSubmission(false);
            return
          }
          
          if (category===""){
            showNotification("error","Please select a category.");
            setFormSubmission(false);
            return;
          }

          console.log(category);
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/expenses`,{description,amount: Math.round(Number(amount) * 100),splitAmong:userList,category});
          showNotification("success","Expense added successfully");
          const timerId = setTimeout(()=>{navigate (`/groupDetails/${groupId}`)},1500);
        }

        catch(err){
          showNotification("error",err.response?.data?.msg || "Error creating expense. Please try again later.");
          setFormSubmission(false);
        }
    }

    // useEffect(()=>{},[])

    return (
      <div className="page-container">
        <div className="form-container">
          <div className="card">
            <div className="text-center mb-3">
              <div className="form-page-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 3v18M17 3v18"/><path d="M3 8h4M17 8h4M3 16h4M17 16h4"/>
                </svg>
              </div>
              <h1 style={{ fontSize: '22px', marginBottom: '6px', fontWeight: 700 }}>Add New Expense</h1>
              <p className="text-muted" style={{ marginBottom: 0 }}>Record a new expense for the group</p>
            </div>


            <form onSubmit={createExpense}>
              {!formSubmission ? 
              (
              <>
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
              <div className="form-group">
                <label className="form-label">Category</label>
                <div className="category-pills">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`category-pill ${category === cat ? 'active' : ''}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Split Among</label>
                <div className="participant-list">
                  {participantsDetails.map(eachUser => {
                    const isSelected = userList.includes(eachUser._id);
                    return (
                      <label key={eachUser._id} className={`participant-checkbox ${isSelected ? 'active' : ''}`}>
                        <input
                          type="checkbox"
                          className="hidden-checkbox"
                          checked={isSelected}
                          onChange={() => updateUserList(eachUser._id)}
                        />
                        <div className="participant-avatar">
                           {eachUser.firstName ? eachUser.firstName[0].toUpperCase() : '?'}
                        </div>
                        <span className="participant-name">{eachUser.firstName}</span>
                        <div className={`checkbox-indicator ${isSelected ? 'checked' : ''}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={() => navigate(`/groupDetails/${groupId}`)}
              >
                Discard Expense
              </button>
            </>
              ) : (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
              )}
              <div className="btn-group">
                <button disabled ={formSubmission} type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {!formSubmission ? "Add Expense": "Saving.."}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}