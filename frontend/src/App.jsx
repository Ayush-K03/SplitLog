import axios from "axios"
import {useState,useEffect} from "react"
import {createRoot} from "react-dom/client"
import { Link,useLoaderData,RouterProvider,createBrowserRouter,Outlet,useNavigate,useNavigation,useRouteError } from 'react-router';
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
import { ErrorPage } from "./pages/ErrorPage";

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

// Global error boundary element for router-level errors (loader throws, etc.)
function GlobalErrorBoundary() {
  const error = useRouteError();
  const statusCode = error?.status || error?.statusCode || 500;
  if (statusCode === 404) {
    return <ErrorPage typeOfError="NOT_FOUND" statusCode={404} />;
  }
  return <ErrorPage typeOfError="SERVER_ERROR" statusCode={statusCode} />;
}

const myMainRouter = createBrowserRouter([
  {
    path: "/",
    element: <ShowHomePage />,
    errorElement: <GlobalErrorBoundary />
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <GlobalErrorBoundary />
  },
  {
    path: "/signup",
    element: <SignUpPage />,
    errorElement: <GlobalErrorBoundary />
  },
  {
    element: <ProtectedRoute />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: "/dashboard",
        element: <CreateDashBoardPage />,
        loader: dashBoardLoad,
        errorElement: <GlobalErrorBoundary />
      },
      {
        path: "/createGroups",
        element: <CreateGroupForm />,
        errorElement: <GlobalErrorBoundary />
      },
      {
        path: "/joinGroup",
        element: <JoinGroup />,
        errorElement: <GlobalErrorBoundary />
      },
      {
        path : "/pastSettlement",
        element : <ShowPastSettlements/>,
        loader : getDataForSettlement,
        errorElement: <GlobalErrorBoundary />
      },
      {
        path: "/groupDetails/:groupId",
        element: <ShowGroupDetails />,
        loader: fetchGroupList,
        errorElement: <GlobalErrorBoundary />
      },
      {
        path: "/:groupId/addExpense",
        element: <AddExepense />,
        loader: participantsList,
        errorElement: <GlobalErrorBoundary />
      },
      {
        path: "/:groupId/expense_list",
        element: <AddExepense />,
        loader: participantsList,
        errorElement: <GlobalErrorBoundary />
      },
      {
        path: "/profile",
        element: <GetUserProfile />,
        loader: fetchProfileData,
        errorElement: <GlobalErrorBoundary />
      },
      {
        path: "/update-password",
        element: <UpdatePassword />,
        errorElement: <GlobalErrorBoundary />
      }
    ]
  },
  {
    // Catch-all for invalid URLs → 404 not found page
    path: "*",
    element: <ErrorPage typeOfError="NOT_FOUND" statusCode={404} />
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
      
      <span className="logo-icon"><img src="/favicon.png" alt="SplitLog" /></span>
      <span className="logo-text">
        <span className="logo-text-split">Split</span><span className="logo-text-log">Log</span>
      </span>
      </Link>
      <nav className="header-nav">
      {/* <Link to="/profile" className="header-logo">Profile</Link> */}
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/createGroups">Create Group</Link>
      <Link to="/joinGroup">Join Group</Link>
      <Link to="/pastSettlement">Past Settlements</Link>
      <Link to="/profile" className="header-logo header-profile-link">
        <img
          src={getAvatarUrl(user.name,user.lastName)}
          style={avatarStylesMini}
          alt="User Profile"
        />
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
