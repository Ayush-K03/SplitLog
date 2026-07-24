import axios from 'axios'
axios.defaults.withCredentials = true;

export async function handleLogout (){
    const loggedOut = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`)
}