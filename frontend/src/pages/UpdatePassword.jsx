import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

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
                console.error("Unauthorized: ", err.response.data.msg);
                alert("Error: " + err.response.data.msg);
            }
            console.error("Error during password update:", err);
            setErrorMessage("Unauthorized: " + err.response.data.msg);
            setUpdatingPassword(false);
            return 
        }
    }

    return (
        <>
            <div className="page-container">
                <div className="form-container">
                    <div className="card">
                        <h2>Update Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="oldPassword">Current Password</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}