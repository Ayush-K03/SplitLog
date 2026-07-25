import axios from "axios"
import {useState,useEffect} from "react"
import {createRoot} from "react-dom/client"
import { Link,useLoaderData,RouterProvider,createBrowserRouter,Outlet,useNavigate,useNavigation } from 'react-router';
import { ToastContainer } from 'react-toastify';


import { LoginPage } from "./pages/LoginPage";
import {SignUpPage} from "./pages/SignupPage"
import { CreateDashBoardPage } from "./pages/DashBoard";
import { CreateGroupForm } from "./pages/CreateGroups";
import { ShowGroupDetails } from "./pages/ViewGroup";
import { JoinGroup } from "./pages/JoinGroup";
import { AddExepense } from "./pages/AddExpense";
import { ShowPastSettlements } from "./pages/PastSettlement";
import { ShowHomePage } from "./pages/HomePage";

import { fetchGroupList } from "./loaders/indiviualGroupLoader";
import { participantsList } from "./loaders/fetchParticipant"; 
import { dashBoardLoad } from "./loaders/dashBoardLoader";
import { getDataForSettlement } from "./loaders/pastSettlementLoader";


import {handleLogout} from "./helper_functions/logoutProcess";
import { GetUserProfile } from "./pages/ProfilePage";
import { fetchProfileData } from "./loaders/fetchProfileData";
import { UpdatePassword } from "./pages/UpdatePassword";

import {getAvatarUrl , avatarStylesMini,avatarContainerStyles,avatarLabelStyles } from "./helper_functions/avatar_link_url.js";

axios.defaults.withCredentials = true;


const root = createRoot(document.getElementById("root"));
export let user ={};

const myMainRouter = createBrowserRouter([
  {
    path: "/",
    element: <ShowHomePage />
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
      },
      {
        path: "/profile",
        element: <GetUserProfile />,
        loader: fetchProfileData
      },
      {
        path: "/update-password",
        element: <UpdatePassword />
      }
    ]
  }
])

export function App() {
  return (
    <>
      <RouterProvider router={myMainRouter} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>)
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


  if (navigation.state == "loading"){
    return(
      <>
          <div className="loading-container">
              <div className="loading-spinner">
              </div>
          </div>
      </>
    )
  }

  if (!isAuthenticated) {
  return null; // Renders a blank screen safely while the navigate() hook runs
  }


    return(
      <div className="app-container">
      <header className="app-header">
      <div className="header-content">
      <Link to="/dashboard" className="header-logo">
      
      <span className="logo-icon">💰</span>
      SplitLog
      </Link>
      <nav className="header-nav">
      <pre>Welcome {user.name} #{user.userId.slice(0,5)}</pre>
      {/* <Link to="/profile" className="header-logo">Profile</Link> */}
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/createGroups">Create Group</Link>
      <Link to="/joinGroup">Join Group</Link>
      <Link to="/pastSettlement">Past Settlements</Link>
      <Link to="/profile" className="header-logo"> 
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img 
            src={getAvatarUrl(user.name)} 
            style={avatarStylesMini} 
            alt="User Profile Menu" 
          />
        </div>
      </Link>
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




root.render(<App/>);
