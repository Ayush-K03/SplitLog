import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function CreateGroupForm() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [showError, setShowError] = useState(false);

  async function createGroup(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/api/groups/create", { groupName });
      const groupId = res.data._id;
      return navigate(`/groupDetails/${groupId}`);
    } catch (err) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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

          {showError && (
            <div className="alert alert-error">
              <span>⚠️</span>
              Invalid group name. Please try again.
            </div>
          )}

          <form onSubmit={createGroup}>
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Create Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
