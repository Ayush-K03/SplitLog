import axios from "axios";
export async function fetchGroupList({params}){
    const groupDetails= (await axios.get (`/api/groups/show/${params.groupId}`)).data;
    const  groupTransactionData = (await axios.get(`/api/${params.groupId}/expenses`)).data;
    const {userExpenseInGroup} = (await axios.get(`/api/${params.groupId}/balances`)).data;
    console.log(userExpenseInGroup);
    return {groupDetails,groupTransactionData,userExpenseInGroup};
}

