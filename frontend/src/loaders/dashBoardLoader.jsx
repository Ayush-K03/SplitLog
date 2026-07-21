import axios from "axios";
axios.defaults.withCredentials = true;
import { useLoaderData,RouterProvider,createBrowserRouter, Routes, Route,Outlet,Navigate } from "react-router-dom";



export async function dashBoardLoad(){
    const groupData= (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups/my-groups`)).data;
    const {positiveBalance,negativeBalance} = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/summary`)).data;
    // console.log(positiveBalance)
    return {groupData,positiveBalance,negativeBalance};
}