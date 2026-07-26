import axios from "axios";
axios.defaults.withCredentials = true;

export async function dashBoardLoad(){
    try {
        const groupData = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups/my-groups`)).data;
        const {positiveBalance,negativeBalance} = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/summary`)).data;
        return {groupData, positiveBalance, negativeBalance};
    } catch(err) {
        const status = err?.response?.status || 500;
        throw Object.assign(new Error("Failed to load dashboard"), { status });
    }
}