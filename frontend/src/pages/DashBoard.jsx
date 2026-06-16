import {useState,useEffect} from "react"
import { useNavigate,useLoaderData,RouterProvider,createBrowserRouter, Routes, Route,Outlet,Navigate } from "react-router-dom";



export function CreateDashBoardPage(){
  const navigate = useNavigate();

  const groupData = useLoaderData();
  
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
      <button onClick={()=>{navigate("/createGroup")}}>Create Group</button>
      <button onClick={()=>{}}>Join Group</button>
    </>
  );
}

