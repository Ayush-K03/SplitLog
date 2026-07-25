import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast'; // Installed via: npm i react-hot-toast
import {showNotification} from '../helper_functions/toast_helper'; // Custom toast helper function

axios.defaults.withCredentials = true;

export function JoinGroup() {
    const navigate = useNavigate();
    const [inviteCode, setInviteCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Controls loading states

    async function joinInvitedGroup(e) {
        e.preventDefault();
        setIsSubmitting(true);
        try {

            if (inviteCode.length<4) {
              return showNotification("error","Invite code must be at least 4 characters long");
            }
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups/join/${inviteCode}`);
            showNotification("success", "Successfully joined the group!");
            
            setTimeout(() => {
                navigate(`/groupDetails/${res.data.groupId}`);
                showNotification("success", `Welcome to the group -${res.data.groupName}  created by : ${res.data.ownerName}`);
            }, 1000);
        }
        catch (err) {
            showNotification("error", `${err.response?.data?.msg}` || "Invalid invite code or group not found.");
            setIsSubmitting(false); 
            return;
        }
    }

    return (
      <div className="page-container">
        <div className="form-container">
          <div className="card">
            <div className="text-center mb-3">
              <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Join a Group</h1>
              <p className="text-muted">Enter the invite code to join an existing group</p>
            </div>

            <form onSubmit={joinInvitedGroup}>
              <div className="form-group">
                <label className="form-label">Invite Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  disabled={isSubmitting} // Stops user from editing while API runs
                  required
                />
              </div>

              {/* The button updates text and disables itself during loading */}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="mini-spinner"></div> {/* Look at the CSS below for this */}
                    Joining...
                  </div>
                ) : (
                  'Join Group'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}
