import axios from "axios";
export async function fetchGroupList({params}){
    const groupDetails= (await axios.get (`${import.meta.env.BACKEND_URL}/api/groups/show/${params.groupId}`)).data;
    const  groupTransactionData = (await axios.get(`${import.meta.env.BACKEND_URL}/api/${params.groupId}/expenses`)).data;
    const {userExpenseInGroup} = (await axios.get(`${import.meta.env.BACKEND_URL}/api/${params.groupId}/balances`)).data;
    console.log(userExpenseInGroup);
    return {groupDetails,groupTransactionData,userExpenseInGroup};
}

