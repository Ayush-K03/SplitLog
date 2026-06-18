import {useState,useEffect} from "react"
import { useNavigate,useLoaderData,RouterProvider,createBrowserRouter, Routes, Route,Outlet,Navigate } from "react-router-dom";



export function CreateDashBoardPage(){
  const navigate = useNavigate();

  const {groupData,positiveBalance,negativeBalance} = useLoaderData();
  

  return (
    <>
      Welcome User
      <br />
      Your Groups : 
      {(groupData.length==0) ? "you are not in any group" : groupData.map((value)=>{
        return (<>
          <div key={value}>
            {value.groupName}
            <button onClick={()=>navigate(`/groupDetails/${value.gId}`)}>View Group</button>
          </div>
        </>)
      })}

      <br />
      <h2>You are owed : {positiveBalance}</h2>
      <h2>You are owe : {negativeBalance}</h2>
      <h2></h2>
      <button onClick={()=>{navigate("/createGroups")}}>Create Group</button>
      <button onClick={()=>{}}>Join Group</button>
    </>
  );
}

