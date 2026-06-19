import { useNavigate,useLoaderData } from "react-router-dom"

export function CreateDashBoardPage() {
  const navigate = useNavigate()
  const { groupData, positiveBalance, negativeBalance } = useLoaderData()

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => navigate("/createGroups")}>
            + Create Group
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/joinGroup")}>
            Join Group
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">You are owed</div>
          <div className="stat-value positive">₹{positiveBalance}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">You owe</div>
          <div className="stat-value negative">₹{negativeBalance}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Groups</div>
          <div className="stat-value">{groupData.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Groups</h2>
        </div>


        {groupData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3 className="empty-state-title">No groups yet</h3>
            <p className="empty-state-description">
              Create or join a group to start splitting expenses
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/createGroups")}>
              Create your first group
            </button>
          </div>
        ) : (
          <div className="list-container">
            {console.log(groupData)}
            {groupData.map((group) => (
              <div key={group.gId} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">{group.groupName}</div>
                  <div className="list-item-subtitle">
                    {group.memberCount || '0'} members
                  </div>
                </div>
                <div className="list-item-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate(`/groupDetails/${group.gId}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

