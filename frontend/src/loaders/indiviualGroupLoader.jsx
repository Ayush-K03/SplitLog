import axios from "axios";
export async function fetchGroupList({params}){
    const res = await axios.get (`/api/groups/show/${params.groupId}`);
    const groupData = (res.data);
    return groupData;
}