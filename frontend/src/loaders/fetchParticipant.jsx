import axios from 'axios';
axios.defaults.withCredentials = true;
export async function participantsList({params}){
    const memberDetails= (await axios.get (`${import.meta.env.VITE_BACKEND_URL}/api/groups/show/${params.groupId}`)).data;
    const owner  = memberDetails.createdBy.firstName;
    const participantsDetails = memberDetails.members.filter(value=> value.firstName!= owner);
    return {participantsDetails};
}