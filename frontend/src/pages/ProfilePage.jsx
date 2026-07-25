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
    const avatarUrl = getAvatarUrl(user.name); // Call the function to get the avatar URL

    return (
        <>
        <div className="page-container">
            <div className="form-container">
                <div className="card">
                    <div className="text-center mb-3">
                        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>User Profile</h1>
                        <p className="text-muted">Your profile information</p>

                        {/* --- AVATAR ELEMENT ADDED HERE --- */}
                        <div className="avatar-container">
                            <img 
                                src={getAvatarUrl(user.name)} 
                                alt={`${user.name}'s avatar`} 
                                style={avatarStyles} 
                            />
                        </div>

                        <pre>Welcome {user.name} #{user.userId.slice(0,5)}</pre>
                        <p className="text-muted">Name: {user.name}</p>
                        <p className="text-muted">Email: {user.email}</p>
                        <p className="text-muted">User ID: {user.userId.slice(0,5)}</p>
                        <p className="text-muted">Member since: {properDate}</p>
                        <div className="stats-container">
                            <p className="text-muted">Total Groups: {groupCount}</p>
                            <p className="text-muted">Total Expenses: {expenseCount}</p>
                            <p className="text-muted">Total Settlements: {settlementCount}</p>
                        </div>
                        <button className="btn btn-primary" onClick={() =>{
                            navigate("/update-password",{replace: true})
                        }}>Change Password</button>
                        <button className="btn btn-danger" onClick={async()=>{
                            await handleLogout();
                            navigate("/",{replace: true});
                            showNotification("success","Logged out successfully");
                        }}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
