import axios from 'axios'
axios.defaults.withCredentials = true;
export async function getDataForSettlement() {
    try{
        const mySettlements= (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/past_settlements`)).data
        console.log(mySettlements.data);
        return {mySettlements};
    }
    catch(err){
        console.log(err);
        return { mySettlements: [] }
    }
}