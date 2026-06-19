// import {backdropStyle,boxStyle} from "../assets/errorBox"
import {useState,useEffect} from "react"
import axios from "axios";
import {useNavigate,Link} from "react-router-dom"

export function LoginPage (){
  const [email,setEmail]= useState("")
  const [password,setPassword]= useState("")
  const [showError,setShowError]= useState(false)
  const navigate = useNavigate();

  async function handleAccountLogin() {
    try{
      const res = await axios.post("/api/auth/login",{email,password});
      return navigate("/dashboard",{replace:true})
    }
    catch(err){
      setShowError(true);
      setTimeout(()=>setShowError(false),2500)
    }
  }



  return (
    <div className="app-container">
      <div className="form-container">
        <div className="card">
          <div className="text-center mb-3">
            <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Sign in to SplitLog</h1>
            <p className="text-muted">Manage your shared expenses easily</p>
          </div>

          {showError && (
            <div className="alert alert-error">
              <span>⚠️</span>
              Invalid credentials. Please try again.
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleAccountLogin(); }}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Sign In
            </button>
          </form>

          <div className="text-center mt-2">
            <p className="text-muted">
              Don't have an account?{' '}
              <Link to="/signup">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


