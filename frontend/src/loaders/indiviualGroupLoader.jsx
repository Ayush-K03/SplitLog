import axios from "axios";
axios.defaults.withCredentials = true;

export async function fetchGroupList({params}){
    try {
        const groupDetails = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups/show/${params.groupId}`)).data;
        const  groupTransactionData = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${params.groupId}/expenses`)).data;
        const {userExpenseInGroup} = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${params.groupId}/balances`)).data;
        return {groupDetails, groupTransactionData, userExpenseInGroup};
    } catch(err) {
        const status = err?.response?.status || 500;
        throw Object.assign(new Error("Failed to load group"), { status });
    }
}
