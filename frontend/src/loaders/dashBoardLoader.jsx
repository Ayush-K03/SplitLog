import axios from "axios";
axios.defaults.withCredentials = true;
import { useLoaderData,RouterProvider,createBrowserRouter, Routes, Route,Outlet,Navigate } from "react-router";



export async function dashBoardLoad(){
    // console.log(`${import.meta.env.VITE_BACKEND_URL}/api/groups/my-groups`)
    const groupData = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups/my-groups`)).data;
    const {positiveBalance,negativeBalance} = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/summary`)).data;
    console.log(groupData)
    return {groupData,positiveBalance,negativeBalance};
}