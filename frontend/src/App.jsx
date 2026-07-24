import axios from "axios"
axios.defaults.withCredentials = true;
import {useState,useEffect} from "react"
import {createRoot} from "react-dom/client"
import { Link,useLoaderData,RouterProvider,createBrowserRouter,Outlet,useNavigate,useNavigation } from 'react-router-dom';

import { LoginPage } from "./pages/LoginPage";
import {SignUpPage} from "./pages/SignupPage"
import { CreateDashBoardPage } from "./pages/DashBoard";
import { CreateGroupForm } from "./pages/CreateGroups";
import { ShowGroupDetails } from "./pages/ViewGroup";
import { JoinGroup } from "./pages/JoinGroup";
import { AddExepense } from "./pages/AddExpense";
import { ShowPastSettlements } from "./pages/PastSettlement";


import { fetchGroupList } from "./loaders/indiviualGroupLoader";
import { participantsList } from "./loaders/fetchParticipant"; 
import { dashBoardLoad } from "./loaders/dashBoardLoader";
import { getDataForSettlement } from "./loaders/pastSettlementLoader";


import {handleLogout} from "./helper_functions/logoutProcess";

const root = createRoot(document.getElementById("root"));
export let user ={};

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
        path : "/pastSettlement",
        element : <ShowPastSettlements/>,
        loader : getDataForSettlement
      },
      {
        path: "/groupDetails/:groupId",
        element: <ShowGroupDetails />,
        loader: fetchGroupList
      },
      {
        path: "/:groupId/addExpense",
        element: <AddExepense />,
        loader: participantsList
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
  const navigation=useNavigation();

  const [isLoading,setIsLoading] = useState(true);
  const [isAuthenticated,setIsAuthenticated] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  
  
  useEffect(()=>{
    async function checkAuth(){
      try{
        const res= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify`);
        if (res.data.isAuthenticated){
          setIsAuthenticated(true);
          user= res.data.user;
          console.log(user);
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
  
  useEffect(()=>{
    if (!isAuthenticated  && !isLoading) navigate("/", {replace:true} )
  },[isAuthenticated,isLoading]);


  if (isLoading){
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }
  console.log(isAuthenticated,"-authentication");

  console.log(isAuthenticated,"is valid !");
  try {
    if (isAuthenticated) {
      return(
        <div className="app-container">
          <header className="app-header">
            <div className="header-content">
              <Link to="/dashboard" className="header-logo">
                <span className="logo-icon">💰</span>
                SplitLog
              </Link>
              <nav className="header-nav">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/createGroups">Create Group</Link>
                <Link to="/joinGroup">Join Group</Link>
                <Link to="/pastSettlement">Past Settlements</Link>
                <button 
                  onClick={toggleTheme}
                  className="btn-icon"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </nav>
            </div>
          </header>
          <Outlet />
        </div>
      )
    }
  }
  catch (err){
    console.log(err);
  }
  finally{
    if (!isAuthenticated) navigate("/login", {replace:true} );
  }
}



root.render(<App/>);
