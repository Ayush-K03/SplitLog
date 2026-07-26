import axios from "axios";
import { redirect } from "react-router";

axios.defaults.withCredentials = true;

export async function redirectIfLoggedIn() {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify`);
        if (res.data.isAuthenticated) {
            return redirect("/dashboard");
        }
    } catch (err) {
        // Not authenticated or network error; allow the page to load
        return null;
    }
    return null;
}
