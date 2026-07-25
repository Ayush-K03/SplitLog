import axios from "axios";
axios.defaults.withCredentials = true;
export async function fetchProfileData() {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`);
  return res.data;
}