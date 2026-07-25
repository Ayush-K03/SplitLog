import { useState } from "react"
import { useNavigate, useParams, useLoaderData } from 'react-router-dom'
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
              <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Add New Expense</h1>
              <p className="text-muted">Record a new expense for the group</p>
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
              <div className="category-dropdown">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="" disabled selected>Pick a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Split Among :</label>
                <div className="dropdown-menu">
                  <button type ="button" onClick={()=>setParticipantListOpen(prev=>!prev)}>Select members V</button>
                  {participantListOpen && participantsDetails.map( eachUser => {
                    return(
                      <div key={eachUser._id}>
                      <input className="dropdown-items" type="checkbox" value={eachUser.first_name} onChange={(e)=> updateUserList(eachUser._id)} />
                      <label>{eachUser.firstName}</label>
                    </div>
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