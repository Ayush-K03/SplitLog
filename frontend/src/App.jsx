import axios from "axios"
import {useState,useEffect} from "react"

import {createRoot} from "react-dom/client"
import { useLoaderData,RouterProvider,createBrowserRouter,Outlet,useNavigate } from 'react-router-dom';

import { LoginPage } from "./pages/LoginPage";
import {SignUpPage} from "./pages/SignupPage"
import { CreateDashBoardPage } from "./pages/DashBoard";

import { fetchGroupList } from "./loaders/indiviualGroupLoader";
import { dashBoardLoad } from "./loaders/dashBoardLoader";


import { CreateGroupForm } from "./pages/CreateGroups";
import { ShowGroupDetails } from "./pages/ViewGroup";
import { JoinGroup } from "./pages/JoinGroup";
import { AddExepense } from "./pages/AddExpense";


const root = createRoot(document.getElementById("root"));
let user ={};

const myMainRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignUpPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <CreateDashBoardPage />,
        loader: dashBoardLoad
      },
      {
        path: "/createGroups",
        element: <CreateGroupForm />
      },
      {
        path: "/joinGroup",
        element: <JoinGroup />
      },
      {
        path: "/groupDetails/:groupId",
        element: <ShowGroupDetails />,
        loader: fetchGroupList
      },
      {
        path: "/:groupId/addExpense",
        element: <AddExepense />
      },
      {
        path: "/:groupId/expense_list",
        element: <AddExepense />
      }
    ]
  }
])

export function App() {
  return <RouterProvider router={myMainRouter} />
}


function ProtectedRoute(){
  const navigate=useNavigate();
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


  if (isLoading){
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  console.log(isAuthenticated,"is valid !");

  if (isAuthenticated) {
    return(
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <a href="/dashboard" className="header-logo">
              <span className="logo-icon">💰</span>
              SplitLog
            </a>
            <nav className="header-nav">
              <a href="/dashboard">Dashboard</a>
              <a href="/createGroups">Create Group</a>
              <a href="/joinGroup">Join Group</a>
            </nav>
          </div>
        </header>
        <Outlet />
      </div>
    )
  }

  else navigate("/login", {replace:true} );
}



root.render(<App/>);
