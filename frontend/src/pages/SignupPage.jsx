
import {useState} from "react"
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function SignUpPage (){
  const [email,setEmail]= useState("")
  const [password,setPassword]= useState("")
  const [firstName,setfirstName]= useState("")
  const [lastName,setlastName]= useState("")
  const [showError,setShowError]=useState(false);
  const navigate = useNavigate();

  async function handleAccountCreation() {
    try{
      const res = await axios.post("/api/auth/signup",{email,password,firstName,lastName});
      return navigate("/dashboard", {replace:true});
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
            <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Create Account</h1>
            <p className="text-muted">Join SplitLog to manage expenses</p>
          </div>

          {showError && (
            <div className="alert alert-error">
              <span>⚠️</span>
              Invalid entries. Please try again.
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleAccountCreation(); }}>
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Create Account
            </button>
          </form>

          <div className="text-center mt-2">
            <p className="text-muted">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}




