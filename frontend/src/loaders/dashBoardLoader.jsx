import axios from "axios";
import { useLoaderData,RouterProvider,createBrowserRouter, Routes, Route,Outlet,Navigate } from "react-router-dom";



export async function dashBoardLoad(user){
    const groupData= (await axios.get(`${import.meta.env.BACKEND_URL}/api/groups/my-groups`)).data;
    const {positiveBalance,negativeBalance} = (await axios.get(`${import.meta.env.BACKEND_URL}/api/summary`)).data;
    // console.log(positiveBalance)
    return {groupData,positiveBalance,negativeBalance};
}