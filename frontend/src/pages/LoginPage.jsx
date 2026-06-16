import {backdropStyle,boxStyle} from "../assets/errorBox"


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
    }

    finally{
      const timerId = setTimeout(()=>{
        setShowError(false);
      },2500)
    }
  }




  return(
    <>
      {showError && (<div style={backdropStyle} ><div style={boxStyle}>Invalid Credentials.. Please check and try again</div></div>) }
      <label>Email: </label>
      <input type="text" value ={email} onChange={(e)=> setEmail(e.target.value)}/>
      <br />
      <label>Password: </label>
      <input type="text" value ={password} onChange={(e)=> setPassword(e.target.value)}/>  
      <br />  
      <button onClick={handleAccountLogin}>Submit</button>
      <pre>No Account ?</pre>
      <Link to="/signup"><h6>Create Account</h6></Link>
    </>
  );
}


