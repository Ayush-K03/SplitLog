import { useNavigate,useLoaderData } from "react-router"
import { ShowAnalysis } from "./Analysis";
import { useState } from "react";

// Deterministic avatar colors — same palette as the hero mockup card
const AVATAR_COLORS = [
  '#4f46e5', // indigo
  '#0f9d58', // green
  '#d97706', // amber
  '#e5484d', // red
  '#7c3aed', // violet
  '#0891b2', // cyan
  '#db2777', // pink
  '#16a34a', // emerald
];


// Falls back to count-only mode when no names are available
function MemberAvatarStack({ count, members=[] }) {
  const shown = Math.min(count, 4);
  const overflow = count > 4 ? count - 4 : 0;
  console.log(members)
  return (
    <div className="group-member-avatars">
      {Array.from({ length: shown }).map((_, i) => {
        const currentMember = members[i];
        const name = currentMember.firstName[0] + " " + currentMember.lastName[0];
        const hoverName = currentMember.firstName + " " + currentMember.lastName;
        {console.log(name)}
        return (
          <span
            key={i}
            className="group-member-avatar"
            style={{ '--avatar-color': AVATAR_COLORS[i % AVATAR_COLORS.length], zIndex: shown - i }}
            title={hoverName}
          >
            {name}
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="group-member-avatar group-member-avatar-overflow">
          +{overflow}
        </span>
      )}
    </div>
  );
}

const GROUPS_PER_PAGE = 8;

export function CreateDashBoardPage() {
  const navigate = useNavigate();
  const { groupData, positiveBalance, negativeBalance } = useLoaderData();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Manage your shared expenses
          </p>
        </div>
        <div className="dash-header-actions">
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
          <div className="stat-card-icon stat-card-icon--success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="stat-label">You are owed</div>
          <div className="stat-value positive">₹{(positiveBalance/ 100).toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon--danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="stat-label">You owe</div>
          <div className="stat-value negative">₹{(negativeBalance/ 100).toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon stat-card-icon--primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.5 2.7-5.8 5.5-5.8s5.5 2.3 5.5 5.8"/><path d="M18 8v5M15.5 10.5h5"/>
            </svg>
          </div>
          <div className="stat-label">Total Groups</div>
          <div className="stat-value">{groupData.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Groups</h2>
          <span className="group-count-badge">{groupData.length} group{groupData.length !== 1 ? 's' : ''}</span>
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
          <PaginatedGroupList
            groupData={groupData}
            navigate={navigate}
          />
        )}
      </div>
      <ShowAnalysis value={groupData}/>
    </div>
  )
}

function PaginatedGroupList({ groupData, navigate }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(groupData.length / GROUPS_PER_PAGE);
  const start = (page - 1) * GROUPS_PER_PAGE;
  const visibleGroups = groupData.slice(start, start + GROUPS_PER_PAGE);

  return (
    <>
      <div className="list-container">
        {visibleGroups.map((group) => (
          <div key={group.gId} className="list-item group-list-item">
            <div className="group-list-left">
              <div className="group-list-icon">💰</div>
              <div className="list-item-content">
                <div className="list-item-title">{group.groupName}</div>
                <div className="list-item-subtitle">
                  {group.memberCount || '0'} member{(group.memberCount || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="group-list-right">
              {console.log(group)}
              <MemberAvatarStack count={group.memberCount || 0} members={group.memberDetails} />
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate(`/groupDetails/${group.gId}`)}
              >
                View
              </button>
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


