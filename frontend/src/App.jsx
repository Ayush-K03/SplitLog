import axios from "axios"
import {useState,useEffect} from "react"

import {createRoot} from "react-dom/client"
import { useLoaderData,RouterProvider,createBrowserRouter, Routes, Route,Outlet,Navigate } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import {SignUpPage} from "./pages/SignupPage"
import { CreateDashBoardPage } from "./pages/DashBoard";

import { fetchGroupList } from "./loaders/indiviualGroupLoader";
import { dashBoardLoad } from "./loaders/dashBoardLoader";
import { CreateGroupForm } from "./pages/CreateGroups";
import { ShowGroupDetails } from "./pages/ViewGroup";
import { JoinGroup } from "./pages/JoinGroup";


const root = createRoot(document.getElementById("root"));
let user ={};

const myMainRouter =  createBrowserRouter([
  {path:"/", element:<LoginPage/>},
  {path:"/login", element:<LoginPage/>},
  {path:"/signup", element:<SignUpPage/>},
  {element: <ProtectedRoute/>, children : [
    {path: "/dashboard", element:<CreateDashBoardPage/>, loader:dashBoardLoad},
    {path: "/createGroups", element:<CreateGroupForm/>},
    {path: "/joinGroup", element:<JoinGroup/>},
    {path: "/groupDetails/:groupId", element:<ShowGroupDetails/>, loader:fetchGroupList}
  ]}
])

export function App(){
  return (<RouterProvider router={myMainRouter} />);
}


function ProtectedRoute(){
  const [isLoading,setIsLoading] = useState(true);
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  useEffect(()=>{
    async function checkAuth(){
      try{
        const res= await axios.get("/api/verify");

        if (res.data.isAuthenticated){
          setIsAuthenticated(true);
          user= res.data.user;
        }
      }
      catch(err){
        console.log(err);
        setIsAuthenticated(false);
      }

      finally{
        setIsLoading(false);
      }
    }
    checkAuth();

  },[]);


  if (isLoading) return <div>Loading Page... Please Wait</div>;
  console.log(isAuthenticated,"is valid !");
  if (isAuthenticated) {return <Outlet/>;}
  else {return <Navigate to = "/login" replace/>;}
}

// function PublicRoute(){
//   const [isLoading, seIsLoading]= useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(()=>{
//     async function checkIsLoggedIn(){
//       try{
//         const res = await axios.get("/api/verify");
//         if (res.data.isAuthenticated) return <Outlet/>;
//       }
//     }
//   },[])


// }






root.render(<App/>);