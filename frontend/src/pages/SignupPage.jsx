import {backdropStyle,boxStyle} from "../assets/errorBox"








import {useState,useEffect} from "react"
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
      console.log(err);
    }
    
    finally{
      const timerId = setTimeout(()=>{
        setShowError(false);
      },2500)
    }
  }



  return(
    <>

      {showError && (<div style={backdropStyle}>
        <div style={boxStyle}>Invalid Entries ... Please try again !</div>
      </div>)}

      <label>First Name: </label>
      <input type="text" value ={firstName} onChange={(e)=> setfirstName(e.target.value)}/>
      <br />
      <label>Last Name: </label>
      <input type="text" value ={lastName} onChange={(e)=> setlastName(e.target.value)}/>
      <br />
      <label>Email: </label>
      <input type="text" value ={email} onChange={(e)=> setEmail(e.target.value)}/>
      <br />
      <label>Password: </label>
      <input type="text" value ={password} onChange={(e)=> setPassword(e.target.value)}/>  
      <br />  
      {/* <label>Confirm Password: </label>
      <input type="text" />  
      <br />   */}
      <button onClick={handleAccountCreation}>Create Account</button>
    </>
  );
}




