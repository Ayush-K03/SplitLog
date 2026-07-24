import axios from 'axios';
axios.defaults.withCredentials = true;
import { user } from '../App';
export async function participantsList({params}){
    const memberDetails= (await axios.get (`${import.meta.env.VITE_BACKEND_URL}/api/groups/show/${params.groupId}`)).data;
    console.log(memberDetails)
    const participantsDetails = memberDetails.members.filter(value=> value._id!= user.userId);
    return {participantsDetails};
}