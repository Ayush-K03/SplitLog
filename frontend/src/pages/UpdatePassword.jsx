import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import {showNotification} from "../helper_functions/toast_helper"
export function UpdatePassword() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [updatingPassword, setUpdatingPassword] = useState(false);

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
            setUpdatingPassword(true);
            
            if (newPassword !== confirmPassword) {
                setErrorMessage("! New password and confirm password do not match.");
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000); // Clear error message after 3 seconds
                setUpdatingPassword(false);
                return;
            }

            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-password`, {oldPassword,newPassword});
            return navigate("/profile",{replace: true}); 
        }
        catch (err){
            if (err.status === 401) {
                console.error("Unauthorized: ", err.response?.data?.msg || "Unknown error");
                // alert("Error: " + (err.response?.data?.msg || "Session expired"));
                showNotification("error",(err.response?.data?.msg || "Session expired"))
                setUpdatingPassword(false);
            }
            else {
                console.error("Error during password update:", err);
                showNotification("error",(err.response?.data?.msg || "A network or server error occurred"))
                // setErrorMessage("Error: " + (err.response?.data?.msg || "A network or server error occurred"));
                setUpdatingPassword(false);
                return
            }
        }
    }

    return (
        <>
            <div className="page-container">
                <div className="form-container">
                    <div className="card">
                        <div className="text-center mb-3">
                            <div className="form-page-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <h1 style={{ fontSize: '22px', marginBottom: '6px', fontWeight: 700 }}>Update Password</h1>
                            <p className="text-muted" style={{ marginBottom: 0 }}>Enter your current and new password</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="oldPassword">Current Password</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={updatingPassword}>
                                {updatingPassword ? (
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className="mini-spinner"></div>
                                        Updating...
                                    </div>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}