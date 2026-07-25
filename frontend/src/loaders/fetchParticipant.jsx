import axios from 'axios';
axios.defaults.withCredentials = true;
import { user } from '../App';
export async function participantsList({params}){
    const [groupRes, verifyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups/show/${params.groupId}`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify`)
    ]);
    const currentUserId = verifyRes.data.user?.userId;
    const participantsDetails = groupRes.data.members.filter(value => value._id != currentUserId);
    return {participantsDetails};
}