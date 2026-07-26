import axios from "axios";
import { useNavigate , useLoaderData} from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { user } from "../App.jsx";
import { handleLogout } from "../helper_functions/logoutProcess.jsx";
import { showNotification } from "../helper_functions/toast_helper.jsx";
import { getAvatarUrl, avatarStyles } from "../helper_functions/avatar_link_url.js";
axios.defaults.withCredentials = true;

export function GetUserProfile() {
    const navigate = useNavigate();
    const {expenseCount,settlementCount,groupCount,properDate} = useLoaderData();
    const avatarUrl = getAvatarUrl( user.name,user.lastName);
    console.log(user);
    return (
        <>
        <div className="page-container">
            <div className="profile-page-wrapper">
                {/* Profile Hero Card */}
                <div className="card profile-hero-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-ring">
                            <img
                                src={getAvatarUrl(user.name,user.lastName)}
                                alt={`${user.name}'s avatar`}
                                className="profile-avatar-img"
                            />
                        </div>
                        <div className="profile-hero-info">
                            {console.log(user)}
                            <h1 className="profile-name">{`${user.name} ${user.lastName || " "} `.trim()}</h1>
                            <p className="profile-email">{user.email}</p>
                            <div className="profile-badges">
                                <span className="profile-badge">#{user.userId.slice(0,8)}</span>
                                <span className="profile-badge">Member since {properDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="profile-stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon stat-card-icon--primary">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.5 2.7-5.8 5.5-5.8s5.5 2.3 5.5 5.8"/><path d="M18 8v5M15.5 10.5h5"/>
                            </svg>
                        </div>
                        <div className="stat-label">Groups</div>
                        <div className="stat-value">{groupCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon stat-card-icon--success">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 3v18M17 3v18"/><path d="M3 8h4M17 8h4M3 16h4M17 16h4"/>
                            </svg>
                        </div>
                        <div className="stat-label">Expenses</div>
                        <div className="stat-value">{expenseCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon stat-card-icon--warning">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
                            </svg>
                        </div>
                        <div className="stat-label">Settlements</div>
                        <div className="stat-value">{settlementCount}</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="card profile-actions-card">
                    <h3 className="card-section-title">Account</h3>
                    <div className="profile-actions">
                        <button className="btn btn-outline profile-action-btn" onClick={() => navigate("/update-password", {replace: true})}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                            </svg>
                            Change Password
                        </button>
                        <button className="btn btn-danger profile-action-btn" onClick={async() => {
                            await handleLogout();
                            navigate("/", {replace: true});
                            showNotification("success", "Logged out successfully");
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
