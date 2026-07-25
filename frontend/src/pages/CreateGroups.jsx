import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {showNotification} from "../helper_functions/toast_helper";
import axios from "axios";
axios.defaults.withCredentials = true;

export function CreateGroupForm() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [formSubmission,setFormSubmission] = useState(false);


  async function createGroup(e) {
    setFormSubmission(true)
    e.preventDefault();

    try {
      //validating group name before sending to server
      if (groupName.trim().length <= 3) {
        showNotification("error","Group name must be at least 4 characters long");
        setFormSubmission(false);
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/groups/create`, { groupName });
      showNotification("success","Group created successfully");
      const groupId = res.data._id;
      setTimeout(() => navigate(`/groupDetails/${groupId}`), 1000);
    } 

    catch (err) {
      setFormSubmission(false)
      showNotification("error","Error creating group. Please try again later.");
    }
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="card">
          <div className="text-center mb-3">
            <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
              Create New Group
            </h1>
            <p className="text-muted">Start splitting expenses with friends</p>
          </div>



          <form onSubmit={createGroup}>
            {!formSubmission ?(
              <div className="form-group">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                />
              </div>
              ) : (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <pre>  Creating Group..  </pre>
                </div>
              )}

            <button
              type="submit"
              disabled ={formSubmission}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
                                {!formSubmission ? "Create Group": "Creating.."}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
