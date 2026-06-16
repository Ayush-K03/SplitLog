import axios from "axios";
import { useLoaderData,RouterProvider,createBrowserRouter, Routes, Route,Outlet,Navigate } from "react-router-dom";



export async function dashBoardLoad(user){
    const res= await axios.get("api/groups/my-groups");
    const groupData=(res.data);
    console.log(groupData);
    return groupData;
}