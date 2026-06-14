import {createRoot} from "react-dom/client"
import {useState,useEffect} from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = createRoot(document.getElementById("root"));




function LoginPage (){
  const [email,setEmail]= useState("")
  const [password,setPassword]= useState("")
  return(
    <>
      <label>Email: </label>
      <input type="text" value ={email} onChange={(e)=> setEmail(e.target.value)}/>
      <br />
      <label>Password: </label>
      <input type="text" value ={password} onChange={(e)=> setPassword(e.target.value)}/>  
      <br />  
      <button onClick={handleAccountLogin(email,password)}>Submit</button>
    </>
  );
}

function SignUpPage (){
  const [email,setEmail]= useState("")
  const [password,setPassword]= useState("")
  const [firstName,setfirstName]= useState("")
  const [lastName,setlastName]= useState("")


  return(
    <>
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


async function handleAccountLogin(email,password) {
  const res = await axios.post("http://localhost:8000/api/auth/login",{email,password});
  console.log(res);
}

async function handleAccountCreation() {
  const res = await axios.get();
}


export function App(){
  console.log('Hello');
  return(
    <SignUpPage/>
  );
}
root.render(<App/>);