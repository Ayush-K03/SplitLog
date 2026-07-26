// import {backdropStyle,boxStyle} from "../assets/errorBox"
import {useState,useEffect} from "react"
import axios from "axios";
import {useNavigate,Link} from "react-router"
import {showNotification} from "../helper_functions/toast_helper";
axios.defaults.withCredentials = true;

export function LoginPage (){
  const [email,setEmail]= useState("")
  const [password,setPassword]= useState("")
  const [formSubmission,setFormSubmission] = useState(false);
  const navigate = useNavigate();




  async function handleAccountLogin() {
    setFormSubmission(true);
    try{
      //validating email and password before sending to server
      if (email.trim().length<=0 || !email.includes("@") || !email.includes(".")) {
        showNotification("error","Please enter a valid email address");
        setFormSubmission(false);
        return;
      }
      if (password.trim().length < 8 ) {
        showNotification("error","Password should at least 8 characters long");
        setFormSubmission(false);
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,{email:email.toLowerCase().trim(),password});
      showNotification("success","Login successful");
      setTimeout(()=>navigate("/dashboard",{replace:true}),1000)
      return
    }
    catch(err){
      console.log(err.status)
      showNotification("error",`${err.response?.data?.msg}` || "An error occurred while logging in.");
      setFormSubmission(false);
    }
  }



  return (
    <div className="app-container">
      <div className="form-container">
        <div className="card">
          <div className="text-center mb-3">
            <div className="auth-brand">
              <span className="logo-icon"><img src="/favicon.png" alt="SplitLog" /></span>
              <span className="auth-brand-name logo-text">
                <span className="logo-text-split">Split</span><span className="logo-text-log">Log</span>
              </span>
            </div>
            <h1 style={{ fontSize: '22px', marginBottom: '6px', fontWeight: 700 }}>Welcome back</h1>
            <p className="text-muted" style={{ marginBottom: 0 }}>Sign in to manage your shared expenses</p>
          </div>


          <form onSubmit={(e) => { e.preventDefault(); handleAccountLogin(); }}>
            <div className="form-group">
              {formSubmission ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                </>
              )} 
            </div>


            <button disabled={formSubmission} type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {formSubmission ? "Signing in..." : "Sign In"}
            </button>
          </form>


          <div className="text-center mt-2">
            <p className="text-muted">
              Don't have an account?{' '}
              <Link to="/signup">Create Account</Link>
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


