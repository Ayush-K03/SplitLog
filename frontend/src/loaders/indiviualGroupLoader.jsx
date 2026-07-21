import axios from "axios";
axios.defaults.withCredentials = true;
export async function fetchGroupList({params}){
    const groupDetails= (await axios.get (`${import.meta.env.VITE_BACKEND_URL}/api/groups/show/${params.groupId}`)).data;
    const  groupTransactionData = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${params.groupId}/expenses`)).data;
    const {userExpenseInGroup} = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${params.groupId}/balances`)).data;
    return {groupDetails,groupTransactionData,userExpenseInGroup};
}

