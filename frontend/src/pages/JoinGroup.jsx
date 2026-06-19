import {backdropStyle,boxStyle} from "../assets/errorBox"
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import axios from 'axios'

export function JoinGroup(){
    const navigate = useNavigate();
    const [showError,setShowError]= useState(false);
    const [showSuccessBox,setShowSuccessBox]= useState(false);
    const [inviteCode,setInviteCode]=useState("");

    async function joinInvitedGroup(e){
        e.preventDefault()
        try{
            const res = await axios.get(`/api/groups/join/${inviteCode}`);
            setShowSuccessBox(true);
            setTimeout(()=>
                {
                    setShowSuccessBox(false)
                    navigate(`/groupDetails/${res.data}`)
                }
            ,3000)
        }
        catch(err){
            setShowError(true);
            setTimeout(()=>setShowError(false),2500)
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

          {showError && (
            <div className="alert alert-error">
              <span>⚠️</span>
              Invalid invite code. Please check and try again.
            </div>
          )}

          {showSuccessBox && (
            <div className="alert alert-success">
              <span>✅</span>
              Successfully joined the group! Redirecting...
            </div>
          )}

          <form onSubmit={joinInvitedGroup}>
            <div className="form-group">
              <label className="form-label">Invite Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Join Group
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
