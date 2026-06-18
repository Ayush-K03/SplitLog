import axios from "axios";
import { useLoaderData,RouterProvider,createBrowserRouter, Routes, Route,Outlet,Navigate } from "react-router-dom";



export async function dashBoardLoad(user){
    const groupData= (await axios.get("api/groups/my-groups")).data;
    const {positiveBalance,negativeBalance} = (await axios.get("api/summary")).data;
    // console.log(positiveBalance)
    return {groupData,positiveBalance,negativeBalance};
}