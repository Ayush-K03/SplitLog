
import {useState} from "react"
import axios from "axios";
import {useNavigate} from "react-router";
import { showNotification } from "../helper_functions/toast_helper";
axios.defaults.withCredentials = true;

export function SignUpPage (){
  const [email,setEmail]= useState("")
  const [password,setPassword]= useState("")
  const [firstName,setfirstName]= useState("")
  const [lastName,setlastName]= useState("")

  const [formSubmission,setFormSubmission] = useState(false);
  const navigate = useNavigate();

  async function handleAccountCreation() {
    setFormSubmission(true);
    try{


      //validating email and password before sending to server
      if (email.trim().length<=0 || !email.includes("@") || !email.includes(".")) {
        showNotification("error","Please enter a valid email address");
        setFormSubmission(false);
        return;
      }
      if (password.trim().length < 8) {
        showNotification("error","Password should at least 8 characters long");
        setFormSubmission(false);
        return;
      }

      if (firstName.trim().length <= 0) {
        showNotification("error","First name cannot be empty");
        setFormSubmission(false);
        return;
      }
      if (lastName.trim().length <= 0) {
        showNotification("error","Last name cannot be empty");
        setFormSubmission(false);
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,{email:email.toLowerCase().trim(),password,firstName,lastName});
      setTimeout(()=>navigate("/dashboard", {replace:true}),1000)
      showNotification("success","Account created successfully");
      return ;
    }

    catch(err){
      console.log(err.status)
      console.log("here")
      console.log(`${err.response?.data?.msg}` || "An error occurred while creating the account.")
      setFormSubmission(false);
      showNotification("error",`${err.response?.data?.msg}` || "An error occurred while creating the account.");
    }
  }



  return (
    <div className="app-container">
      <div className="form-container">
        <div className="card">
          <div className="text-center mb-3">
            <div className="auth-brand">
              <span className="logo-icon"><img src="/favicon.jpg" alt="SplitLog" /></span>
              <span className="auth-brand-name">SplitLog</span>
            </div>
            <h1 style={{ fontSize: '22px', marginBottom: '6px', fontWeight: 700 }}>Create Account</h1>
            <p className="text-muted" style={{ marginBottom: 0 }}>Join SplitLog to split expenses effortlessly</p>
          </div>



          <form onSubmit={(e) => { e.preventDefault(); handleAccountCreation(); }}>
            {formSubmission ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                    required
                    />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                  required
                  />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>
            </>
)}
            <button disabled={formSubmission} type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {formSubmission ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-2">
            <p className="text-muted">
              Already have an account?{' '}
              <a href="/login">Sign In</a>
            </p>
          </div>
          <div className="auth-trust">
            <span>🔒 Secure &amp; encrypted</span>
            <span>⚡ Instant balances</span>
            <span>🤝 Free forever</span>
          </div>
        </div>
      </div>
    </div>
  )
}




